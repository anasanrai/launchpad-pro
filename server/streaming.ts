import { Response } from "express";
import { invokeLLM } from "./_core/llm";

/**
 * Stream AI response using Server-Sent Events (SSE)
 * Sends chunks of text as they're generated
 */
export async function streamAIResponse(
  res: Response,
  prompt: string,
  systemPrompt: string = "You are a helpful assistant."
): Promise<void> {
  try {
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Call LLM with streaming
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    // Extract the response content
    const content = response.choices[0]?.message?.content || "";

    // Stream the content character by character with a small delay
    // This simulates real-time streaming for better UX
    const chunkSize = 1; // Send 1 character at a time
    const delayMs = 10; // 10ms between chunks

    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);

      // Send SSE message
      res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);

      // Small delay for streaming effect
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    // Send completion signal
    res.write(`data: ${JSON.stringify({ chunk: "", done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("[Streaming] Error:", error);
    res.write(
      `data: ${JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        done: true,
      })}\n\n`
    );
    res.end();
  }
}

/**
 * Stream market research report
 */
export async function streamMarketResearch(
  res: Response,
  market: string,
  competitors: string,
  depth: "quick" | "standard" | "comprehensive" = "standard"
): Promise<void> {
  const depthGuide = {
    quick: "Provide a 2-3 paragraph quick overview",
    standard: "Provide a detailed 5-7 paragraph analysis",
    comprehensive: "Provide an in-depth 10-15 paragraph comprehensive analysis",
  };

  const systemPrompt = `You are an expert market research analyst. ${depthGuide[depth]}.
Format your response in clean Markdown with:
- Executive Summary
- Market Opportunity
- Competitive Landscape
- Risk Factors
- Growth Potential`;

  const prompt = `Analyze the market for "${market}". 
Key competitors: ${competitors}
Provide actionable insights for entrepreneurs.`;

  await streamAIResponse(res, prompt, systemPrompt);
}

/**
 * Stream course architect curriculum
 */
export async function streamCourseArchitect(
  res: Response,
  topic: string,
  targetAudience: string
): Promise<void> {
  const systemPrompt = `You are an expert curriculum designer. Create a structured 8-module course.
Format your response in clean Markdown with:
- Module 1-8 titles and descriptions
- Key lessons for each module
- Learning objectives
- Estimated time per module`;

  const prompt = `Design a comprehensive 8-module course on "${topic}" for ${targetAudience}.
Include lesson scripts and slide outlines for each module.`;

  await streamAIResponse(res, prompt, systemPrompt);
}

/**
 * Stream cold email variations
 */
export async function streamColdEmailer(
  res: Response,
  leadName: string,
  leadCompany: string,
  recentActivity: string,
  variations: number = 3
): Promise<void> {
  const systemPrompt = `You are an expert cold email copywriter. Generate ${variations} unique, personalized email variations.
Format your response in clean Markdown with:
- Email Variation 1, 2, 3 (etc.)
- Each with Subject line and Body
- Make each variation unique in tone and approach`;

  const prompt = `Generate ${variations} hyper-personalized cold email opening lines for:
Name: ${leadName}
Company: ${leadCompany}
Recent Activity: ${recentActivity}

Make each email feel personal and reference their recent activity.`;

  await streamAIResponse(res, prompt, systemPrompt);
}

/**
 * Stream ROI prediction analysis
 */
export async function streamROIPrediction(
  res: Response,
  market: string,
  strategy: string,
  budget: string
): Promise<void> {
  const systemPrompt = `You are a business strategist and ROI analyst. Provide detailed ROI predictions.
Format your response in clean Markdown with:
- Success Probability Score (0-100%)
- Revenue Potential Estimate
- Risk Assessment
- Growth Opportunities
- Key Metrics and KPIs`;

  const prompt = `Analyze ROI potential for:
Market: ${market}
Strategy: ${strategy}
Budget: ${budget}

Provide realistic projections and actionable recommendations.`;

  await streamAIResponse(res, prompt, systemPrompt);
}
