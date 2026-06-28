# Flashstack

**Learn anything, one card at a time.** Flashstack is a flashcards app: discover AI-generated decks
(e.g. _Top 100 Spanish Phrases_, _Greek Gods_, _Bible Verses_), add them to your personal library,
and study them with **spaced repetition** so your time goes to the cards you find hardest.

Flashstack pairs an **AI deck-generation pipeline** (admins kick off a generation; Claude writes the
cards, then per-card images and pronunciation audio are generated to S3) with a clean publication
model so the Discover tab, library, and study flows never care how a deck was made.

> Architecture, quality bar, and toolchain are modeled on the **stoop** app — same Ionic + Amplify
> Gen2 stack, the same strict CI gates, and the same Gherkin-first → full-e2e workflow.

---

## Status

🚧 **Early MVP / active development.** The mobile client is scaffolded (Ionic + React) and the
Amplify Gen2 backend is initialized. Slices land per the [roadmap](#roadmap).

---

## Tech Stack

| Layer                   | Choice                                                                           |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Mobile / Web client** | [Ionic](https://ionicframework.com/) 8 + React 19 + TypeScript (strict)          |
| **Native shell**        | [Capacitor](https://capacitorjs.com/) (iOS / Android)                            |
| **Bundler**             | Vite                                                                             |
| **Backend**             | AWS Amplify Gen2 — Cognito auth + AppSync (GraphQL) + DynamoDB                    |
| **Testing**             | Vitest + Istanbul coverage (unit) · Playwright + playwright-bdd Gherkin (e2e)     |
| **AI**                  | Bedrock Claude (card text) · Bedrock Stability (card images) · Amazon Polly (audio) |

---

## Architecture

Flashstack is built around a small set of published resources and per-user study state.

```
   admin initiates                ┌──────────────┐
   generateDeck mutation  ──────► │  Deck-gen    │  Claude writes cards →
   (editors group)                │  pipeline    │  per-card [image + audio] →
                                  │ (Step Funcs) │  write Deck + Cards (DRAFT)
                                  └──────┬───────┘
                                         │  admin edits / regenerates / publishes
                                         ▼
   Discover (category shelves) ◄── Deck (PUBLISHED) ──► Card (front/back/hint/example/image/audio)
                                         │
                user adds to "My Decks"  ▼
            UserDeck ──► play & self-grade ──► UserCardReview (SM-2 ease/interval/dueAt)
```

### Core models

| Model            | Purpose                                                                           |
| ---------------- | --------------------------------------------------------------------------------- |
| `Category`       | Discover shelves (the browsable category rows + their order/labels).              |
| `Deck`           | A published (or draft) deck: topic, category, voice language, status, card count. |
| `Card`           | One card: front, back, hint, example, image (S3), audio (S3).                     |
| `GenerationRun`  | One AI generation run — powers the admin dashboard.                               |
| `UserDeck`       | A user's saved deck ("My Decks"). Owner-scoped.                                   |
| `UserCardReview` | Per-(user, card) SM-2 state: easeFactor, interval, repetitions, dueAt.            |

### Spaced repetition

Study uses canonical **SM-2** (the SuperMemo / Anki algorithm). After each self-grade (0–5) a pure,
fully-tested function updates the card's ease factor, interval, and next due date; the play session
front-loads new and overdue cards.

---

## Getting Started

```bash
git clone https://github.com/johnpc/flashstack
cd flashstack
npm install
npm run dev            # Vite dev server (or: ionic serve)
```

### Backend sandbox

The Amplify Gen2 backend lives in [`amplify/`](amplify/). Spin up a personal cloud sandbox (deploys
to your AWS account and writes `amplify_outputs.json`):

```bash
npx ampx sandbox
npm run seed           # seed Discover categories (needs an editor TEST_USERNAME/TEST_PASSWORD)
```

---

## Quality Gates

Flashstack enforces strict quality requirements. Every gate runs in CI on PRs to `main`, and the
blocking gates also run locally on every commit via a Husky pre-commit hook.

| Command                 | What it checks                                                                |
| ----------------------- | ----------------------------------------------------------------------------- |
| `npm run lint`          | ESLint — including `no-explicit-any: error` (no `any`, ever)                  |
| `npm run format:check`  | Prettier formatting                                                           |
| `npm run check:lines`   | File-length discipline — every `.ts`/`.tsx` source file stays ≤ 100 lines     |
| `npm run test:coverage` | Vitest unit tests with an **80% floor** (statements/branches/functions/lines) |
| `npm run crap`          | **CRAP score** per function — fails any function over **15**                  |
| `npm run build`         | TypeScript + Vite production build                                            |
| `npm run test:e2e`      | **Gherkin** acceptance tests via Playwright + playwright-bdd                  |
| `npm run quality`       | Runs the full local gate in sequence                                          |

All acceptance tests are written as Gherkin `.feature` files — never raw spec code. The fix for low
coverage is always a new test, never an exclusion.

---

## iOS / Android Deployment (CI)

`.github/workflows/ios-deploy.yml` archives the app and uploads to TestFlight; `android-deploy.yml`
builds a debug APK and publishes it to a GitHub Release. Both run after CI succeeds on `main`.

Required repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `TEST_USERNAME`,
`TEST_PASSWORD`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_CONTENT`, `TEAM_ID`.

- **iOS bundle id:** `com.johncorser.flashstack`

---

## Roadmap

| #   | Milestone                                                                       |
| --- | ------------------------------------------------------------------------------- |
| 1   | Scaffold + public repo + CI gates + Discover shelves (read path)                |
| 2   | Discover decks — category shelves list published decks                          |
| 3   | My Decks — add/remove a deck (owner-scoped)                                      |
| 4   | Study — play a deck, self-grade, SM-2 spaced repetition                         |
| 5   | Admin deck generation — Bedrock + Polly Step Functions pipeline + manage/publish |
| 6   | iOS + Android auto-publish verification                                         |

---

## License

Private / proprietary. All rights reserved.
