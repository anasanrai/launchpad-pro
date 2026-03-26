import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateAI, PROMPTS } from "./ai";
import {
  createAsset,
  deleteAsset,
  getAssetById,
  getAssetsByUser,
  getAssetStats,
  getSubscriptionByUserId,
  getUsageByUser,
  getUsageStats,
  logUsage,
  updateAsset,
  upsertSubscription,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

// ─── Auth Router ──────────────────────────────────────────────────────────────

const authRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});

// ─── AI Market Research Router ────────────────────────────────────────────────

const marketResearchRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        topic: z.string().min(3).max(500),
        competitors: z.string().max(500).optional().default(""),
        depth: z.enum(["quick", "standard", "comprehensive"]).default("comprehensive"),
        provider: z.enum(["auto", "openrouter", "gemini", "openai", "anthropic"]).default("auto"),
        saveToAssets: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const start = Date.now();
      const prompts = PROMPTS.marketResearch(input.topic, input.competitors, input.depth);

      let result;
      try {
        result = await generateAI(
          [
            { role: "system", content: prompts.system },
            { role: "user", content: prompts.user },
          ],
          {
            provider: input.provider,
            maxTokens: input.depth === "comprehensive" ? 8192 : input.depth === "standard" ? 4096 : 2048,
            temperature: 0.7,
          }
        );
      } catch (err) {
        await logUsage({
          userId: ctx.user.id,
          feature: "market_research",
          tokensUsed: 0,
          success: 0,
          durationMs: Date.now() - start,
        });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: (err as Error).message });
      }

      await logUsage({
        userId: ctx.user.id,
        feature: "market_research",
        tokensUsed: result.tokensUsed,
        model: result.model,
        success: 1,
        durationMs: Date.now() - start,
      });

      let assetId: number | undefined;
      if (input.saveToAssets) {
        assetId = await createAsset({
          userId: ctx.user.id,
          type: "market_research",
          title: `Market Research: ${input.topic}`,
          content: result.content,
          metadata: {
            topic: input.topic,
            competitors: input.competitors,
            depth: input.depth,
            provider: result.provider,
            model: result.model,
          },
        });
      }

      return { content: result.content, assetId, model: result.model, provider: result.provider };
    }),
});

// ─── Course Architect Router ──────────────────────────────────────────────────

const courseArchitectRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        topic: z.string().min(3).max(500),
        targetAudience: z.string().max(300).optional().default(""),
        level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
        provider: z.enum(["auto", "openrouter", "gemini", "openai", "anthropic"]).default("auto"),
        saveToAssets: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const start = Date.now();
      const prompts = PROMPTS.courseArchitect(input.topic, input.targetAudience, input.level);

      let result;
      try {
        result = await generateAI(
          [
            { role: "system", content: prompts.system },
            { role: "user", content: prompts.user },
          ],
          { provider: input.provider, maxTokens: 8192, temperature: 0.75 }
        );
      } catch (err) {
        await logUsage({
          userId: ctx.user.id,
          feature: "course_architect",
          tokensUsed: 0,
          success: 0,
          durationMs: Date.now() - start,
        });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: (err as Error).message });
      }

      await logUsage({
        userId: ctx.user.id,
        feature: "course_architect",
        tokensUsed: result.tokensUsed,
        model: result.model,
        success: 1,
        durationMs: Date.now() - start,
      });

      let assetId: number | undefined;
      if (input.saveToAssets) {
        assetId = await createAsset({
          userId: ctx.user.id,
          type: "course",
          title: `Course: ${input.topic}`,
          content: result.content,
          metadata: {
            topic: input.topic,
            targetAudience: input.targetAudience,
            level: input.level,
            provider: result.provider,
            model: result.model,
          },
        });
      }

      return { content: result.content, assetId, model: result.model, provider: result.provider };
    }),
});

// ─── Cold Emailer Router ──────────────────────────────────────────────────────

const coldEmailerRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        leadName: z.string().min(1).max(200),
        company: z.string().min(1).max(200),
        activity: z.string().min(10).max(2000),
        senderProduct: z.string().min(3).max(500),
        variations: z.number().min(1).max(5).default(3),
        provider: z.enum(["auto", "openrouter", "gemini", "openai", "anthropic"]).default("auto"),
        saveToAssets: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const start = Date.now();
      const prompts = PROMPTS.coldEmailer(
        input.leadName,
        input.company,
        input.activity,
        input.senderProduct,
        input.variations
      );

      let result;
      try {
        result = await generateAI(
          [
            { role: "system", content: prompts.system },
            { role: "user", content: prompts.user },
          ],
          { provider: input.provider, maxTokens: 4096, temperature: 0.8 }
        );
      } catch (err) {
        await logUsage({
          userId: ctx.user.id,
          feature: "cold_emailer",
          tokensUsed: 0,
          success: 0,
          durationMs: Date.now() - start,
        });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: (err as Error).message });
      }

      await logUsage({
        userId: ctx.user.id,
        feature: "cold_emailer",
        tokensUsed: result.tokensUsed,
        model: result.model,
        success: 1,
        durationMs: Date.now() - start,
      });

      let assetId: number | undefined;
      if (input.saveToAssets) {
        assetId = await createAsset({
          userId: ctx.user.id,
          type: "email_campaign",
          title: `Cold Email: ${input.leadName} @ ${input.company}`,
          content: result.content,
          metadata: {
            leadName: input.leadName,
            company: input.company,
            activity: input.activity,
            senderProduct: input.senderProduct,
            variations: input.variations,
            provider: result.provider,
            model: result.model,
          },
        });
      }

      return { content: result.content, assetId, model: result.model, provider: result.provider };
    }),
});

// ─── Assets Router ────────────────────────────────────────────────────────────

const assetsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        type: z.enum(["market_research", "course", "email_campaign"]).optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return getAssetsByUser(ctx.user.id, input);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const asset = await getAssetById(input.id, ctx.user.id);
      if (!asset) throw new TRPCError({ code: "NOT_FOUND", message: "Asset not found" });
      return asset;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(512).optional(),
        tags: z.string().max(512).optional(),
        isFavorite: z.number().min(0).max(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateAsset(id, ctx.user.id, data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteAsset(input.id, ctx.user.id);
      return { success: true };
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    return getAssetStats(ctx.user.id);
  }),
});

// ─── Subscription Router ──────────────────────────────────────────────────────

const subscriptionRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return getSubscriptionByUserId(ctx.user.id);
  }),

  // Called after Paddle checkout success (client-side)
  activate: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["starter", "pro", "agency"]),
        paddleSubscriptionId: z.string().optional(),
        paddleCustomerId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await upsertSubscription({
        userId: ctx.user.id,
        plan: input.plan,
        status: "active",
        paddleSubscriptionId: input.paddleSubscriptionId,
        paddleCustomerId: input.paddleCustomerId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: 0,
      });
      return { success: true };
    }),

  plans: publicProcedure.query(() => {
    return [
      {
        id: "starter",
        name: "Starter",
        price: 49,
        currency: "USD",
        interval: "month",
        features: [
          "10 Market Research Reports/mo",
          "5 Course Blueprints/mo",
          "50 Cold Email Variations/mo",
          "Asset Library (100 items)",
          "Markdown Export",
          "Email Support",
        ],
        limits: { marketResearch: 10, courses: 5, emails: 50 },
        highlighted: false,
      },
      {
        id: "pro",
        name: "Pro",
        price: 99,
        currency: "USD",
        interval: "month",
        features: [
          "50 Market Research Reports/mo",
          "25 Course Blueprints/mo",
          "250 Cold Email Variations/mo",
          "Unlimited Asset Library",
          "All AI Providers (GPT-4, Claude, Gemini)",
          "Priority Processing",
          "PDF & Markdown Export",
          "Priority Support",
        ],
        limits: { marketResearch: 50, courses: 25, emails: 250 },
        highlighted: true,
      },
      {
        id: "agency",
        name: "Agency",
        price: 199,
        currency: "USD",
        interval: "month",
        features: [
          "Unlimited Market Research",
          "Unlimited Course Blueprints",
          "Unlimited Cold Emails",
          "Unlimited Asset Library",
          "All AI Providers + Custom Models",
          "White-label Export",
          "Team Collaboration (5 seats)",
          "API Access",
          "Dedicated Account Manager",
        ],
        limits: { marketResearch: -1, courses: -1, emails: -1 },
        highlighted: false,
      },
    ];
  }),
});

// ─── Usage Router ─────────────────────────────────────────────────────────────

const usageRouter = router({
  history: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(30) }))
    .query(async ({ ctx, input }) => {
      return getUsageByUser(ctx.user.id, input.limit);
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    return getUsageStats(ctx.user.id);
  }),
});

// ─── App Router ───────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  marketResearch: marketResearchRouter,
  courseArchitect: courseArchitectRouter,
  coldEmailer: coldEmailerRouter,
  assets: assetsRouter,
  subscription: subscriptionRouter,
  usage: usageRouter,
});

export type AppRouter = typeof appRouter;
