/**
 * Modular AI Service Layer
 * Unified interface for OpenRouter, Gemini, OpenAI, and Anthropic
 * Falls back to the built-in Manus LLM (invokeLLM) when external keys are absent.
 */

import { invokeLLM } from "./_core/llm";

export type AIProvider = "openrouter" | "gemini" | "openai" | "anthropic" | "auto";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIGenerateOptions {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
}

export interface AIGenerateResult {
  content: string;
  model: string;
  tokensUsed: number;
  provider: string;
}

// ─── Provider Implementations ─────────────────────────────────────────────────

async function callOpenRouter(
  messages: AIMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<AIGenerateResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://launchpadpro.app",
      "X-Title": "LaunchPad Pro",
    },
    body: JSON.stringify({
      model: model || "anthropic/claude-3.5-sonnet",
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
    model: string;
    usage?: { total_tokens?: number };
  };
  return {
    content: data.choices[0]?.message?.content ?? "",
    model: data.model,
    tokensUsed: data.usage?.total_tokens ?? 0,
    provider: "openrouter",
  };
}

async function callGemini(
  messages: AIMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<AIGenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const geminiModel = model || "gemini-1.5-pro";
  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMessages = messages.filter((m) => m.role !== "system");

  const contents = userMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: systemMsg ? { parts: [{ text: systemMsg }] } : undefined,
        contents,
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error: ${err}`);
  }

  const data = (await response.json()) as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    usageMetadata?: { totalTokenCount?: number };
  };
  return {
    content: data.candidates[0]?.content?.parts[0]?.text ?? "",
    model: geminiModel,
    tokensUsed: data.usageMetadata?.totalTokenCount ?? 0,
    provider: "gemini",
  };
}

async function callOpenAI(
  messages: AIMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<AIGenerateResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || "gpt-4o",
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${err}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
    model: string;
    usage?: { total_tokens?: number };
  };
  return {
    content: data.choices[0]?.message?.content ?? "",
    model: data.model,
    tokensUsed: data.usage?.total_tokens ?? 0,
    provider: "openai",
  };
}

async function callAnthropic(
  messages: AIMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<AIGenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMessages = messages.filter((m) => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || "claude-3-5-sonnet-20241022",
      system: systemMsg || undefined,
      messages: userMessages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic error: ${err}`);
  }

  const data = (await response.json()) as {
    content: Array<{ text: string }>;
    model: string;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  return {
    content: data.content[0]?.text ?? "",
    model: data.model,
    tokensUsed: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
    provider: "anthropic",
  };
}

async function callBuiltIn(messages: AIMessage[]): Promise<AIGenerateResult> {
  const response = await invokeLLM({ messages });
  const content =
    (response as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message
      ?.content ?? "";
  return {
    content,
    model: "built-in",
    tokensUsed: 0,
    provider: "built-in",
  };
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function generateAI(
  messages: AIMessage[],
  options: AIGenerateOptions = {}
): Promise<AIGenerateResult> {
  const {
    provider = "auto",
    model = "",
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const providers: Array<() => Promise<AIGenerateResult>> = [];

  if (provider === "openrouter") {
    providers.push(() => callOpenRouter(messages, model, temperature, maxTokens));
  } else if (provider === "gemini") {
    providers.push(() => callGemini(messages, model, temperature, maxTokens));
  } else if (provider === "openai") {
    providers.push(() => callOpenAI(messages, model, temperature, maxTokens));
  } else if (provider === "anthropic") {
    providers.push(() => callAnthropic(messages, model, temperature, maxTokens));
  } else {
    // "auto" mode: try available providers in order of preference
    if (process.env.OPENROUTER_API_KEY) {
      providers.push(() => callOpenRouter(messages, model, temperature, maxTokens));
    }
    if (process.env.OPENAI_API_KEY) {
      providers.push(() => callOpenAI(messages, model, temperature, maxTokens));
    }
    if (process.env.ANTHROPIC_API_KEY) {
      providers.push(() => callAnthropic(messages, model, temperature, maxTokens));
    }
    if (process.env.GEMINI_API_KEY) {
      providers.push(() => callGemini(messages, model, temperature, maxTokens));
    }
    // Always fall back to built-in
    providers.push(() => callBuiltIn(messages));
  }

  // Try each provider in order, fall back on error
  let lastError: Error | null = null;
  for (const attempt of providers) {
    try {
      return await attempt();
    } catch (err) {
      lastError = err as Error;
      console.warn(`[AI] Provider failed, trying next:`, (err as Error).message);
    }
  }

  // Last resort: built-in
  try {
    return await callBuiltIn(messages);
  } catch (err) {
    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }
}

// ─── Prompt Templates ─────────────────────────────────────────────────────────

export const PROMPTS = {
  marketResearch: (topic: string, competitors: string, depth: string) => ({
    system: `You are an elite B2B market research analyst with expertise in competitive intelligence, 
market sizing, and strategic positioning. Your reports are used by Fortune 500 companies and 
top-tier venture-backed startups. Always structure your output in clean, professional Markdown.`,
    user: `Conduct a comprehensive market research and competitive analysis report for:

**Topic/Industry:** ${topic}
**Key Competitors to Analyze:** ${competitors || "Identify the top 5 competitors"}
**Research Depth:** ${depth || "comprehensive"}

Please produce a detailed report with the following sections:

# Market Research Report: ${topic}

## 1. Executive Summary
- Market overview and key findings
- Total Addressable Market (TAM) estimate
- Key opportunities and threats

## 2. Market Landscape
- Market size and growth trajectory
- Key market segments
- Geographic distribution
- Industry trends and drivers

## 3. Competitive Analysis
For each competitor, analyze:
- Company overview and positioning
- Product/service offerings
- Pricing strategy
- Strengths and weaknesses
- Market share estimate
- Recent strategic moves

## 4. Target Customer Profile
- Ideal Customer Profile (ICP)
- Pain points and motivations
- Buying behavior and decision criteria
- Willingness to pay

## 5. Competitive Positioning Matrix
- Feature comparison table
- Price-to-value positioning
- Differentiation opportunities

## 6. Market Entry / Growth Strategy
- Recommended positioning
- Go-to-market approach
- Key differentiators to emphasize
- Quick wins and long-term plays

## 7. Risk Assessment
- Market risks
- Competitive threats
- Regulatory considerations

## 8. Actionable Recommendations
- Top 5 immediate actions
- 90-day roadmap
- Key metrics to track

Make this report data-rich, specific, and immediately actionable.`,
  }),

  courseArchitect: (topic: string, targetAudience: string, level: string) => ({
    system: `You are a world-class instructional designer and online course creator who has built 
courses generating millions in revenue. You specialize in transforming complex topics into 
clear, engaging, and commercially successful online courses. Structure everything in clean Markdown.`,
    user: `Design a comprehensive, professional online course for:

**Course Topic:** ${topic}
**Target Audience:** ${targetAudience || "Business professionals and entrepreneurs"}
**Skill Level:** ${level || "Intermediate"}

Create a complete 8-module course with the following structure:

# Course: ${topic}
## Course Overview
- Course description (2-3 sentences)
- Learning outcomes (5-7 bullet points)
- Prerequisites
- Estimated completion time

---

For EACH of the 8 modules, provide:

## Module [N]: [Module Title]
**Duration:** [estimated time]
**Learning Objectives:**
- [3-4 specific, measurable objectives]

### Lessons:
#### Lesson [N].1: [Title]
**Script Outline:**
[3-4 paragraph detailed lesson script covering key concepts, examples, and takeaways]

**Slide Outline:**
- Slide 1: [Title] — [Key point]
- Slide 2: [Title] — [Key point]
- Slide 3: [Title] — [Key point]
- Slide 4: [Title] — [Key point]
- Slide 5: [Title] — [Key point]

#### Lesson [N].2: [Title]
[Same structure as above]

#### Lesson [N].3: [Title]
[Same structure as above]

**Module Assignment:**
[Practical exercise or project for this module]

**Resources:**
[2-3 recommended readings or tools]

---

[Repeat for all 8 modules]

## Final Project
[Capstone project description that synthesizes all modules]

## Monetization Suggestions
[How to price and sell this course]

Make the content rich, specific, and immediately usable.`,
  }),

  coldEmailer: (
    leadName: string,
    company: string,
    activity: string,
    senderProduct: string,
    count: number
  ) => ({
    system: `You are an elite B2B sales copywriter who specializes in hyper-personalized cold outreach. 
Your emails have industry-leading open rates (45%+) and reply rates (12%+). You write emails that 
feel like they were crafted by a thoughtful human who did their research, not a template. 
Always output in clean Markdown.`,
    user: `Write ${count} hyper-personalized cold email variations for this lead:

**Lead Name:** ${leadName}
**Company:** ${company}
**Recent Public Activity / Context:** ${activity}
**Your Product/Service:** ${senderProduct}

For each email variation, provide:

## Email Variation [N]: [Angle/Approach Name]

**Subject Line:** [Compelling, personalized subject]

**Opening Line (Hyper-Personalized):**
[2-3 sentences that directly reference their recent activity, making it clear you did your research]

**Body:**
[3-4 short paragraphs:
1. Bridge from their activity to a relevant pain point
2. Your solution and specific value proposition
3. Social proof or relevant case study (brief)
4. Clear, low-friction CTA]

**P.S. Line:** [Optional but powerful personalization]

---
**Why This Works:** [Brief explanation of the psychological principle and personalization angle used]

---

[Repeat for all ${count} variations]

## Personalization Notes
[Key insights about this lead that should inform all outreach]

## Follow-up Sequence
[3-email follow-up sequence outline]

Make each variation feel genuinely personal and valuable to the recipient.`,
  }),
};
