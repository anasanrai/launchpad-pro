import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  createAsset: vi.fn().mockResolvedValue(42),
  deleteAsset: vi.fn().mockResolvedValue(undefined),
  getAssetById: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    type: "market_research",
    title: "Test Asset",
    content: "# Test Content",
    metadata: {},
    tags: null,
    isFavorite: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getAssetsByUser: vi.fn().mockResolvedValue([]),
  getAssetStats: vi.fn().mockResolvedValue({ total: 0, market_research: 0, course: 0, email_campaign: 0 }),
  getSubscriptionByUserId: vi.fn().mockResolvedValue(null),
  getUsageByUser: vi.fn().mockResolvedValue([]),
  getUsageStats: vi.fn().mockResolvedValue({ totalCalls: 0, totalTokens: 0, successRate: 100 }),
  logUsage: vi.fn().mockResolvedValue(undefined),
  updateAsset: vi.fn().mockResolvedValue(undefined),
  upsertSubscription: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

// ─── Mock AI service ──────────────────────────────────────────────────────────
vi.mock("./ai", async (importOriginal) => {
  const original = await importOriginal<typeof import("./ai")>();
  return {
    ...original,
    generateAI: vi.fn().mockResolvedValue({
      content: "# Generated Content\n\nThis is AI-generated content.",
      model: "anthropic/claude-3.5-sonnet",
      provider: "openrouter",
      tokensUsed: 1500,
    }),
  };
});

// ─── Test context factory ─────────────────────────────────────────────────────
function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ─── Auth Tests ───────────────────────────────────────────────────────────────
describe("auth", () => {
  it("me returns authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
  });

  it("me returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });

  it("logout clears session cookie", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});

// ─── Market Research Tests ────────────────────────────────────────────────────
describe("marketResearch", () => {
  it("generates a market research report", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.marketResearch.generate({
      topic: "AI-powered CRM for SMBs",
      competitors: "Salesforce, HubSpot",
      depth: "quick",
      provider: "auto",
      saveToAssets: true,
    });
    expect(result.content).toBeTruthy();
    expect(result.content).toContain("Generated Content");
    expect(result.assetId).toBe(42);
    expect(result.provider).toBe("openrouter");
  });

  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.marketResearch.generate({
        topic: "Test topic",
        depth: "quick",
        provider: "auto",
        saveToAssets: false,
      })
    ).rejects.toThrow();
  });

  it("validates topic minimum length", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.marketResearch.generate({
        topic: "AI",
        depth: "quick",
        provider: "auto",
        saveToAssets: false,
      })
    ).rejects.toThrow();
  });
});

// ─── Course Architect Tests ───────────────────────────────────────────────────
describe("courseArchitect", () => {
  it("generates a course blueprint", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.courseArchitect.generate({
      topic: "B2B Sales Mastery",
      targetAudience: "SaaS founders",
      level: "intermediate",
      provider: "auto",
      saveToAssets: true,
    });
    expect(result.content).toBeTruthy();
    expect(result.assetId).toBe(42);
  });

  it("works without optional fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.courseArchitect.generate({
      topic: "Digital Marketing Fundamentals",
      saveToAssets: false,
    });
    expect(result.content).toBeTruthy();
    expect(result.assetId).toBeUndefined();
  });
});

// ─── Cold Emailer Tests ───────────────────────────────────────────────────────
describe("coldEmailer", () => {
  it("generates cold email variations", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.coldEmailer.generate({
      leadName: "Sarah Chen",
      company: "Acme Corp",
      activity: "Posted about scaling sales team on LinkedIn",
      senderProduct: "AI CRM that reduces data entry by 80%",
      variations: 3,
      provider: "auto",
      saveToAssets: true,
    });
    expect(result.content).toBeTruthy();
    expect(result.assetId).toBe(42);
  });
});

// ─── Assets Tests ─────────────────────────────────────────────────────────────
describe("assets", () => {
  it("lists user assets", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.assets.list({ limit: 20, offset: 0 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("gets a specific asset by id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const asset = await caller.assets.get({ id: 1 });
    expect(asset).toBeDefined();
    expect(asset.title).toBe("Test Asset");
  });

  it("returns asset stats", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.assets.stats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("market_research");
    expect(stats).toHaveProperty("course");
    expect(stats).toHaveProperty("email_campaign");
  });

  it("updates an asset", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.assets.update({ id: 1, title: "Updated Title", isFavorite: 1 });
    expect(result.success).toBe(true);
  });

  it("deletes an asset", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.assets.delete({ id: 1 });
    expect(result.success).toBe(true);
  });
});

// ─── Subscription Tests ───────────────────────────────────────────────────────
describe("subscription", () => {
  it("returns subscription plans publicly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.subscription.plans();
    expect(plans).toHaveLength(3);
    expect(plans[0].id).toBe("starter");
    expect(plans[1].id).toBe("pro");
    expect(plans[2].id).toBe("agency");
  });

  it("starter plan costs $49/month", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.subscription.plans();
    const starter = plans.find((p) => p.id === "starter");
    expect(starter?.price).toBe(49);
    expect(starter?.interval).toBe("month");
  });

  it("pro plan is highlighted", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.subscription.plans();
    const pro = plans.find((p) => p.id === "pro");
    expect(pro?.highlighted).toBe(true);
  });

  it("agency plan costs $199/month", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.subscription.plans();
    const agency = plans.find((p) => p.id === "agency");
    expect(agency?.price).toBe(199);
  });

  it("activates a subscription plan", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscription.activate({ plan: "pro" });
    expect(result.success).toBe(true);
  });

  it("gets current subscription", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const sub = await caller.subscription.get();
    expect(sub).toBeNull(); // mocked to return null
  });
});

// ─── Usage Tests ─────────────────────────────────────────────────────────────
describe("usage", () => {
  it("returns usage stats", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.usage.stats();
    expect(stats).toHaveProperty("totalCalls");
    expect(stats).toHaveProperty("totalTokens");
    expect(stats).toHaveProperty("successRate");
  });

  it("returns usage history", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const history = await caller.usage.history({ limit: 10 });
    expect(Array.isArray(history)).toBe(true);
  });
});
