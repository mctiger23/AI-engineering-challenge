# AI Engineering Learning Lab

A nine-week learning workspace for engineering judgment: explain AI behavior, investigate failures, measure changes, and defend architecture decisions.

## Start here
1. Read [the roadmap](docs/roadmap.md).
2. Open [Week 1](notes/week-01.md).
3. Watch 20–30 minutes of [Karpathy's LLM introduction](https://www.youtube.com/watch?v=zjkBMFhNj_g).
4. Explain training versus inference in five sentences and write five questions for the document assistant.
5. Update [progress](docs/progress.md).

Pace: five sessions per week, 60–90 minutes each. No dependencies or model subscriptions are needed to start taking notes.

## Workspace
| Folder | Purpose |
|---|---|
| docs/ | Roadmap, setup, project scope, and progress |
| notes/ | Lecture notes and explanations |
| experiments/ | Small, reproducible comparisons and failure investigations |
| evaluations/ | Questions, rubrics, traces, and results |
| decisions/ | Architecture decisions backed by evidence |
| src/ | Reusable application code as experiments mature |
| data/ | Local documents; private inputs stay untracked |

## Project
Build a product-manual assistant with document/page references and honest handling of missing evidence. Start with a simple baseline and add complexity only when measured failures justify it. See [scope](docs/project-brief.md).

## Working with Codex
Open this repository as your Codex workspace. [AGENTS.md](AGENTS.md) describes the learning workflow. Ask: “Guide me through Week 1, Session 1. Help me reason before providing a complete solution.”

See [local setup](docs/setup.md) for cloning and daily use.

## Fresh start
The earlier 90-day plan and RAG application are preserved on branch `backup/before-learning-reset-2026-10-26`. The main branch starts a new learning workspace; previous commits remain in history. No application or deployment is claimed to be working yet.
