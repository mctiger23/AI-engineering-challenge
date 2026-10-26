# Local setup

## Clone on your Mac
Run in Terminal:

```bash
git clone https://github.com/mctiger23/AI-engineering-challenge.git
cd AI-engineering-challenge
git status
```

If you already cloned the old project, commit or back up any uncommitted changes first. Inspect `git status`, switch to `main`, then use `git pull --ff-only`. Do not discard local work to force an update.

Open this folder in your editor or select it as a Codex workspace. Repository instructions live in AGENTS.md. Cloning a repository does not itself configure or verify your local Codex installation or account.

## First session
Open notes/week-01.md and follow its checklist. No packages, API keys, containers, or deployment setup are required.

## Save your work
```bash
git status
git diff
git add notes/week-01.md docs/progress.md
git diff --cached
git commit -m "Record Week 1 learning notes"
git push
```

Review every staged file because this is a public repository. Add new experiment files by explicit path after checking their contents. Keep private manuals and sensitive traces in ignored locations.

## When implementation begins
Choose Python or TypeScript based on the exercise, then document exact versions, install commands, run commands, and checks here. Add an example environment file with placeholders only if configuration becomes necessary.

## Recover the earlier work
Browse the backup branch on GitHub, or inspect it locally:
```bash
git fetch origin
git show origin/backup/before-learning-reset-2026-10-26:README.md
```
The backup contains the prior application and plan.
