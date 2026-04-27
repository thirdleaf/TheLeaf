import { Injectable, Logger } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { pushSubscriptions, userSettings } from "@thirdleaf/db";
import { eq, and } from "drizzle-orm";
import * as webpush from "web-push";

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor() {
    const pubKey = process.env.VAPID_PUBLIC_KEY;
    const privKey = process.env.VAPID_PRIVATE_KEY;
    const email = process.env.VAPID_EMAIL || "admin@tradeforge.in";

    if (pubKey && privKey) {
      webpush.setVapidDetails(`mailto:${email}`, pubKey, privKey);
    } else {
      this.logger.warn("VAPID keys not configured. Push notifications are disabled.");
    }
  }

  async subscribe(userId: string, subscription: any, userAgent?: string) {
    // If it already exists, update it or ignore
    const existing = await db.query.pushSubscriptions.findFirst({
      where: and(
        eq(pushSubscriptions.userId, userId),
        eq(pushSubscriptions.endpoint, subscription.endpoint)
      )
    });

    if (existing) {
      if (!existing.isActive) {
        await db.update(pushSubscriptions)
          .set({ isActive: true })
          .where(eq(pushSubscriptions.id, existing.id));
      }
      return existing;
    }

    const [newSub] = await db.insert(pushSubscriptions).values({
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent,
      isActive: true,
    }).returning();
    
    return newSub;
  }

  async unsubscribe(userId: string, endpoint: string) {
    await db.update(pushSubscriptions)
      .set({ isActive: false })
      .where(and(
        eq(pushSubscriptions.userId, userId),
        eq(pushSubscriptions.endpoint, endpoint)
      ));
  }

  /**
   * Send a push notification to all active devices of a user.
   */
  async sendToUser(userId: string, payload: any, typeKey: string) {
    // 1. Check user settings if they have disabled this type
    const [settings] = await db.select({ notifications: userSettings.notifications })
      .from(userSettings).where(eq(userSettings.userId, userId));
      
    if (settings?.notifications) {
      const prefs = settings.notifications as Record<string, boolean>;
      if (prefs[typeKey] === false) {
        this.logger.log(`User ${userId} opted out of ${typeKey} notifications.`);
        return;
      }
    }

    // 2. Get active subscriptions
    const subs = await db.select()
      .from(pushSubscriptions)
      .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.isActive, true)));

    if (subs.length === 0) return;

    const pushPayload = JSON.stringify(payload);

    // 3. Send
    for (const sub of subs) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };

        await webpush.sendNotification(pushSubscription, pushPayload);
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription has expired or is no longer valid
          this.logger.log(`Subscription ${sub.id} expired. Marking inactive.`);
          await db.update(pushSubscriptions).set({ isActive: false }).where(eq(pushSubscriptions.id, sub.id));
        } else if (error.statusCode === 429) {
          // Rate limit / Too many requests
          this.logger.warn(`Rate limit hit for push sending. Should implement exponential backoff.`);
          // For now, continuing
        } else {
          this.logger.error(`Failed to send push to sub ${sub.id}`, error);
        }
      }
    }
  }

  // --- Wrapper Triggers ---
  
  async notifyTradeSync(userId: string, count: number, broker: string) {
    await this.sendToUser(userId, {
      title: "Trade Sync Complete",
      body: `✅ Synced ${count} new trades from ${broker}`,
      tag: "trade-sync"
    }, "tradeSync");
  }

  async notifyDrawdown(userId: string) {
    await this.sendToUser(userId, {
      title: "Drawdown Alert",
      body: `🔴 Daily loss limit reached. Consider stopping for the day.`,
      tag: "drawdown-alert"
    }, "drawdownAlerts");
  }
}
