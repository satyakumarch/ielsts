# Ielsts

Build an AI-Powered IELTS Preparation & Band Score Improvement Platform

Act as a senior full-stack developer, UI/UX designer, AI engineer, and IELTS preparation expert. Build a complete, responsive, production-quality web application named IELTS Mastery AI that helps students prepare for the IELTS Academic exam, improve all four skills, take realistic mock tests, receive AI-powered feedback, and achieve their target band score for international university admissions.

The application must be functional, not just a landing page or static UI. Every button, form, test, timer, dashboard, and navigation item must work.

1. Main Objectives

Build the platform around these goals:

Help students target IELTS Band 7.0, 7.5, 8.0, or higher.

Provide realistic IELTS Academic practice tests.

Evaluate performance in Listening, Reading, Writing, and Speaking.

Explain mistakes and teach students how to avoid repeating them.

Generate personalized daily and weekly study plans.

Track progress, weak areas, accuracy, vocabulary, grammar, fluency, and mock-test scores.

Simulate exam conditions with timers and a clean test interface.

Support students applying to universities abroad.

Include an onboarding assessment to estimate the learner's current level and create a personalized learning path.

2. Modern UI/UX Design

Use React, TypeScript, Tailwind CSS, and shadcn/ui. Use a polished, premium educational SaaS design.

Design requirements:

Professional dashboard with a clean sidebar.

Responsive desktop, tablet, and mobile layouts.

Light and dark modes.

Attractive progress charts, band-score indicators, cards, and progress bars.

Consistent spacing, typography, icons, and accessible contrast.

Minimal distractions during timed exams.

Loading states, error handling, empty states, and confirmation dialogs.

Smooth but subtle transitions.

Clear navigation between learning, practice, tests, analytics, and settings.

Use the following navigation:

Dashboard

Study Plan

Listening

Reading

Writing

Speaking

Vocabulary & Grammar

Full Mock Tests

Mistake Notebook

Progress Analytics

AI IELTS Tutor

Settings

3. Student Onboarding

On the first visit, ask the student for:

Name and preferred language.

IELTS Academic or General Training.

Current estimated band score.

Target overall band score.

Target test date.

Daily study time: 30 minutes, 1 hour, 2 hours, or 3+ hours.

Main weak skills.

Preferred study schedule.

Whether the student wants university admission, scholarships, employment, or immigration.

Use these responses to generate a personalized study plan.

Include a short diagnostic test covering all four skills. Clearly label the result as an estimate, not an official IELTS score.

4. Dashboard

Create a personalized home dashboard displaying:

Target overall band score.

Latest estimated overall band.

Listening, Reading, Writing, and Speaking scores.

Study streak and total study hours.

Weekly goals and completion percentage.

Next scheduled practice session.

Recent mock-test results.

Top three weaknesses.

Recommended next activities.

Vocabulary learned and mistakes corrected.

Use interactive line charts to show score improvement over time and bar charts to compare the four skills.

Provide a prominent "Continue Learning" button that resumes the student's last activity.

5. Listening Practice Module

Build a complete IELTS Listening practice experience.

Features:

Four sections with a total of 40 questions in a full listening test.

Support for audio recordings, transcripts, and question-specific playback where appropriate for practice mode.

Audio player with play, pause, volume, and progress controls.

Exam mode should prevent replaying recordings when the selected simulation requires a single play.

Countdown timer and question navigation.

Question types: multiple choice, matching, map/plan labeling, form completion, note completion, sentence completion, and short-answer questions.

Accept appropriate spelling, capitalization, and numerical variations when checking answers.

Auto-save answers during practice.

Clearly separate practice mode from strict exam simulation.

Display the answer key and explanations after submission.

Identify recurring spelling errors and problems with distractors, numbers, dates, accents, and paraphrasing.

Save incorrect questions to the Mistake Notebook.

Use legally available audio or generate original practice scripts and audio. Never depend on copyrighted test audio being available.

6. Reading Practice Module

Create a realistic IELTS Academic Reading module.

Features:

Three passages with 40 questions in full-test mode.

A 60-minute exam timer.

Passage and question panels with adjustable layout.

Highlighting and note-taking.

Question navigation and unanswered-question indicators.

Support for:

Multiple choice.

True/False/Not Given.

Yes/No/Not Given.

Matching headings.

Matching information.

Matching features.

Sentence completion.

Summary completion.

Table and flow-chart completion.

Short-answer questions.

Original passages about science, technology, history, environment, education, and society.

Explain why the correct answer is right and why tempting alternatives are wrong.

Identify keyword matching, paraphrase recognition, inference, and time-management weaknesses.

Provide an estimated Reading band using a configurable, documented conversion table.

Allow users to practice individual question types or complete all three passages under exam conditions.

7. Writing Practice Module

Build an advanced IELTS Writing workspace for Academic and General Training.

Task 1

For Academic IELTS, provide:

Line graphs.

Bar charts.

Pie charts.

Tables.

Maps.

Process diagrams.

Mixed charts.

For General Training, provide:

Formal letters.

Semi-formal letters.

Informal letters.

Task 2

Provide essay prompts covering:

Opinion essays.

Discussion essays.

Advantages and disadvantages.

Problem and solution.

Two-part questions.

Causes and effects.

Writing editor features

Word count.

Timed practice.

Save drafts automatically.

Clear task instructions.

Planning and outline area.

Paragraph structure guidance.

Submit for AI feedback.

Compare the original response with a suggested improved version.

Allow users to revise and resubmit their answers.

AI writing evaluation

Assess the response according to the four official IELTS Writing criteria:

Task Achievement for Task 1 or Task Response for Task 2.

Coherence and Cohesion.

Lexical Resource.

Grammatical Range and Accuracy.

For each criterion, provide:

An estimated band score.

Evidence from the student's response.

Specific strengths and weaknesses.

Grammar and vocabulary corrections.

Explanations of repeated mistakes.

Suggestions to improve by one band level.

A sample improved response appropriate to the task.

Evaluate Task 1 and Task 2 separately. When estimating the overall Writing score, account for the greater weighting of Task 2.

Never claim that AI scores are official examiner scores. Clearly label all scores as estimates and note that human assessment may differ.

Do not reward unnecessarily complicated vocabulary, memorized essays, or unnatural language. Prioritize accurate, clear, coherent, and relevant writing.

8. Speaking Practice Module

Build an interactive IELTS Speaking simulator.

Part 1

Practice familiar topics such as hometown, education, work, technology, hobbies, and daily routines.

Part 2

Provide a cue card with one minute of preparation and up to two minutes to speak.

Part 3

Generate deeper follow-up questions requiring explanations, comparisons, examples, and opinions.

Features:

Browser microphone recording with explicit permission.

Audio playback of the student's recording.

Speech-to-text transcription.

Optional text-only practice.

AI-generated follow-up questions.

Track answer length, pauses, repeated words, filler words, and speaking pace where technically measurable.

Provide pronunciation feedback only when supported by suitable audio analysis.

Give grammar, vocabulary, fluency, coherence, and pronunciation feedback.

Suggest natural alternative expressions.

Provide sample answers without encouraging memorization.

Allow unlimited practice sessions subject to configured usage limits.

Use the four IELTS Speaking criteria:

Fluency and Coherence.

Lexical Resource.

Grammatical Range and Accuracy.

Pronunciation.

Display an estimated band for each criterion, examples from the student's answer, and practical improvement exercises.

9. AI IELTS Tutor

Create a conversational AI tutor that helps with:

Explaining difficult grammar.

Teaching academic vocabulary and collocations.

Correcting sentences.

Explaining IELTS questions.

Teaching paraphrasing and summarization.

Brainstorming essay ideas.

Improving speaking answers.

Explaining why answers are incorrect.

Practicing follow-up questions.

Recommending the next lesson based on weaknesses.

The tutor should be supportive but honest. It should not automatically praise weak answers or promise a specific band score.

Provide quick actions such as "Correct my grammar", "Improve this paragraph", "Explain my mistake", "Give me a Band 8-style example", and "Quiz me on this topic".

Distinguish model examples from official IELTS materials.

10. Vocabulary and Grammar Lab

Build a spaced-repetition learning system.

Features:

Academic Word List vocabulary.

Topic-based vocabulary for education, environment, health, technology, economics, and society.

Definitions, example sentences, collocations, synonyms, and common usage errors.

Flashcards with remember, difficult, and forgot actions.

Daily vocabulary targets.

Grammar lessons covering articles, tense consistency, subject-verb agreement, prepositions, clauses, conditionals, punctuation, and sentence variety.

Short quizzes with explanations.

Personal word bank.

Track words learned, accuracy, and review dates.

Practice new vocabulary in writing and speaking.

Prioritize natural, precise vocabulary over rare words used incorrectly.

11. Full IELTS Mock Tests

Create a dedicated mock-test engine.

A full Academic mock test should include:

Listening: approximately 30 minutes plus 10 minutes to transfer answers when applicable to the paper-based format.

Reading: 60 minutes.

Writing: 60 minutes.

Speaking: approximately 11–14 minutes, simulated separately if necessary.

Features:

Test instructions before starting.

Optional strict exam mode.

Section timers.

Question navigation.

Automatic answer saving.

Confirmation before submission.

No answer explanations until submission in strict mode.

Automatic scoring for objectively scored questions.

Estimated scoring for Writing and Speaking.

Combined results page.

Detailed skill breakdown and personalized next steps.

Use original, high-quality test questions with answer keys, explanations, and metadata. Every practice set must have validated questions and correct answers. Do not generate answer keys randomly or silently change them.

Keep practice tests, generated questions, and verified question banks clearly distinguished.

12. Band Score Calculator

Build an interactive score calculator for Listening and Reading.

Allow users to enter correct answers out of 40.

Use a configurable conversion table based on appropriate IELTS guidance.

Display the estimated band and explain that exact conversion can vary by test.

Show how many additional correct answers may be needed for the next target band, based on the configured table.

Calculate the overall estimated band by averaging the four skill scores and rounding to the nearest half band using IELTS rounding conventions.

Explain that official results are determined by IELTS assessment procedures.

13. Personalized Study Plan

Generate a daily and weekly plan based on the diagnostic test, target score, test date, and available study time.

Example daily routine:

20 minutes Listening.

25 minutes Reading.

30 minutes Writing.

15 minutes Speaking.

10 minutes vocabulary review.

Adjust the allocation to focus on weaker skills.

Include:

Daily tasks.

Weekly mock tests or sectional tests.

Review days.

Rest and catch-up options.

Completion tracking.

Calendar view.

Reminders where supported.

Weekly progress summaries.

Automatic plan adjustments after new test results.

Avoid guaranteeing that any particular study schedule will achieve a specific score.

14. Mistake Notebook

Every incorrect answer and important AI correction should be savable.

Store:

Original question.

Student's answer.

Correct answer or suggested revision.

Explanation.

Error category.

Date.

Related skill.

Review status.

Allow filtering by grammar, vocabulary, comprehension, spelling, timing, task response, coherence, and pronunciation.

Generate targeted quizzes from previously missed questions and concepts. Avoid repeating an identical question too frequently.

15. Progress Analytics

Build a detailed analytics page showing:

Estimated overall band trend.

Separate skill trends.

Accuracy by question type.

Average time per question.

Writing criterion trends.

Speaking criterion trends.

Grammar and vocabulary weaknesses.

Study consistency.

Mock-test comparisons.

Target-band gap analysis.

Generate actionable recommendations such as:
"Your Reading accuracy is improving, but True/False/Not Given questions remain a weakness. Complete a 15-question targeted drill before your next full test."

Base recommendations on stored performance data rather than generic claims.

16. Backend and Database

Use Supabase for:

Authentication.

PostgreSQL database.

Row-level security.

User profiles.

Test attempts and responses.

Question banks.

Writing submissions and feedback.

Speaking transcripts and recordings metadata.

Study plans.

Vocabulary progress.

Mistake notebook.

Achievement history.

Create proper database tables and relationships.

Include:

Secure user-specific access.

Data validation.

Database migrations or setup scripts.

Loading and error states.

Seed data containing validated sample tests.

Persistent progress across devices.

Store sensitive data securely. Do not expose private API keys or service-role credentials in frontend code.

17. AI Integration

Use a secure server-side integration for the selected language model.

Implement structured outputs for:

Writing evaluation.

Speaking feedback.

Question explanations.

Study-plan generation.

Personalized recommendations.

Vocabulary exercises.

Validate AI outputs against schemas before saving them.

Provide graceful fallback behavior if the AI service is unavailable. Clearly distinguish AI-generated estimates from objectively scored results.

Never simulate a successful AI evaluation with hardcoded feedback when the API is not connected.

Configure API keys using server-side secrets. Add rate limiting, error handling, and usage controls.

18. Accessibility, Privacy, and Performance

Responsive design.

Keyboard-accessible test controls.

Screen-reader labels.

Good color contrast.

Secure authentication.

User data deletion and account settings.

Consent before microphone access.

Clear handling of recordings and transcripts.

Efficient audio loading and database queries.

Helpful offline and network-error states where possible.

19. Development and Delivery Requirements

Build the application in working stages:

Stage 1: Responsive UI, navigation, authentication, onboarding, and dashboard.

Stage 2: Validated Listening and Reading question banks, timers, answer checking, and results.

Stage 3: Writing editor, rubric-based AI feedback, and revision workflow.

Stage 4: Speaking simulator, recording, transcription, and feedback.

Stage 5: Study plan, vocabulary, mistake notebook, and analytics.

Stage 6: Full mock tests, integration testing, security checks, and deployment readiness.

After each stage, test the main user journeys and fix errors before moving forward.

Deliver a usable, functional MVP first, with clear extension points for the remaining features.

Do not build only a visual prototype. Connect all implemented features to real application state and persistence. Document any features that still require external API keys or services.

The final product should feel like a personal IELTS coach, a reliable exam simulator, and a comprehensive study platform in one application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ielsts.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9fea8ee7-1f6a-4df0-b8db-592cec59865b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
