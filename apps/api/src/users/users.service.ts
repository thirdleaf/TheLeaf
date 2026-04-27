import { Injectable, NotFoundException } from "@nestjs/common";
import { db, users, userSettings } from "@thirdleaf/db";
import { eq } from "drizzle-orm";
import type { User, UserSettings, NewUser } from "@thirdleaf/db";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { EncryptionService } from "../common/security/encryption.service";

@Injectable()
export class UsersService {
  /**
   * UsersService handles user profile and settings management.
   * Integrates EncryptionService for data-at-rest protection of PII.
   */
  constructor(private readonly encryptionService: EncryptionService) {}

  async upsertUser(clerkId: string, dto: CreateUserDto): Promise<User> {
    const newUser = {
      clerkId,
      email: this.encryptionService.encrypt(dto.email),
      name: this.encryptionService.encrypt(dto.name),
      traderType: (dto.traderType as any) || "intraday",
      onboardingCompleted: dto.onboardingCompleted ?? false,
      plan: "solo",
      role: "trader",
    } as NewUser;

    const [upserted] = await db.insert(users).values(newUser)
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: this.encryptionService.encrypt(dto.email),
          name: this.encryptionService.encrypt(dto.name),
          updatedAt: new Date()
        }
      })
      .returning();

    // If it was newly inserted (createdAt == updatedAt usually, or we can just try to insert settings ignoring conflicts)
    await db.insert(userSettings).values({
      userId: upserted!.id,
      defaultCurrency: "INR",
      riskPerTrade: 100, // 100 basis points = 1%
      dailyLossLimit: 0,
      timezone: "Asia/Kolkata",
      notifications: {
        email: true,
        pushOnTradeClose: true,
        dailySummary: true,
        weeklyReport: false,
        riskAlerts: true,
      },
    }).onConflictDoNothing({ target: userSettings.userId });

    upserted!.email = this.encryptionService.decrypt(upserted!.email);
    upserted!.name = this.encryptionService.decrypt(upserted!.name);

    return upserted!;
  }

  /**
   * Find a user by their Clerk user ID.
   * Returns null if not found (safe for first-time auth).
   */
  async findByClerkId(clerkId: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    const user = result[0] ?? null;
    if (user) {
      user.email = this.encryptionService.decrypt(user.email);
      user.name = this.encryptionService.decrypt(user.name);
    }
    return user;
  }

  /**
   * Find a user by their internal UUID.
   */
  async findById(id: string): Promise<User> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const user = result[0]!;
    user.email = this.encryptionService.decrypt(user.email);
    user.name = this.encryptionService.decrypt(user.name);
    return user;
  }

  /**
   * Get user settings by Clerk ID.
   */
  async getUserSettings(clerkId: string): Promise<UserSettings | null> {
    const user = await this.findByClerkId(clerkId);
    if (!user) return null;

    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, user.id))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Update user settings by Clerk ID.
   */
  async updateUserSettings(
    clerkId: string,
    dto: UpdateUserSettingsDto
  ): Promise<UserSettings> {
    const user = await this.findByClerkId(clerkId);
    if (!user) {
      throw new NotFoundException("User not found. Please sync your account.");
    }

    const updateData: Partial<UserSettings> = {};
    if (dto.defaultBroker !== undefined)
      updateData.defaultBroker = (dto.defaultBroker as string).toUpperCase() as any;
    if (dto.defaultCurrency !== undefined)
      updateData.defaultCurrency = dto.defaultCurrency;
    if (dto.riskPerTrade !== undefined)
      updateData.riskPerTrade = dto.riskPerTrade;
    if (dto.dailyLossLimit !== undefined)
      updateData.dailyLossLimit = dto.dailyLossLimit;
    if (dto.timezone !== undefined) updateData.timezone = dto.timezone;
    if (dto.notifications !== undefined)
      updateData.notifications = dto.notifications;
    if (dto.customBrokeragePaise !== undefined)
      (updateData as any).customBrokeragePaise = dto.customBrokeragePaise;
    if (dto.brokerageCapPaise !== undefined)
      (updateData as any).brokerageCapPaise = dto.brokerageCapPaise;

    const [updated] = await db
      .update(userSettings)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(userSettings.userId, user.id))
      .returning();

    if (!updated) {
      throw new NotFoundException("User settings not found");
    }

    return updated;
  }
}
