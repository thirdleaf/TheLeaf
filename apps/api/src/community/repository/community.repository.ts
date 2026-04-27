import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { communityPosts, postReplies, postUpvotes, playbooks, playbookBookmarks, leaderboards, achievements } from "@thirdleaf/db";
import { eq, and, desc, sql, count } from "drizzle-orm";

@Injectable()
export class CommunityRepository {
  /**
   * CommunityRepository provides data access for community-related entities.
   * All methods use Drizzle ORM.
   */

  async findPosts(limit = 20, cursor?: string) {
    return db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.status, "PUBLISHED"))
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit);
  }

  async createPost(data: any) {
    const [post] = await db.insert(communityPosts).values(data).returning();
    return post;
  }

  async findPostById(id: string) {
    const [post] = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, id))
      .limit(1);
    return post;
  }

  async createReply(data: any) {
    const [reply] = await db.insert(postReplies).values(data).returning();
    // Increment reply count
    await db
      .update(communityPosts)
      .set({ replyCount: sql`${communityPosts.replyCount} + 1` })
      .where(eq(communityPosts.id, data.postId));
    return reply;
  }

  async getReplies(postId: string) {
    return db
      .select()
      .from(postReplies)
      .where(eq(postReplies.postId, postId))
      .orderBy(desc(postReplies.createdAt));
  }

  async toggleUpvote(userId: string, postId: string) {
    const [existing] = await db
      .select()
      .from(postUpvotes)
      .where(and(eq(postUpvotes.postId, postId), eq(postUpvotes.userId, userId)))
      .limit(1);

    if (existing) {
      await db.delete(postUpvotes).where(eq(postUpvotes.id, existing.id));
      await db
        .update(communityPosts)
        .set({ upvotes: sql`${communityPosts.upvotes} - 1` })
        .where(eq(communityPosts.id, postId));
      return { upvoted: false };
    } else {
      await db.insert(postUpvotes).values({ userId, postId });
      await db
        .update(communityPosts)
        .set({ upvotes: sql`${communityPosts.upvotes} + 1` })
        .where(eq(communityPosts.id, postId));
      return { upvoted: true };
    }
  }

  async findPlaybooks(limit = 20) {
    return db
      .select()
      .from(playbooks)
      .where(eq(playbooks.isPublic, true))
      .orderBy(desc(playbooks.createdAt))
      .limit(limit);
  }

  async createPlaybook(data: any) {
    const [playbook] = await db.insert(playbooks).values(data).returning();
    return playbook;
  }

  async getLeaderboard(period: any) {
    return db
      .select()
      .from(leaderboards)
      .where(eq(leaderboards.period, period))
      .orderBy(desc(leaderboards.disciplineScore))
      .limit(10);
  }

  async findAchievements(userId: string) {
    return db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedAt));
  }

  async createAchievement(data: any) {
    const [achievement] = await db.insert(achievements).values(data).returning();
    return achievement;
  }
}
