# Product-manual assistant
## User problem
Find trustworthy answers in manuals without manually browsing every page.

## Initial scope
- 3–5 public or non-sensitive product manuals stored locally.
- Questions answered from retrieved passages with document/page references.
- Clear uncertainty when evidence is missing or contradictory.
- Simple interface; start with a script or notebook when code is needed.

## Evidence of success
Define expected evidence for each question. Track retrieval quality separately from answer support, citation correctness, appropriate abstention, latency, and resource cost. Begin with 15 development and 15 held-out questions; expand when failures reveal gaps.

## Architecture progression
Manual context baseline → lexical retrieval → optional embedding retrieval → evaluated RAG → one controlled read-only tool → production considerations.

## Later branches
Applied AI: quality and reliability improvements.
FDE: customer workflow, integration, success criteria, and handover.
SDLC tooling: ticket-to-implementation-plan against a sample repository.

## Current status
Scaffold only. No manuals indexed, models configured, or evaluation results measured.
