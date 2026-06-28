# Flashstack

AI-generated flashcard decks with spaced-repetition study. Architecture, quality bar, and toolchain
are modeled on the **stoop** app (`~/repo/stoop`) — when a pattern is unclear here, stoop is the
reference implementation.

## How we work together (read this first)

The person directing you may be **non-technical** — an "idea guy" who owns the **product**. They
define **WHAT**: features, intent, and Gherkin acceptance scenarios. **You own the HOW**:
architecture, code quality, testing, and every technical decision below.

- **Never ask them to make a technical call.** Don't surface coverage numbers, CRAP, lint,
  file-length, library choices, or schema design as questions. Decide them yourself, to the
  standards in this file, silently.
- **Translate vague ideas into Gherkin.** When they describe a feature, propose concrete `.feature`
  scenarios (Given/When/Then) and confirm those — that's the spec you build to.
- **Only escalate genuine _product_ questions** — ambiguous behavior, scope, copy, what a screen
  should do. Everything technical is yours.

## Workflow: specs-first vertical slices

Every feature ships as one **thin vertical slice** — UI + hook + API + backend model + tests, just
enough for the scenario, nothing speculative.

1. **Spec first.** Write/confirm Gherkin scenarios in `e2e/features/<slice>/*.feature`, steps in
   `e2e/steps/`.
2. **Scaffold backend only as the slice needs it** — add Amplify models + seed in `amplify/` for
   exactly this slice's read patterns; don't model ahead of a UI that uses it.
3. **Implement to pass the spec** — follow the architecture and file conventions below.
4. **Run the full quality gate** (`npm run quality`) and get it green locally.
5. **Deploy + seed** the backend if it changed (`npx ampx sandbox`, `npm run seed`).
6. **Conventional commit, push, CI green.** Open a PR; CI blocks the merge.

## Stack

- **Client:** Ionic 8 + React 19 + TypeScript (strict), Vite, Capacitor (iOS via SPM).
- **Backend:** AWS Amplify Gen2 — Cognito auth + AppSync (GraphQL) + DynamoDB. Lives in `amplify/`.
- **AI:** Bedrock Claude (card text, tool-forced structured output), Bedrock Stability (card
  images), Amazon Polly (pronunciation audio).

## Architecture

- **`Category`** owns the Discover shelves (which category slugs surface, their order and labels).
- **`Deck`** is the published unit; **`Card`** holds front/back/hint/example/image/audio. Decks carry
  a denormalized `categorySlug` matching a `Category`.
- **`GenerationRun`** records one AI generation (admin dashboard) — the `SyncRun` analogue from stoop.
- Per-user state is owner-scoped: **`UserDeck`** ("My Decks") and **`UserCardReview`** (SM-2 state).
- The **deck-generation pipeline** is admin-initiated (a `generateDeck` custom mutation, editors
  group) → Step Functions: Claude writes cards → per-card Parallel [image + audio] → write Deck +
  Cards as DRAFT → admin edits/regenerates/publishes. Lambdas write straight to DynamoDB via their
  IAM roles (bypassing AppSync), mirroring stoop's ingestion.

### Amplify auth contract (client mode ↔ schema rule MUST match)

A request is authorized only when the **client `authMode`** and the model's **`allow.*` rule** name
the **same provider**. Mismatches return `Unauthorized` / empty results, not a loud error.

- The data client (`src/lib/dataClient.ts`) defaults to **`identityPool`**; `readAuthMode()` upgrades
  signed-in users to **`userPool`** (group claims ride in the JWT).
- Read models grant guest + `authenticated('identityPool')` + `authenticated()` (userPool) reads, and
  `group('editors')` writes.
- Per-user models use `allow.owner()` (userPool) — read/write these with the userPool authMode.
- Editor writes (seed, authoring) use `authMode: 'userPool'`; the seed signs in as an editor.

### Code organization (vertical slices)

Features live under `src/features/<feature>/`, tests colocated:

- **`useX.ts`** — hooks hold all logic/orchestration; client state via Context + Hook + Provider.
- **`xApi.ts`** — all server state through react-query (`useQuery`/`useMutation`) wrapping the
  Amplify client. No server fetches in components.
- **`X.tsx`** — components only render.
- **`x.ts`** helpers — pure functions for non-trivial logic (unit-testable, keeps files short).
- **`X.css`** — consume `--fs-*` design tokens / role classes from `src/theme/variables.css`.

## Quality gates (non-negotiable — CI + husky pre-commit enforce them)

Run `npm run quality` for the full set. **Enforce them yourself; when one fails, fix the code, never
the gate.** Scope covers both `src/` and `amplify/` LOGIC; only declarative files are exempt
(`amplify/**/resource.ts`, `amplify/backend.ts`, `amplify/seed/fixtures/**`).

- **No `any`, ever.** ESLint `@typescript-eslint/no-explicit-any: error`.
- **Every `.ts`/`.tsx` logic file ≤ 100 lines** (`npm run check:lines`). Over → extract a helper.
  Never raise the limit.
- **≥ 80% coverage** on every logic file. Fix by writing tests — never exclusions.
- **CRAP ≤ 15 per function** (`npm run crap`).
- **Acceptance tests are always Gherkin** (`.feature` + steps), run via Playwright + playwright-bdd.
- **Build must pass** (`npm run build`). **Format clean** (Prettier).

### Honest e2e

Every data-reading flow must be exercised at least once asserting on **rendered real (seeded) data**
— never just a URL or element visibility. After signing in, wait for the Cognito session before
reading data.

## Commands

```bash
npm run dev            # Vite dev server
npm run quality        # full local gate: lint + check:lines + coverage + crap + build
npm run format         # Prettier write (run before committing)
npm run test:e2e       # Gherkin acceptance tests (bddgen + Playwright)
npm run seed           # seed Discover categories (idempotent; needs editor creds)
npm run e2e-config     # pull amplify_outputs.json from the sandbox stack
npx ampx sandbox       # personal cloud backend sandbox
```

## Key facts

- **Repo:** `johnpc/flashstack` (public).
- **iOS bundle id:** `com.johncorser.flashstack`. Region `us-west-2`, AWS profile `personal`.
- **Sandbox stack:** `amplify-flashstack-xss-sandbox-36f6fbd736` (used by `e2e-config`).
- **CI:** `.github/workflows/ci.yml` (quality + Gherkin acceptance) blocks PRs.
  `ios-deploy.yml` / `android-deploy.yml` publish after CI on `main`. Secrets: `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY`, `TEST_USERNAME`, `TEST_PASSWORD`, `ASC_KEY_ID`, `ASC_ISSUER_ID`,
  `ASC_KEY_CONTENT`, `TEAM_ID`.

## Conventions

- **Conventional commits** (`feat:`, `fix:`, `chore:`, `ci:`, `docs:` …).
- Keep logic out of view components. Throwaway scripts go in `/tmp`, not the repo.
