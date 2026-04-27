import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import type { Request } from "express";
import { ClerkGuard } from "../common/guards/clerk.guard";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import type { ApiResponse } from "@thirdleaf/types";
import type { User, UserSettings } from "@thirdleaf/db";

@Controller("users")
@UseGuards(ClerkGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /api/v1/users/sync
   * Called after Clerk sign-up webhook or first login to sync user to DB.
   * Protected — JWT required.
   */
  @Post("sync")
  @HttpCode(HttpStatus.OK)
  async syncUser(
    @Req() req: Request,
    @Body() dto: CreateUserDto
  ): Promise<ApiResponse<User>> {
    const clerkUserId = req.clerkUserId!;
    const user = await this.usersService.upsertUser(clerkUserId, dto);
    return { success: true, data: user, message: "User synced successfully" };
  }

  /**
   * GET /api/v1/users/me
   * Returns the current authenticated user's profile.
   */
  @Get("me")
  async getMe(@Req() req: Request): Promise<ApiResponse<User | null>> {
    const clerkUserId = req.clerkUserId!;
    const user = await this.usersService.findByClerkId(clerkUserId);
    return { success: true, data: user };
  }

  /**
   * GET /api/v1/users/me/settings
   * Returns the current user's settings.
   */
  @Get("me/settings")
  async getMySettings(
    @Req() req: Request
  ): Promise<ApiResponse<UserSettings | null>> {
    const clerkUserId = req.clerkUserId!;
    const settings = await this.usersService.getUserSettings(clerkUserId);
    return { success: true, data: settings };
  }

  /**
   * PATCH /api/v1/users/me/settings
   * Updates the current user's settings.
   */
  @Patch("me/settings")
  async updateMySettings(
    @Req() req: Request,
    @Body() dto: UpdateUserSettingsDto
  ): Promise<ApiResponse<UserSettings>> {
    const clerkUserId = req.clerkUserId!;
    const settings = await this.usersService.updateUserSettings(
      clerkUserId,
      dto
    );
    return {
      success: true,
      data: settings,
      message: "Settings updated successfully",
    };
  }
}
