/** Practice content for Listening, Writing, Speaking and Vocabulary. Original material written for this app. */

export type ListeningQ = { n: number; prompt: string; answers: string[]; options?: string[] };
export type ListeningSection = { id: string; title: string; context: string; script: string; questions: ListeningQ[] };

export const LISTENING: ListeningSection[] = [
  {
    id: "s1",
    title: "Section 1 — Joining a sports centre",
    context: "A man phones a sports centre to ask about membership. Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
    script:
      "Good morning, Riverside Sports Centre. How can I help? Hi, I'd like to join the centre. Certainly. Can I take your surname? It's Kowalski. That's K O W A L S K I. Thank you. And your postcode? It's B T 7 4 R Q. Lovely. Which membership are you interested in? We have standard, which is thirty-two pounds a month, and premium, which is forty-five. I'll take the standard one, please. Great. Standard includes the gym and the pool, but not the tennis courts. When would you like to start? Next Monday, if possible. That's fine. Our induction sessions take place on Wednesday evenings at seven. And how did you hear about us? A friend recommended you, actually. Perfect, I'll note that down.",
    questions: [
      { n: 1, prompt: "Surname: ______", answers: ["kowalski"] },
      { n: 2, prompt: "Postcode: ______", answers: ["bt7 4rq", "bt74rq"] },
      { n: 3, prompt: "Monthly cost of standard membership: £______", answers: ["32", "thirty-two", "thirty two"] },
      { n: 4, prompt: "Standard membership does NOT include the ______", answers: ["tennis courts", "tennis court", "tennis"] },
      { n: 5, prompt: "Induction sessions are on ______ evenings", answers: ["wednesday", "wednesdays"] },
      { n: 6, prompt: "Heard about the centre from a ______", answers: ["friend"] },
    ],
  },
  {
    id: "s4",
    title: "Section 4 — Lecture on urban bees",
    context: "A lecturer talks about bees in cities. Choose the correct answer or complete the notes with ONE WORD ONLY.",
    script:
      "Today I want to look at bees living in cities. It surprises many people that urban areas can support more species of wild bee than nearby farmland. The main reason is diversity of flowers. Gardens, parks and even roadside verges offer plants that bloom at different times, whereas farmland is often planted with a single crop. However, cities present problems too. The biggest threat researchers have identified is the lack of nesting sites, because most wild bees nest in bare soil, which is rare when surfaces are paved. Some councils now leave patches of ground unmown and uncovered. Another approach is the green roof. Studies in Toronto found that roofs planted with native species attracted around eighty species of bee. Finally, I'd stress the role of citizens: anyone can help by recording sightings through apps, which gives scientists far more data than they could ever collect alone.",
    questions: [
      { n: 7, prompt: "Cities can support more wild bee species than nearby ______", answers: ["farmland"] },
      { n: 8, prompt: "The main reason is the ______ of flowers", answers: ["diversity", "variety"] },
      { n: 9, prompt: "The biggest threat in cities is the lack of nesting ______", answers: ["sites"] },
      { n: 10, prompt: "Most wild bees nest in bare ______", answers: ["soil", "ground"] },
      { n: 11, prompt: "Green roofs in Toronto attracted about how many species?", options: ["18", "40", "80"], answers: ["80"] },
      { n: 12, prompt: "Citizens can help by recording ______ through apps", answers: ["sightings"] },
    ],
  },
];

export type WritingPrompt = { id: string; task: "task1" | "task2"; title: string; prompt: string; minutes: number; minWords: number };

export const WRITING: WritingPrompt[] = [
  {
    id: "t1-transport", task: "task1", title: "Task 1 — Commuting table", minutes: 20, minWords: 150,
    prompt:
      "The table shows the percentage of commuters using four types of transport in one city in 2000 and 2020.\n\nCar: 2000 = 52%, 2020 = 38%\nBus: 2000 = 25%, 2020 = 22%\nBicycle: 2000 = 8%, 2020 = 21%\nTrain: 2000 = 15%, 2020 = 19%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t1-water", task: "task1", title: "Task 1 — Water use by sector", minutes: 20, minWords: 150,
    prompt:
      "The data shows water use (billion cubic metres) by sector in a country in 1980, 2000 and 2020.\n\nAgriculture: 120, 150, 140\nIndustry: 40, 65, 90\nHomes: 20, 30, 45\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  },
  {
    id: "t2-remote", task: "task2", title: "Task 2 — Working from home", minutes: 40, minWords: 250,
    prompt: "More and more people now work from home rather than in an office. Do the advantages of this development outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
  {
    id: "t2-university", task: "task2", title: "Task 2 — Free university education", minutes: 40, minWords: 250,
    prompt: "Some people believe that university education should be free for all students. Others think students should pay for their own studies. Discuss both views and give your own opinion.\n\nWrite at least 250 words.",
  },
  {
    id: "t2-tourism", task: "task2", title: "Task 2 — International tourism", minutes: 40, minWords: 250,
    prompt: "International tourism has brought enormous benefits to many places. At the same time, there is concern about its impact on local inhabitants and the environment. Do the disadvantages of international tourism outweigh the advantages?\n\nWrite at least 250 words.",
  },
];

export type SpeakingPrompt = { id: string; part: string; title: string; prompt: string; prepSeconds: number; speakSeconds: number };

export const SPEAKING: SpeakingPrompt[] = [
  { id: "p1-home", part: "Part 1", title: "Your hometown", prompt: "Where is your hometown? What do you like most about it? Has it changed much since you were a child?", prepSeconds: 0, speakSeconds: 90 },
  { id: "p1-study", part: "Part 1", title: "Studying", prompt: "What are you studying at the moment? Why did you choose it? Do you prefer studying alone or with others?", prepSeconds: 0, speakSeconds: 90 },
  { id: "p2-teacher", part: "Part 2", title: "A teacher who influenced you", prompt: "Describe a teacher who influenced you.\nYou should say:\n• who this teacher was\n• what subject they taught\n• what they did that was special\nand explain why this teacher influenced you.", prepSeconds: 60, speakSeconds: 120 },
  { id: "p2-place", part: "Part 2", title: "A place you want to visit", prompt: "Describe a place you would like to visit in the future.\nYou should say:\n• where it is\n• how you learned about it\n• what you would do there\nand explain why you want to go there.", prepSeconds: 60, speakSeconds: 120 },
  { id: "p3-education", part: "Part 3", title: "Education and technology", prompt: "How has technology changed the way people learn? Will teachers be replaced by computers in the future? Why or why not?", prepSeconds: 0, speakSeconds: 150 },
];

export type Word = { word: string; pos: string; meaning: string; example: string };

export const VOCAB: Word[] = [
  { word: "allocate", pos: "verb", meaning: "to give something officially for a particular purpose", example: "The government allocated more funds to public transport." },
  { word: "substantial", pos: "adj", meaning: "large in size, value or importance", example: "There was a substantial rise in cycling between 2000 and 2020." },
  { word: "fluctuate", pos: "verb", meaning: "to change frequently in level or amount", example: "Water use fluctuated slightly over the period." },
  { word: "mitigate", pos: "verb", meaning: "to make something less harmful or serious", example: "Green roofs can mitigate the effects of urban heat." },
  { word: "prevalent", pos: "adj", meaning: "existing very commonly", example: "Remote working has become prevalent in the technology sector." },
  { word: "detrimental", pos: "adj", meaning: "causing harm or damage", example: "Mass tourism can be detrimental to fragile ecosystems." },
  { word: "advocate", pos: "verb", meaning: "to publicly support an idea", example: "Many economists advocate free higher education." },
  { word: "consequently", pos: "adv", meaning: "as a result", example: "Fares rose; consequently, bus use declined." },
  { word: "inevitable", pos: "adj", meaning: "certain to happen", example: "Some job losses to automation seem inevitable." },
  { word: "disparity", pos: "noun", meaning: "a large difference, often unfair", example: "There is a disparity in income between regions." },
  { word: "sustainable", pos: "adj", meaning: "able to continue without damaging the environment", example: "Cities need sustainable transport systems." },
  { word: "undermine", pos: "verb", meaning: "to gradually weaken something", example: "Constant distractions undermine concentration." },
  { word: "comprehensive", pos: "adj", meaning: "including everything that is needed", example: "The report provides a comprehensive overview." },
  { word: "phenomenon", pos: "noun", meaning: "a fact or event that can be observed", example: "Urban beekeeping is a growing phenomenon." },
  { word: "feasible", pos: "adj", meaning: "possible and practical to do", example: "Working from home is not feasible for nurses." },
  { word: "acquire", pos: "verb", meaning: "to gain knowledge or skills", example: "Children acquire languages quickly." },
  { word: "integral", pos: "adj", meaning: "necessary and important as part of a whole", example: "Exercise is integral to a healthy lifestyle." },
  { word: "deteriorate", pos: "verb", meaning: "to become worse", example: "Air quality deteriorated as traffic increased." },
  { word: "incentive", pos: "noun", meaning: "something that encourages a person to do something", example: "Tax incentives encourage electric car use." },
  { word: "proportion", pos: "noun", meaning: "a part of a whole, often as a percentage", example: "A greater proportion of commuters now cycle." },
  { word: "albeit", pos: "conj", meaning: "although", example: "Train use rose, albeit slowly." },
  { word: "exacerbate", pos: "verb", meaning: "to make a problem worse", example: "Paving gardens exacerbates flooding." },
  { word: "notable", pos: "adj", meaning: "important and deserving attention", example: "The most notable change was in car use." },
  { word: "contemporary", pos: "adj", meaning: "belonging to the present time", example: "Contemporary education relies heavily on technology." },
];

/** Leitner intervals in days for boxes 0–5. */
export const BOX_DAYS = [0, 1, 3, 7, 14, 30];

export function nextReview(box: number, knew: boolean, now = new Date()) {
  const nb = knew ? Math.min(BOX_DAYS.length - 1, box + 1) : 0;
  const due = new Date(now);
  due.setDate(due.getDate() + BOX_DAYS[nb]!);
  return { box: nb, due_at: due.toISOString() };
}
