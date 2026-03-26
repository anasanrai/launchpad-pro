import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Asset,
  InsertAsset,
  InsertSubscription,
  InsertUsageLog,
  InsertUser,
  Subscription,
  assets,
  subscriptions,
  usageLogs,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export async function createAsset(data: InsertAsset): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(assets).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function getAssetsByUser(
  userId: number,
  options: {
    type?: Asset["type"];
    search?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const db = await getDb();
  if (!db) return [];

  const { type, search, limit = 20, offset = 0 } = options;

  const conditions = [eq(assets.userId, userId)];
  if (type) conditions.push(eq(assets.type, type));
  if (search) {
    conditions.push(
      or(
        like(assets.title, `%${search}%`),
        like(assets.content, `%${search}%`)
      )!
    );
  }

  return db
    .select()
    .from(assets)
    .where(and(...conditions))
    .orderBy(desc(assets.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getAssetById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(assets)
    .where(and(eq(assets.id, id), eq(assets.userId, userId)))
    .limit(1);
  return result[0] ?? undefined;
}

export async function updateAsset(
  id: number,
  userId: number,
  data: Partial<Pick<Asset, "title" | "content" | "tags" | "isFavorite" | "metadata">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(assets).set(data).where(and(eq(assets.id, id), eq(assets.userId, userId)));
}

export async function deleteAsset(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(assets).where(and(eq(assets.id, id), eq(assets.userId, userId)));
}

export async function getAssetStats(userId: number) {
  const db = await getDb();
  if (!db) return { total: 0, market_research: 0, course: 0, email_campaign: 0 };

  const all = await db
    .select({ type: assets.type })
    .from(assets)
    .where(eq(assets.userId, userId));

  return {
    total: all.length,
    market_research: all.filter((a) => a.type === "market_research").length,
    course: all.filter((a) => a.type === "course").length,
    email_campaign: all.filter((a) => a.type === "email_campaign").length,
  };
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function getSubscriptionByUserId(userId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  return result[0] ?? undefined;
}

export async function upsertSubscription(data: InsertSubscription): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(subscriptions).values(data).onDuplicateKeyUpdate({
    set: {
      plan: data.plan,
      status: data.status,
      paddleSubscriptionId: data.paddleSubscriptionId,
      paddleCustomerId: data.paddleCustomerId,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    },
  });
}

export async function updateSubscriptionByPaddleId(
  paddleSubscriptionId: string,
  data: Partial<InsertSubscription>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(subscriptions)
    .set(data)
    .where(eq(subscriptions.paddleSubscriptionId, paddleSubscriptionId));
}

// ─── Usage Logs ───────────────────────────────────────────────────────────────

export async function logUsage(data: InsertUsageLog): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(usageLogs).values(data);
}

export async function getUsageByUser(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(usageLogs)
    .where(eq(usageLogs.userId, userId))
    .orderBy(desc(usageLogs.createdAt))
    .limit(limit);
}

export async function getUsageStats(userId: number) {
  const db = await getDb();
  if (!db) return { totalTokens: 0, totalCalls: 0 };
  const logs = await db.select().from(usageLogs).where(eq(usageLogs.userId, userId));
  return {
    totalTokens: logs.reduce((sum, l) => sum + (l.tokensUsed ?? 0), 0),
    totalCalls: logs.length,
    successRate:
      logs.length > 0
        ? Math.round((logs.filter((l) => l.success === 1).length / logs.length) * 100)
        : 100,
  };
}
