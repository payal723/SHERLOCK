import { GoogleGenAI, Type } from "@google/genai";
import { env } from "./env";

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

export interface InvestigationContext {
  caseTitle: string;
  caseDescription: string | null;
  evidence: {
    id: number;
    title: string;
    description: string;
    evidenceType: string;
    source: string | null;
    confidence: number | null;
    timestamp: string | null;
  }[];
  entities: {
    name: string;
    entityType: string;
    role: string | null;
    description: string | null;
  }[];
  relationships: {
    source: string;
    target: string;
    relationType: string;
    description: string | null;
    confidence: number | null;
  }[];
  contradictions: {
    description: string;
    severity: string;
    status: string;
  }[];
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    answer: {
      type: Type.STRING,
      description: "Markdown investigative answer, grounded only in the evidence given.",
    },
    reasoningPath: {
      type: Type.STRING,
      description: "Short chain like 'Entity A -> Evidence X -> Entity B' showing the hops used.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "0 to 1. Be conservative if evidence is thin or contradictory.",
    },
    evidenceChain: {
      type: Type.STRING,
      description: "Comma-separated titles of the evidence items actually used.",
    },
  },
  required: ["answer", "reasoningPath", "confidence", "evidenceChain"],
};

function buildPrompt(query: string, ctx: InvestigationContext): string {
  return `You are SHERLOCK, an AI crime investigation assistant analyzing a real case file.

CASE: ${ctx.caseTitle}
${ctx.caseDescription ?? ""}

EVIDENCE:
${ctx.evidence
  .map(
    (e) =>
      `- [#${e.id}] (${e.evidenceType}, source: ${e.source ?? "unknown"}, confidence ${e.confidence}, time: ${e.timestamp ?? "unknown"}) ${e.title}: ${e.description}`
  )
  .join("\n")}

ENTITIES:
${ctx.entities
  .map((e) => `- ${e.name} (${e.entityType}${e.role ? ", " + e.role : ""}): ${e.description ?? ""}`)
  .join("\n")}

RELATIONSHIPS:
${ctx.relationships
  .map((r) => `- ${r.source} --[${r.relationType}]--> ${r.target}: ${r.description ?? ""} (confidence ${r.confidence})`)
  .join("\n")}

KNOWN CONTRADICTIONS:
${
  ctx.contradictions.length
    ? ctx.contradictions.map((c) => `- (${c.severity}, ${c.status}) ${c.description}`).join("\n")
    : "None flagged yet."
}

INVESTIGATOR QUESTION: "${query}"

Rules:
1. Use ONLY the evidence/entities/relationships above. Never invent facts not present here.
2. If the evidence doesn't support a confident answer, say that plainly and lower the confidence score.
3. Actively look for contradictions relevant to this question, even ones not in the known list.
4. reasoningPath must trace an actual path through the evidence/entities above, not a generic description.`;
}

export async function runInvestigationQuery(query: string, ctx: InvestigationContext) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildPrompt(query, ctx),
    config: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.3,
    },
  });

  const text = result.text;
  if (!text) throw new Error("Empty response from Gemini");

  return JSON.parse(text) as {
    answer: string;
    reasoningPath: string;
    confidence: number;
    evidenceChain: string;
  };
}