import { generateMockAnalysis } from "@/lib/mock-ai";
import type { CompetitionAnalysis } from "@/lib/types";

export type AiProvider = "mock" | "openai" | "anthropic";

export function configuredProvider(): AiProvider {
  const value = process.env.AI_PROVIDER?.toLowerCase();
  if (value === "openai" || value === "anthropic") return value;
  return "mock";
}

const systemPrompt = `You are Nugget, an expert design competition strategist. Return only valid JSON matching this TypeScript shape:
CompetitionAnalysis { competitionTitle, summary, deadline, eligibility, entryFee, deliverables: string[], formatRequirements: string[], judgingCriteria: string[], hiddenOpportunities: string[], risks: string[], concepts: ConceptDirection[3], generatedAt }
Each ConceptDirection has title, tagline, strategy, visualMood, materialPalette: string[], juryAppeal, prompts: string[3], statement (about 150 words), boardLayout: string[], checklist: {label, detail}[].
Be specific, credible, concise, and grounded in the supplied brief.`;

export async function analyzeBrief(brief: string): Promise<{
  analysis: CompetitionAnalysis;
  provider: AiProvider;
}> {
  const provider = configuredProvider();

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return { analysis: await callOpenAI(brief), provider };
  }

  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return { analysis: await callAnthropic(brief), provider };
  }

  return { analysis: generateMockAnalysis(brief), provider: "mock" };
}

async function callOpenAI(brief: string): Promise<CompetitionAnalysis> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: brief },
      ],
    }),
  });
  if (!response.ok) throw new Error("OpenAI analysis request failed.");
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content) as CompetitionAnalysis;
}

async function callAnthropic(brief: string): Promise<CompetitionAnalysis> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-latest",
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: "user", content: brief }],
    }),
  });
  if (!response.ok) throw new Error("Anthropic analysis request failed.");
  const data = await response.json();
  const raw = data.content[0].text.replace(/^```json\s*|\s*```$/g, "");
  return JSON.parse(raw) as CompetitionAnalysis;
}
