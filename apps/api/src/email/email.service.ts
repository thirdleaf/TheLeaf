import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";
import { db, emailLogs } from "@thirdleaf/db";
import { eq } from "drizzle-orm";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || "noreply@tradeforge.in";
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn("RESEND_API_KEY not configured. Emails will only be logged, not sent.");
    }
  }

  /**
   * Send an email immediately and log to DB
   */
  async sendEmail(options: {
    userId?: string;
    to: string | string[];
    subject: string;
    templateName: string;
    reactElement: any;
  }) {
    const { userId, to, subject, templateName, reactElement } = options;
    const toAddressStr = Array.isArray(to) ? to.join(",") : to;

    let log: any;
    try {
      // 1. Initial log as queued
      const [newLog] = await db.insert(emailLogs).values({
        userId,
        toAddress: toAddressStr,
        templateName,
        subject,
        status: "QUEUED",
      }).returning();
      log = newLog;

      if (!this.resend) {
        this.logger.log(`Mock sent email to ${toAddressStr} (${templateName})`);
        if (log) {
          await db.update(emailLogs)
            .set({ status: "SENT", sentAt: new Date(), resendMessageId: "mock_id" })
            .where(eq(emailLogs.id, log.id));
        }
        return { success: true, messageId: "mock_id" };
      }

      // 2. Send via Resend
      const data = await this.resend.emails.send({
        from: `TradeForge <${this.fromEmail}>`,
        to,
        subject,
        react: reactElement,
      });

      if (data.error) {
        throw new Error(data.error.message);
      }

      // 3. Mark as sent
      if (log) {
        await db.update(emailLogs)
          .set({ status: "SENT", sentAt: new Date(), resendMessageId: data.data?.id })
          .where(eq(emailLogs.id, log.id));
      }

      return { success: true, messageId: data.data?.id };
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${toAddressStr}`, error);
      
      // Update log to failed
      if (log) {
        await db.update(emailLogs)
          .set({ status: "FAILED", failureReason: error.message })
          .where(eq(emailLogs.id, log.id));
      }

      return { success: false, error: error.message };
    }
  }
}
