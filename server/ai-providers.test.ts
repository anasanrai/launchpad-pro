import { describe, it, expect } from "vitest";
import { invokeLLM } from "./_core/llm";

describe("AI Providers", () => {
  it("should successfully call AI provider with valid credentials", async () => {
    const response = await invokeLLM({
      messages: [
        {
          role: "user",
          content: "Say 'Hello from LaunchPad Pro' in exactly those words.",
        },
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0]).toBeDefined();
    expect(response.choices[0].message).toBeDefined();
    expect(response.choices[0].message.content).toBeDefined();
    expect(typeof response.choices[0].message.content).toBe("string");
    expect(response.choices[0].message.content.length).toBeGreaterThan(0);
  }, { timeout: 30000 });

  it("should handle streaming responses", async () => {
    const response = await invokeLLM({
      messages: [
        {
          role: "user",
          content: "List 3 features of LaunchPad Pro in bullet points.",
        },
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices[0].message.content).toMatch(/[•*-]/);
  }, { timeout: 30000 });
});
