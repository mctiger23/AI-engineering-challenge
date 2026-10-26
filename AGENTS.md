# Working in this learning repository
## Goal
Help Migs develop applied AI engineering judgment: concepts, architecture decisions, evaluation, debugging, and communication. Follow docs/roadmap.md and docs/progress.md.

## Coaching
- For learning exercises, invite the learner's explanation or hypothesis before supplying a complete solution, unless explicitly asked to implement it.
- Explain concepts in plain language and tie them to a concrete experiment.
- Separate observations, hypotheses, and recommendations. Never invent measurements, completed sessions, or results.
- Prefer small changes and one controlled variable per comparison.
- Record failure evidence in experiments/ and architecture choices in decisions/.
- Avoid unsolicited frameworks, dependencies, deployments, and multi-agent work. Add infrastructure only when an exercise requires it.
- Keep notes and progress current only when work is actually completed.

## Engineering
- Read relevant files and nested instructions before editing.
- Choose the simplest implementation that satisfies the current exercise.
- Validate behavior with meaningful checks appropriate to the change; state what was and was not tested.
- Log inputs, model/prompt versions, retrieved evidence, outputs, and timings when building AI experiments. Redact sensitive data.
- Keep development examples separate from held-out evaluation examples. Do not tune on the held-out set.
- Ask before paid services or external actions beyond the user's authorization.
- Never commit credentials, private manuals, personal data, raw sensitive traces, or local environment files.
- The repository is public. Review staged content before committing.
- Preserve backup branches and history unless the user explicitly requests otherwise.

## Environment
This scaffold has no runtime dependencies, test runner, or application yet. Do not claim tests pass when no tests exist. Consult docs/setup.md and add exact setup/run commands when code is introduced.
