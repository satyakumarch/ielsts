import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const id = await uid();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const scoresQuery = queryOptions({
  queryKey: ["skill_scores"],
  queryFn: async () => {
    const { data, error } = await supabase.from("skill_scores").select("*").order("created_at");
    if (error) throw error;
    return data;
  },
});

export const attemptsQuery = queryOptions({
  queryKey: ["reading_attempts"],
  queryFn: async () => {
    const { data, error } = await supabase.from("reading_attempts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const mistakesQuery = queryOptions({
  queryKey: ["mistakes"],
  queryFn: async () => {
    const { data, error } = await supabase.from("mistakes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const tasksQuery = queryOptions({
  queryKey: ["study_tasks"],
  queryFn: async () => {
    const { data, error } = await supabase.from("study_tasks").select("*").order("task_date").order("created_at");
    if (error) throw error;
    return data;
  },
});

export { uid };

export const SKILLS = ["reading", "listening", "writing", "speaking"] as const;
export type Skill = (typeof SKILLS)[number];

/** Latest band per skill. */
export function latestBySkill(scores: { skill: string; band: number }[]) {
  const out: Partial<Record<Skill, number>> = {};
  for (const s of scores) out[s.skill as Skill] = Number(s.band);
  return out;
}

/** Build a 7-day plan starting today, weighting weak skills. */
export function buildWeekPlan(opts: { weak: string[]; dailyMinutes: number; start?: Date }) {
  const weak = opts.weak.length ? opts.weak : ["reading", "writing"];
  const rotation = [...weak, ...SKILLS.filter((s) => !weak.includes(s)), ...weak];
  const ideas: Record<string, string[]> = {
    reading: ["Timed Reading passage", "True/False/Not Given drill", "Matching headings practice"],
    listening: ["Section 1–2 listening practice", "Note-completion drill", "Map labelling practice"],
    writing: ["Task 1 chart description", "Task 2 essay plan + intro", "Rewrite a past essay"],
    speaking: ["Part 2 cue card (2 min)", "Part 1 fluency questions", "Record & review answers"],
  };
  const start = opts.start ?? new Date();
  const tasks: { task_date: string; skill: string; title: string; minutes: number }[] = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const iso = date.toISOString().slice(0, 10);
    const primary = rotation[d % rotation.length]!;
    const secondary = rotation[(d + 1) % rotation.length]!;
    const main = Math.round(opts.dailyMinutes * 0.65);
    tasks.push({ task_date: iso, skill: primary, title: ideas[primary]![d % 3]!, minutes: main });
    tasks.push({ task_date: iso, skill: secondary, title: ideas[secondary]![(d + 1) % 3]!, minutes: opts.dailyMinutes - main });
    tasks.push({ task_date: iso, skill: "vocabulary", title: "Review 15 academic words", minutes: 10 });
  }
  return tasks;
}
