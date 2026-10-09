/**
 * VERIFIED QUESTION BANK — original passages written for IELTS Mastery AI.
 * Every answer key below was checked by hand against the passage text.
 * Do not edit answers without re-verifying. AI-generated questions must never be stored here.
 */
export type QType =
  | "tfng" | "ynng" | "mcq" | "headings" | "matching-info" | "matching-features"
  | "sentence-completion" | "summary-completion" | "table-completion" | "flowchart-completion" | "short-answer";

export const QTYPE_LABEL: Record<QType, string> = {
  tfng: "True / False / Not Given",
  ynng: "Yes / No / Not Given",
  mcq: "Multiple choice",
  headings: "Matching headings",
  "matching-info": "Matching information",
  "matching-features": "Matching features",
  "sentence-completion": "Sentence completion",
  "summary-completion": "Summary completion",
  "table-completion": "Table completion",
  "flowchart-completion": "Flow-chart completion",
  "short-answer": "Short answer",
};

export type Option = { value: string; label: string };
export type Question = { n: number; prompt: string; answers: string[]; explanation: string; options?: Option[] };
export type QuestionGroup = { type: QType; instructions: string; options?: Option[]; questions: Question[] };
export type Passage = { id: string; title: string; topic: string; paragraphs: { label?: string; text: string }[]; groups: QuestionGroup[] };
export type ReadingTest = { id: string; title: string; source: "verified"; minutes: number; passages: Passage[] };

const TFNG: Option[] = [
  { value: "true", label: "TRUE" }, { value: "false", label: "FALSE" }, { value: "not given", label: "NOT GIVEN" },
];
const YNNG: Option[] = [
  { value: "yes", label: "YES" }, { value: "no", label: "NO" }, { value: "not given", label: "NOT GIVEN" },
];

export const READING_TESTS: ReadingTest[] = [
  {
    id: "academic-reading-1",
    title: "Academic Reading Test 1",
    source: "verified",
    minutes: 60,
    passages: [
      {
        id: "p1",
        title: "Bees in the City",
        topic: "Environment",
        paragraphs: [
          { label: "A", text: "For much of the twentieth century, cities were regarded as hostile territory for pollinators. Paved surfaces, pollution and the absence of wild meadows seemed to leave little room for insects that depend on flowers. Yet over the past two decades, ecologists have reported a surprising trend: in many European and North American cities, the number of wild bee species recorded in parks, gardens and railway verges now rivals, and sometimes exceeds, the number found in nearby farmland." },
          { label: "B", text: "The explanation lies partly in what has happened to the countryside. Intensive agriculture has replaced hedgerows and wildflower margins with large fields planted with a single crop. Such fields may offer an abundance of flowers for two or three weeks, but for the rest of the season they provide almost nothing. Urban areas, by contrast, contain an enormous variety of ornamental plants that flower at different times, giving bees a continuous supply of food from early spring until late autumn. Gardens also tend to be treated with fewer pesticides than commercial fields, although this varies considerably between households." },
          { label: "C", text: "A study conducted in the British city of Bristol in 2019 compared four kinds of urban land: allotments (small plots rented for growing vegetables), residential gardens, parks and road verges. Allotments supported the highest density of pollinators per square metre, largely because their owners grow a mix of fruit, vegetables and flowers. Residential gardens came second. Parks, many of which are dominated by mown grass, performed relatively poorly, while road verges varied enormously depending on how often they were cut. Because gardens cover far more land than allotments, however, the researchers concluded that gardens make the greatest overall contribution to pollinator survival in the city." },
          { label: "D", text: "Not all urban bees are thriving. Honeybees, which are kept by people, have become fashionable in cities, and rooftop hives are now common on hotels and office buildings. Some ecologists warn that large numbers of managed honeybees may compete with wild species for the same limited flowers. In parts of Paris, for example, the density of hives has risen to around fifteen per square kilometre, and surveys there have recorded fewer wild pollinators in areas with the most hives. Researchers caution, though, that this correlation does not yet prove that honeybees are the cause." },
          { label: "E", text: "City planners are beginning to respond. Several municipalities have reduced how often verges are mown, allowing native flowers to set seed, while others have introduced green roofs planted with drought-tolerant species. The cost of such measures is generally low; in some cases reducing mowing actually saves money. The main obstacle is public perception: residents sometimes complain that uncut verges look untidy. Signs explaining the purpose of the change have been found to reduce complaints significantly." },
        ],
        groups: [
          {
            type: "tfng",
            instructions: "Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.",
            options: TFNG,
            questions: [
              { n: 1, prompt: "In some cities, the number of wild bee species is now similar to that found in nearby farmland.", answers: ["true"], explanation: "Paragraph A: the number of species in cities 'now rivals, and sometimes exceeds' nearby farmland. 'Rivals' is paraphrased as 'similar to'." },
              { n: 2, prompt: "Fields planted with a single crop provide food for bees throughout the year.", answers: ["false"], explanation: "Paragraph B says such fields offer flowers for only 'two or three weeks' and 'almost nothing' for the rest of the season — this contradicts the statement." },
              { n: 3, prompt: "Bees in cities prefer native plants to ornamental ones.", answers: ["not given"], explanation: "The passage mentions ornamental plants as a food source but never compares bee preference between native and ornamental plants. A common trap is to infer a preference that is not stated." },
              { n: 4, prompt: "The Bristol study was paid for by the city council.", answers: ["not given"], explanation: "Paragraph C describes the study's findings but gives no information about who funded it." },
              { n: 5, prompt: "In the Bristol study, parks had a lower density of pollinators than residential gardens.", answers: ["true"], explanation: "Gardens 'came second' after allotments, while parks 'performed relatively poorly' — so parks ranked below gardens." },
            ],
          },
          {
            type: "table-completion",
            instructions: "Complete the table. Choose ONE WORD ONLY from the passage for each answer.",
            questions: [
              { n: 6, prompt: "Allotments — the highest ______ of pollinators per square metre", answers: ["density"], explanation: "Paragraph C: 'the highest density of pollinators per square metre'." },
              { n: 7, prompt: "Residential gardens — greatest overall contribution because they cover more ______", answers: ["land"], explanation: "Paragraph C: 'gardens cover far more land than allotments'." },
              { n: 8, prompt: "Parks — mostly covered in mown ______", answers: ["grass"], explanation: "Paragraph C: parks are 'dominated by mown grass'." },
              { n: 9, prompt: "Road verges — results depended on how often they were ______", answers: ["cut"], explanation: "Paragraph C: verges 'varied enormously depending on how often they were cut'. 'Mown' is not the word used in this sentence." },
            ],
          },
          {
            type: "mcq",
            instructions: "Choose the correct letter, A, B, C or D.",
            questions: [
              {
                n: 10, prompt: "What does the writer say about honeybees in Paris?",
                options: [
                  { value: "a", label: "A  They have been proven to harm wild bee populations." },
                  { value: "b", label: "B  Areas with more hives had fewer wild pollinators, but the cause is uncertain." },
                  { value: "c", label: "C  Rooftop hives have now been banned on hotels." },
                  { value: "d", label: "D  Wild bee numbers rose where hives were most common." },
                ],
                answers: ["b"],
                explanation: "Paragraph D reports fewer wild pollinators where hives are densest but says 'this correlation does not yet prove that honeybees are the cause'. Option A is the tempting distractor: it overstates the evidence.",
              },
              {
                n: 11, prompt: "According to the writer, the main difficulty in leaving verges uncut is",
                options: [
                  { value: "a", label: "A  the high cost to local councils." },
                  { value: "b", label: "B  a shortage of native seeds." },
                  { value: "c", label: "C  residents' belief that they look untidy." },
                  { value: "d", label: "D  the risk of drought." },
                ],
                answers: ["c"],
                explanation: "Paragraph E: 'The main obstacle is public perception: residents sometimes complain that uncut verges look untidy.' Cost (A) is described as low.",
              },
            ],
          },
          {
            type: "short-answer",
            instructions: "Answer the questions. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { n: 12, prompt: "What type of roof have some cities introduced?", answers: ["green roofs", "green roof", "green"], explanation: "Paragraph E: 'others have introduced green roofs planted with drought-tolerant species'." },
              { n: 13, prompt: "What has been found to reduce complaints from residents?", answers: ["signs", "explanatory signs"], explanation: "Paragraph E: 'Signs explaining the purpose of the change have been found to reduce complaints significantly.'" },
            ],
          },
        ],
      },
      {
        id: "p2",
        title: "Finding Longitude at Sea",
        topic: "History & Technology",
        paragraphs: [
          { label: "A", text: "For centuries, sailors could work out their latitude — their position north or south — with reasonable accuracy by measuring the height of the sun or certain stars. Longitude, their position east or west, was a far harder problem. Without it, ships regularly missed their destinations, ran short of supplies, or were wrecked on coasts they believed to be many miles away." },
          { label: "B", text: "In principle, the solution was understood. Because the Earth rotates through 360 degrees in 24 hours, every hour of difference between local time and the time at a fixed reference point corresponds to 15 degrees of longitude. A navigator who knew both times could calculate his position. Local time could be found from the sun; the difficulty was knowing the time at the reference point while hundreds of miles away." },
          { label: "C", text: "Two rival approaches emerged. Astronomers favoured the 'lunar distance' method, in which the position of the moon against the background stars would act as a kind of clock in the sky. This required precise tables predicting the moon's movements and lengthy calculations that could take a navigator up to four hours. The alternative was to carry an accurate clock on board. Yet pendulum clocks, the most precise of the age, were useless on a rolling ship, and changes in temperature and humidity made ordinary clocks gain or lose minutes each day." },
          { label: "D", text: "In 1714 the British Parliament offered a reward of up to £20,000 for a practical method of determining longitude. A board of commissioners was set up to judge proposals. John Harrison, a self-taught carpenter and clockmaker, devoted most of his life to the problem, producing a series of timekeepers over more than thirty years. His fourth design, a large watch completed in 1759, lost only a few seconds during a voyage to Jamaica." },
          { label: "E", text: "Harrison's success was not immediately rewarded. Some commissioners were astronomers who supported the lunar method, and they demanded further trials and full disclosure of how the watch was made. Harrison received payments in stages, but he was given the bulk of his money only in 1773, after appealing directly to King George III and to Parliament." },
          { label: "F", text: "In the decades that followed, the two methods were used side by side. Marine chronometers remained expensive, so many ships relied on lunar tables, which were cheap to print. As manufacturing techniques improved during the nineteenth century, chronometers became affordable, and by the 1850s they were standard equipment. The lunar method gradually disappeared, although some navigators continued to learn it as a backup." },
        ],
        groups: [
          {
            type: "headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings (i–viii). There are more headings than paragraphs.",
            options: [
              { value: "i", label: "i  The theory behind the calculation" },
              { value: "ii", label: "ii  A prize to encourage solutions" },
              { value: "iii", label: "iii  Why one position was easy to find and the other was not" },
              { value: "iv", label: "iv  Competing solutions and their drawbacks" },
              { value: "v", label: "v  Delayed recognition for an inventor" },
              { value: "vi", label: "vi  How cost decided which method was used" },
              { value: "vii", label: "vii  The invention of the pendulum clock" },
              { value: "viii", label: "viii  Disasters caused by inaccurate maps" },
            ],
            questions: [
              { n: 14, prompt: "Paragraph A", answers: ["iii"], explanation: "A contrasts easy latitude with difficult longitude. 'viii' is a distractor: shipwrecks are mentioned, but caused by unknown longitude, not maps." },
              { n: 15, prompt: "Paragraph B", answers: ["i"], explanation: "B explains the principle: one hour of time difference = 15 degrees." },
              { n: 16, prompt: "Paragraph C", answers: ["iv"], explanation: "C describes the lunar method and clocks, plus the problems with each. Pendulum clocks are mentioned but not their invention (vii)." },
              { n: 17, prompt: "Paragraph D", answers: ["ii"], explanation: "D begins with the 1714 reward of up to £20,000." },
              { n: 18, prompt: "Paragraph E", answers: ["v"], explanation: "E: 'Harrison's success was not immediately rewarded' — he received most of his money only in 1773." },
              { n: 19, prompt: "Paragraph F", answers: ["vi"], explanation: "F: chronometers were expensive so lunar tables were used, until chronometers became affordable." },
            ],
          },
          {
            type: "matching-features",
            instructions: "Match each statement with the correct method. Choose A, B or C.",
            options: [
              { value: "a", label: "A  the lunar distance method" },
              { value: "b", label: "B  carrying a clock on board" },
              { value: "c", label: "C  both methods" },
            ],
            questions: [
              { n: 20, prompt: "required detailed predictions of the moon's position", answers: ["a"], explanation: "C: the lunar method 'required precise tables predicting the moon's movements'." },
              { n: 21, prompt: "was affected by heat and moisture", answers: ["b"], explanation: "C: 'changes in temperature and humidity made ordinary clocks gain or lose minutes'. Heat = temperature, moisture = humidity." },
              { n: 22, prompt: "was in use in the decades after Harrison's watch was completed", answers: ["c"], explanation: "F: 'In the decades that followed, the two methods were used side by side.'" },
              { n: 23, prompt: "was the cheaper option for many ships before the nineteenth century", answers: ["a"], explanation: "F: 'Marine chronometers remained expensive, so many ships relied on lunar tables, which were cheap to print.'" },
            ],
          },
          {
            type: "flowchart-completion",
            instructions: "Complete the flow-chart. Choose ONE WORD AND/OR A NUMBER from the passage for each answer.",
            questions: [
              { n: 24, prompt: "The navigator finds local time by observing the ______.", answers: ["sun"], explanation: "B: 'Local time could be found from the sun'." },
              { n: 25, prompt: "Each hour of difference from the reference time equals ______ degrees.", answers: ["15", "fifteen"], explanation: "B: 'every hour of difference ... corresponds to 15 degrees of longitude'." },
              { n: 26, prompt: "The navigator can then calculate the ship's ______.", answers: ["longitude", "position"], explanation: "B: knowing both times, a navigator 'could calculate his position' — specifically its longitude." },
            ],
          },
        ],
      },
      {
        id: "p3",
        title: "Is Homework Worth It?",
        topic: "Education",
        paragraphs: [
          { label: "A", text: "Few aspects of school life provoke as much disagreement among parents as homework. Some complain that their children spend entire evenings on worksheets; others worry that schools which set little homework are failing to prepare pupils for the demands of further study. In my view, both groups are asking the wrong question. The issue is not how much homework children receive but what kind." },
          { label: "B", text: "Research on the subject is less conclusive than either side tends to claim. Large reviews of studies have generally found a modest positive link between homework and achievement for older secondary students, but little or no link for children in primary school. One explanation is that younger children have not yet developed the ability to organise their own learning, so time spent alone with a task does not translate into understanding." },
          { label: "C", text: "A frequently overlooked factor is the home environment. Pupils who have a quiet place to work and an adult available to help benefit far more from homework than those who do not. Homework can therefore widen the gap between advantaged and disadvantaged pupils, a concern that I believe schools take far too lightly. Some schools have responded by opening their libraries after lessons, which seems to me a sensible compromise." },
          { label: "D", text: "The type of task matters considerably. Practising a skill that has already been taught in class, such as solving equations or recalling vocabulary, appears more effective than asking pupils to learn new material independently. Short, regular retrieval practice — attempting to remember information without looking at notes — is supported by a substantial body of evidence from cognitive psychology." },
          { label: "E", text: "Teachers' feedback also plays a role. Homework that is collected but never commented on sends a message that the task was merely a formality. On the other hand, detailed written comments on every piece of work are unrealistic for teachers responsible for over a hundred pupils. Brief whole-class feedback, in which common errors are discussed, may offer the best balance." },
          { label: "F", text: "Ultimately, I would argue that homework should be judged by a simple test: does it help pupils remember and apply what they have learned? Tasks that pass this test deserve a place in the school week; those that exist mainly to keep children busy do not." },
        ],
        groups: [
          {
            type: "ynng",
            instructions: "Do the following statements agree with the claims of the writer? Choose YES, NO or NOT GIVEN.",
            options: YNNG,
            questions: [
              { n: 27, prompt: "The amount of homework set is the most important issue.", answers: ["no"], explanation: "A: 'The issue is not how much homework children receive but what kind.'" },
              { n: 28, prompt: "Schools pay enough attention to the effect of pupils' home environment.", answers: ["no"], explanation: "C: the writer believes schools take this concern 'far too lightly'." },
              { n: 29, prompt: "Opening school libraries after lessons is a reasonable response.", answers: ["yes"], explanation: "C: 'which seems to me a sensible compromise'. Sensible = reasonable." },
              { n: 30, prompt: "Most parents would like their children to receive more homework.", answers: ["not given"], explanation: "A describes two groups of parents but never states what most parents want." },
            ],
          },
          {
            type: "matching-info",
            instructions: "Which paragraph contains the following information? Choose A–F. You may use any letter more than once.",
            options: ["A", "B", "C", "D", "E", "F"].map((l) => ({ value: l.toLowerCase(), label: l })),
            questions: [
              { n: 31, prompt: "a reason why homework may not benefit young children", answers: ["b"], explanation: "B: younger children 'have not yet developed the ability to organise their own learning'." },
              { n: 32, prompt: "a learning technique supported by psychological research", answers: ["d"], explanation: "D: retrieval practice is 'supported by ... evidence from cognitive psychology'." },
              { n: 33, prompt: "a reference to the workload of teachers", answers: ["e"], explanation: "E: detailed comments are 'unrealistic for teachers responsible for over a hundred pupils'." },
              { n: 34, prompt: "a test for deciding whether a task is worthwhile", answers: ["f"], explanation: "F: 'homework should be judged by a simple test'." },
            ],
          },
          {
            type: "sentence-completion",
            instructions: "Complete the sentences. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { n: 35, prompt: "Reviews found a modest positive link between homework and achievement for older ______ students.", answers: ["secondary"], explanation: "B: 'for older secondary students'." },
              { n: 36, prompt: "Pupils who have a quiet place and an ______ available to help gain more from homework.", answers: ["adult"], explanation: "C: 'an adult available to help'." },
              { n: 37, prompt: "Homework that is never commented on may appear to be merely a ______.", answers: ["formality"], explanation: "E: 'the task was merely a formality'." },
            ],
          },
          {
            type: "summary-completion",
            instructions: "Complete the summary. Choose ONE WORD ONLY from the passage for each answer.",
            questions: [
              { n: 38, prompt: "Practising a skill that has already been taught in ______ is more effective than learning new material alone.", answers: ["class"], explanation: "D: 'a skill that has already been taught in class'." },
              { n: 39, prompt: "Regular ______ practice, in which pupils try to remember information without notes, is well supported.", answers: ["retrieval"], explanation: "D: 'Short, regular retrieval practice'." },
              { n: 40, prompt: "Brief whole-class feedback that discusses common ______ may offer the best balance.", answers: ["errors", "error"], explanation: "E: 'in which common errors are discussed'." },
            ],
          },
        ],
      },
    ],
  },
];

export function getTest(id: string) {
  return READING_TESTS.find((t) => t.id === id);
}

export function allQuestions(test: ReadingTest, passageId?: string) {
  return test.passages
    .filter((p) => !passageId || p.id === passageId)
    .flatMap((p) => p.groups.flatMap((g) => g.questions.map((q) => ({ ...q, type: g.type, options: q.options ?? g.options, passageId: p.id }))));
}
