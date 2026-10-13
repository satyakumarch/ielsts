import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MODEL = "google/gemini-3-flash-preview";

async function callAI(messages: { role: string; content: string }[], json: boolean) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, ...(json ? { response_format: { type: "json_object" } } : {}) }),
  });
  if (res.status === 429) throw new Error("Too many AI requests right now — please wait a minute and try again.");
  if (res.status === 402) throw new Error("AI credits have run out. Please add credits to keep using AI feedback.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

export type Criterion = { name: string; band: number; comment: string };
export type Feedback = {
  overall: number;
  criteria: Criterion[];
  strengths: string[];
  improvements: string[];
  improved_version?: string;
};

function parseFeedback(raw: string): Feedback {
  const cleaned = raw.replace(/^```(json)?/m, "").replace(/```\s*$/m, "").trim();
  const f = JSON.parse(cleaned) as Feedback;
  const half = (n: number) => Math.max(0, Math.min(9, Math.round(Number(n) * 2) / 2));
  f.criteria = (f.criteria ?? []).map((c) => ({ ...c, band: half(c.band) }));
  f.overall = half(f.overall ?? (f.criteria.reduce((a, c) => a + c.band, 0) / Math.max(1, f.criteria.length)));
  f.strengths ??= [];
  f.improvements ??= [];
  return f;
}

const SCHEMA = `Return ONLY JSON: {"overall": number, "criteria": [{"name": string, "band": number, "comment": string}], "strengths": string[], "improvements": string[], "improved_version": string}. Bands use 0-9 in 0.5 steps. Be a strict but fair official IELTS examiner; never inflate scores.`;

export const evaluateWriting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { task: "task1" | "task2"; prompt: string; response: string }) => {
    if (!d.response || d.response.length > 8000) throw new Error("Invalid response length");
    return d;
  })
  .handler(async ({ data }) => {
    const criteria = data.task === "task1"
      ? "Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy"
      : "Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy";
    const words = data.response.trim().split(/\s+/).length;
    const raw = await callAI([
      { role: "system", content: `You assess IELTS Academic Writing ${data.task === "task1" ? "Task 1" : "Task 2"} on: ${criteria}. Penalise under-length (min ${data.task === "task1" ? 150 : 250} words). ${SCHEMA} improved_version: a band-8 rewrite of the candidate's first paragraph.` },
      { role: "user", content: `Question:\n${data.prompt}\n\nCandidate answer (${words} words):\n${data.response}` },
    ], true);
    return parseFeedback(raw);
  });

export const evaluateSpeaking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { part: string; prompt: string; transcript: string }) => {
    if (!d.transcript || d.transcript.length > 8000) throw new Error("Invalid transcript");
    return d;
  })
  .handler(async ({ data }) => {
    const raw = await callAI([
      { role: "system", content: `You assess IELTS Speaking (${data.part}) from a speech-to-text transcript on: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation. Pronunciation can only be estimated from a transcript — say so in its comment. ${SCHEMA} improved_version: a band-8 model answer.` },
      { role: "user", content: `Question:\n${data.prompt}\n\nTranscript:\n${data.transcript}` },
    ], true);
    return parseFeedback(raw);
  });

export const tutorChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { messages: { role: "user" | "assistant"; content: string }[] }) => {
    if (!Array.isArray(d.messages) || d.messages.length > 40) throw new Error("Invalid messages");
    return { messages: d.messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content).slice(0, 4000) })) };
  })
  .handler(async ({ data }) => {
    const reply = await callAI([
      { role: "system", content: "You are a friendly, expert IELTS Academic tutor. Give concise, practical advice on strategy, grammar, vocabulary and question types. Use short paragraphs and bullet points. Never claim to be an official IELTS examiner." },
      ...data.messages,
    ], false);
    return { reply };
  });
