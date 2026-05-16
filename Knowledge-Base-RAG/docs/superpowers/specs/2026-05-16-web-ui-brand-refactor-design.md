# Web UI brand refactor design

## Goal

Refactor `apps/web` from a small set of inline-styled pages into a cohesive dark-first application shell using the user's personal brand system and shadcn-style UI primitives. The first pass should make the current product feel intentional, preserve the existing chat flow, and add the missing ingest surface already implied by the homepage.

## Product direction

The frontend should feel like an evidence desk rather than a generic chatbot:

- conversation remains central
- retrieved sources feel first-class, not supplemental
- the app shell is durable enough to host future tools without another redesign

## Chosen approach

Use a shell-first refactor:

- introduce a shared app shell with a slim left navigation rail and restrained top context area
- keep chat and ingest as sibling workspaces inside that shell
- rebuild chat around a persistent two-pane layout: conversation on the left, sources on the right
- add an ingest page so navigation points to a real destination
- avoid expanding into a full dashboard or marketing-style homepage in this pass

## Information architecture

### Global shell

- Left rail:
  - product mark/name
  - navigation entries for chat and ingest
- Top area:
  - page title
  - concise supporting description or contextual controls
- Main content:
  - route-specific workspace

### Chat workspace

- Header region with provider and model controls
- Main desktop layout:
  - left: message history and composer
  - right: retrieved sources panel
- Responsive layout:
  - source panel stacks beneath conversation on narrower screens

### Ingest workspace

- Form fields:
  - source name
  - document content
  - optional metadata if already supported cleanly by the API contract
- Result area:
  - success state with indexed chunk count and document id
  - error state with readable failure feedback

### Root route

- Prefer direct entry into the product experience rather than a marketing page.
- The root route may redirect to chat or remain as a minimal shell-aligned entry page; avoid building a separate branded landing experience in this pass.

## Visual system

Apply the personal brand system globally:

- background: `#0E0E0F`
- surface: `#1A1A1C`
- border: `#2A2A2C`
- primary text: `#F5F5F4`
- secondary text: `#A1A1A1`
- spotlight accent: `#FF5C1A`
- structural secondary: `#1E3A8A`

Rules:

- orange is used sparingly for the one primary action or active focal point
- navy is reserved for larger structural areas, not small dark-on-dark details
- borders are preferred over loud fills
- sentence case only
- whitespace and typography should carry hierarchy before color does

Typography:

- headings: Inter
- body: IBM Plex Sans
- code / technical metadata: JetBrains Mono where useful

## Component strategy

Introduce a small shadcn-style foundation rather than continuing inline styles.

Expected primitives:

- `Button`
- `Card`
- `Textarea`
- `Select`
- `Badge`
- `ScrollArea`

Supporting utilities:

- shared CSS variables / theme tokens
- `cn` helper for class composition

Feature components should consume those primitives so future screens inherit the same system naturally.

## Interaction states

### Chat

- clear empty state before the first message
- loading/streaming state on send
- disabled send behavior when query/provider/model are incomplete
- visible provider/model selection without letting controls dominate the screen
- citations populate both the source pane and the relevant assistant message

### Ingest

- clear submitting state
- success confirmation after indexing
- readable error state on failure
- snackbar/toast confirmation for completed indexing
- snackbar/toast notice for transient ingest failures, paired with persistent inline feedback

### Navigation

- current route should be visually distinct but restrained
- route labels remain short and sentence-cased

## Error handling

- Preserve existing API contracts.
- Chat failures continue to appear in the conversation thread, but should be visually softened into an intentional error treatment.
- Ingest failures should be shown adjacent to the form result area, not hidden or only logged.
- Use snackbars/toasts for transient status communication:
  - ingest completed
  - ingest failed
  - provider/runtime configuration load failed
- Keep durable or inspectable information inline:
  - chat stream errors remain in-thread
  - ingest result details remain in the page after the toast disappears

## Technical boundaries

- remove inline style usage from the refactored frontend surfaces
- separate shared UI primitives from feature-specific chat and ingest components
- keep API client behavior intact unless a small adaptation is needed for ingest UI integration
- avoid unrelated backend or data-model changes

## Verification

- run frontend typecheck
- run frontend build
- manually verify:
  - chat load state
  - provider/model controls
  - send/stream flow
  - citation rendering
  - ingest success/error path
  - responsive layout behavior

## Out of scope

- full dashboard analytics
- user authentication
- backend redesign
- extensive animation
- multi-theme support
- a standalone marketing homepage

## Open implementation choices

- Whether `/` redirects to `/chat` or stays as a minimal shell-native entry page can be decided during planning based on the cleanest route structure.
- The exact shadcn component import path / generation method can be chosen during implementation to fit the existing repo setup.
