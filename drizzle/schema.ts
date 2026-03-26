import {
  bigint,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  paddleSubscriptionId: varchar("paddleSubscriptionId", { length: 128 }),
  paddleCustomerId: varchar("paddleCustomerId", { length: 128 }),
  plan: mysqlEnum("plan", ["starter", "pro", "agency"]).default("starter").notNull(),
  status: mysqlEnum("status", ["active", "trialing", "past_due", "canceled", "paused"]).default("trialing").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: int("cancelAtPeriodEnd").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ─── Assets ───────────────────────────────────────────────────────────────────

export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["market_research", "course", "email_campaign"]).notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  content: text("content").notNull(),           // Markdown output
  metadata: json("metadata"),                   // Structured data (modules, leads, etc.)
  tags: varchar("tags", { length: 512 }),       // Comma-separated tags
  isFavorite: int("isFavorite").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

// ─── Usage Logs ───────────────────────────────────────────────────────────────

export const usageLogs = mysqlTable("usage_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  feature: mysqlEnum("feature", ["market_research", "course_architect", "cold_emailer"]).notNull(),
  tokensUsed: bigint("tokensUsed", { mode: "number" }).default(0).notNull(),
  model: varchar("model", { length: 128 }),
  durationMs: int("durationMs"),
  success: int("success").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UsageLog = typeof usageLogs.$inferSelect;
export type InsertUsageLog = typeof usageLogs.$inferInsert;
