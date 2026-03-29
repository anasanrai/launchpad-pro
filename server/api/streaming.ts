import { Router, Request, Response } from "express";
import {
  streamMarketResearch,
  streamCourseArchitect,
  streamColdEmailer,
  streamROIPrediction,
} from "../streaming";

const router = Router();

/**
 * POST /api/stream/market-research
 * Stream market research report
 */
router.post("/market-research", async (req: Request, res: Response) => {
  try {
    const { market, competitors, depth = "standard" } = req.body;

    if (!market || !competitors) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await streamMarketResearch(res, market, competitors, depth);
  } catch (error) {
    console.error("[Streaming API] Market research error:", error);
    res.status(500).json({ error: "Failed to stream market research" });
  }
});

/**
 * POST /api/stream/course-architect
 * Stream course curriculum
 */
router.post("/course-architect", async (req: Request, res: Response) => {
  try {
    const { topic, targetAudience } = req.body;

    if (!topic || !targetAudience) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await streamCourseArchitect(res, topic, targetAudience);
  } catch (error) {
    console.error("[Streaming API] Course architect error:", error);
    res.status(500).json({ error: "Failed to stream course" });
  }
});

/**
 * POST /api/stream/cold-emailer
 * Stream cold email variations
 */
router.post("/cold-emailer", async (req: Request, res: Response) => {
  try {
    const { leadName, leadCompany, recentActivity, variations = 3 } = req.body;

    if (!leadName || !leadCompany || !recentActivity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await streamColdEmailer(res, leadName, leadCompany, recentActivity, variations);
  } catch (error) {
    console.error("[Streaming API] Cold emailer error:", error);
    res.status(500).json({ error: "Failed to stream emails" });
  }
});

/**
 * POST /api/stream/roi-prediction
 * Stream ROI analysis
 */
router.post("/roi-prediction", async (req: Request, res: Response) => {
  try {
    const { market, strategy, budget } = req.body;

    if (!market || !strategy || !budget) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await streamROIPrediction(res, market, strategy, budget);
  } catch (error) {
    console.error("[Streaming API] ROI prediction error:", error);
    res.status(500).json({ error: "Failed to stream ROI analysis" });
  }
});

export default router;
