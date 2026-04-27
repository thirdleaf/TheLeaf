import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { journalEntries, journalAiReflections, tradingRules, trades } from '@thirdleaf/db';
import { eq, and, desc, sql, between } from 'drizzle-orm';
import { EncryptionService } from '../common/security/encryption.service';
import { ModerationService } from '../common/security/moderation.service';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly moderationService: ModerationService,
  ) {}

  async createEntry(userId: string, dto: any) {
    // 1. Sanitize HTML fields if present
    const content = dto.content ? (await this.moderationService.moderateContent(dto.content)).safeContent : null;
    const preMarketNotes = dto.preMarketNotes ? (await this.moderationService.moderateContent(dto.preMarketNotes)).safeContent : null;
    const postMarketNotes = dto.postMarketNotes ? (await this.moderationService.moderateContent(dto.postMarketNotes)).safeContent : null;

    const data = {
      ...dto,
      userId,
      date: dto.date || new Date().toISOString().split('T')[0],
      // 2. Encrypt sanitized content
      content: content ? this.encryptionService.encrypt(content) : null,
      preMarketNotes: preMarketNotes ? this.encryptionService.encrypt(preMarketNotes) : null,
      postMarketNotes: postMarketNotes ? this.encryptionService.encrypt(postMarketNotes) : null,
    };

    const [entry] = await db.insert(journalEntries).values(data as any).returning();
    return entry;
  }

  async findAll(userId: string, filters: any = {}) {
    const baseFilters = [eq(journalEntries.userId, userId)];
    if (filters.type) baseFilters.push(eq(journalEntries.type, filters.type));
    
    return db.select().from(journalEntries)
      .where(and(...baseFilters))
      .orderBy(desc(journalEntries.date));
  }

  async findOne(userId: string, id: string) {
    const [entry] = await db.select().from(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
    
    if (!entry) throw new NotFoundException('Entry not found');

    // Decrypt content
    return {
      ...entry,
      content: entry.content ? this.encryptionService.decrypt(entry.content) : null,
      preMarketNotes: entry.preMarketNotes ? this.encryptionService.decrypt(entry.preMarketNotes) : null,
      postMarketNotes: entry.postMarketNotes ? this.encryptionService.decrypt(entry.postMarketNotes) : null,
    };
  }

  async saveAiReflection(userId: string, entryId: string, reflection: any) {
    const [saved] = await db.insert(journalAiReflections).values({
      userId,
      entryId,
      ...reflection,
    } as any).returning();
    return saved;
  }
}
