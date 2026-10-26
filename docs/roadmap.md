# AI Engineering Roadmap: Decisions, Debugging, and System Design
Prepared for Migs · October 26, 2026

## Goal and scope
Build the judgment to explain AI concepts, select an architecture, investigate failures, and discuss tradeoffs in applied AI, FDE, and AI developer-tooling interviews.

Suggested pace: nine weeks, five sessions per week, 60–90 minutes per session. This is an adjustable study plan, not a promise of job readiness. Extend a week when its checkpoint remains difficult.

One project anchors the entire path: a product-manual assistant that answers with document and page references and acknowledges missing evidence. Start with 3–5 public or non-sensitive manuals. Keep the interface simple.

## How to tackle each lecture
1. Before watching: write one question you want the material to answer.
2. Watch 20–30 minutes at a time; pause to sketch the mechanism or predict a result.
3. Explain the idea from memory in five sentences.
4. Run one small experiment connected to your project.
5. Record the evidence and the decision it supports.

Weekly rhythm:
- Session 1: watch/read and summarize.
- Session 2: implement a minimal example.
- Session 3: deliberately introduce a failure and inspect it.
- Session 4: compare two approaches while holding other variables steady.
- Session 5: explain your decision aloud, update the project, and complete the checkpoint.

Spend roughly one-third of your time on content and two-thirds on experiments, inspection, and explanations. This is a recommended allocation, not a research finding.

## Resource shelf
The sequence below selects practitioner explanations and university references by fit to your goals. It does not claim that popularity or testimonials establish career outcomes. Learning content is free; API calls, hosting, and GPU exercises may cost money. Watch/read without paid compute, or adapt experiments to a local model. Local performance depends on available hardware.

**R1 — Andrej Karpathy: Intro to Large Language Models**
https://www.youtube.com/watch?v=zjkBMFhNj_g
An approximately one-hour conceptual introduction. Start here; some examples and model capabilities reflect its publication date.

**R2 — Andrej Karpathy: Deep Dive into LLMs like ChatGPT**
https://www.youtube.com/watch?v=7xTGNNLPyMI
Use selected sections on tokenization, pretraining, post-training, and model behavior. Split the longer video across sessions; you do not need to reproduce a training pipeline.

**R3 — Microsoft: Generative AI for Beginners**
https://github.com/microsoft/generative-ai-for-beginners
Use lessons by title: prompt engineering, search and vector databases, function calling, security, application lifecycle, and RAG. Python and TypeScript examples make this useful for an existing developer. Check current setup instructions rather than copying an old video environment.

**R4 — DataTalks.Club: LLM Zoomcamp**
https://github.com/DataTalksClub/llm-zoomcamp
Main implementation companion for retrieval, RAG, evaluation, and monitoring. Use the relevant modules rather than trying to complete a second full course simultaneously.

**R5 — Hamel Husain and Emil Sedgh: How to construct domain-specific LLM evaluation systems**
https://ai.engineer/talks/eLXF0VojuSs-construct-domain-specific-llm-evaluation-systems
An approximately 19-minute case study. Watch for the transition from a convincing demonstration to a measurable improvement process.

**R6 — Hamel Husain and Shreya Shankar: AI Evals FAQ**
https://hamel.dev/blog/posts/evals-faq/
Read selected sections on minimum viable evaluation, error analysis, traces, reference answers, and validating automated judges. The public article is the assigned resource; its linked paid course is not required.

**R7 — Anthropic: Building effective agents**
https://www.anthropic.com/research/building-effective-agents
Read for architecture patterns and the choice between fixed workflows and model-directed agents. The article warns that tooling has evolved since its original publication; use current documentation for implementation.

**R8 — Stanford CS329S: Machine Learning Systems Design**
https://stanford-cs329s.github.io/syllabus.html
Selected archived notes on offline evaluation, deployment, monitoring, and data shifts. This provides broader ML systems context; it is not a current LLM SDK tutorial.

**R9 — Hugging Face Agents Course**
https://huggingface.co/learn/agents-course/en/unit0/introduction
Optional implementation reference after the basic assistant works. Pick one framework only if it solves a concrete need.

**R10 — Math and neural-network references, as needed**
Stanford CS229 public archive:
https://see.stanford.edu/Course/CS229/
MIT Introduction to Deep Learning, 2025:
https://introtodeeplearning.com/2025/index.html
Use probability/linear algebra reviews or introductory neural-network material when a question requires it. These are supporting references, not prerequisites to completing this roadmap.

## Week 1 — Understand what an LLM does
Content: R1; selected R2 sections to clarify tokenization and training versus inference.
Concepts: tokens, parameters, context window, training, inference, probabilistic output, hallucination.

Sessions:
1. Watch the first part of R1; map training and inference separately.
2. Finish R1; explain how a model receives context and generates output.
3. Ask a model questions with complete, missing, and contradictory source context.
4. Repeat a task several times; record behavior and settings without assuming identical outputs.
5. Explain five concepts without notes and identify what the experiment did not prove.

Deliverable: one-page mental model and a small output log.
Checkpoint: explain why fluent output does not establish factual correctness and why a document absent from the prompt may be unavailable to the system.
Defer: training a transformer from scratch and optimization derivations.

## Week 2 — Establish a baseline and define success
Content: R3 prompting material; R5; R6 minimum viable evaluation and error analysis.
Concepts: structured outputs, traces, rubrics, reference evidence, baseline, held-out evaluation.

Sessions:
1. Watch R5 and define the assistant's users and supported questions.
2. Create 30 questions: 15 for development and 15 reserved for later checks. Include answerable, ambiguous, and unanswerable cases.
3. For each question, record expected source/page or why no answer is supported.
4. Build a simple baseline using manually supplied relevant passages; record input, output, and latency.
5. Label failures and write pass/fail rules for evidence support, citation correctness, and appropriate uncertainty.

Deliverable: evaluation questions, baseline results, and initial failure categories.
Checkpoint: distinguish “sounds good” from “meets a defined requirement.”
Note: 30 questions is a manageable learning starting point, not evidence of production reliability. Expand coverage as failure patterns emerge.

## Week 3 — Build retrieval and RAG
Content: R3 search/RAG lessons; relevant R4 retrieval material.
Concepts: parsing, chunking, embeddings, lexical search, vector search, metadata, top-k.

Sessions:
1. Parse 3–5 manuals and preserve document names and page numbers.
2. Implement lexical retrieval as a baseline.
3. Add embedding-based retrieval if feasible; inspect the retrieved passages before generating answers.
4. Compare exact identifiers and paraphrased questions across retrieval approaches.
5. Connect retrieval to generation; require source references tied to actual passages.

Deliverable: a minimal end-to-end assistant and a retrieval comparison.
Checkpoint: explain why an embedding model and a generation model have different jobs, and when exact-match search can help.

## Week 4 — Diagnose failures systematically
Content: R6 error analysis; R4 retrieval/evaluation material.
Concepts: retrieval recall, answer support, citation accuracy, chunk boundaries, reranking.

Sessions:
1. Review failing development questions and their complete traces.
2. Bucket root causes: parsing, retrieval, missing context, reasoning, citation, or unsupported request.
3. Change chunk size or overlap; keep the model, prompt, and questions fixed.
4. Compare top-k settings; optionally test reranking if retrieval ordering is a demonstrated issue.
5. Repeat the original baseline comparison and write what improved, regressed, or remained uncertain.

Deliverable: a before/after evaluation and three short incident writeups.
Checkpoint: answer “The assistant is wrong—what do you inspect first?” using evidence from your project.
Guardrail: do not use the held-out set repeatedly to tune your configuration.

## Week 5 — Make architecture choices
Content: R2 selected post-training sections; R3 model selection; R7 architecture discussion.
Concepts: prompting, RAG, fine-tuning, local versus hosted inference, model selection.

Sessions:
1. Write requirements for privacy, latency, quality, budget, and document freshness.
2. Compare a simple prompt, retrieved context, and a fixed workflow for specific tasks.
3. Compare two models on the development set if affordable; otherwise document an experimental design and mark results as unmeasured.
4. Draft a decision record: options, evidence, tradeoffs, and reversal conditions.
5. Present why your chosen architecture fits the requirements.

Deliverable: architecture sketch and two decision records.
Checkpoint: explain why RAG and fine-tuning address different needs and why they can be combined.
Defer: implementing fine-tuning unless a measured requirement justifies it.

## Week 6 — Add controlled tool use
Content: R3 function calling; R7; optional R9.
Concepts: schemas, tool selection, workflows, agents, validation, permissions, timeouts.

Sessions:
1. Define a read-only tool for looking up a product's specifications.
2. Validate tool inputs and handle unknown product identifiers.
3. Inject timeouts, malformed results, and empty responses.
4. Compare a fixed routing workflow with model-selected tool use on a small task set.
5. Document the extra failure modes and whether the added flexibility helps.

Deliverable: one reliable tool integration with explicit failure handling.
Checkpoint: explain when ordinary application code is preferable to an autonomous agent.
Guardrail: require explicit authorization for any future tool that changes external data.

## Week 7 — Operate the system
Content: R8 evaluation, deployment, and monitoring notes; R4 monitoring material.
Concepts: offline tests, production monitoring, p50/p95 latency, cost, caching, versioning, access control.

Sessions:
1. Add request identifiers and stage-level timings.
2. Track retrieval failures, unsupported answers, model errors, and resource usage.
3. Test a stale document, an unauthorized document, and instructions embedded inside retrieved content.
4. Test cache invalidation when documents change; describe timeout and fallback behavior.
5. Write a small runbook for a quality regression or model-provider outage.

Deliverable: deployment checklist, measured local results, and runbook.
Checkpoint: explain why a good offline score does not guarantee good production behavior.
Measurement note: report sample size and environment; a handful of local requests does not establish production tail latency.

## Week 8 — Apply the skills to a target role
Choose one branch; completing every branch is unnecessary.

Applied AI:
- Improve one documented failure category.
- Add repeatable evaluation to the development workflow.
- Explain quality, latency, and cost tradeoffs.

FDE:
- Write a mock customer brief: current workflow, stakeholders, constraints, integration needs, and success criteria.
- Demonstrate how the assistant fits an existing workflow.
- Produce a handover note and separate measured benefits from hypothetical ROI.

AI developer tooling / SDLC:
- Build a small ticket-to-implementation-plan feature using a sample repository.
- Evaluate invented file references, missing dependencies, and whether suggestions fit repository conventions.
- Require review before code changes or external actions.

Deliverable: role-specific demo and a short business or engineering case.
Checkpoint: defend the architecture to someone who challenges its complexity.

## Week 9 — Consolidate and practice interviews
Content: revisit only the resources needed to resolve gaps.

Sessions:
1. Freeze the configuration and run the held-out questions; report all outcomes.
2. Write a README with reproducible setup, architecture, limitations, and evaluation method.
3. Prepare three stories: architecture choice, investigated failure, and measured improvement.
4. Practice a 10-minute design walkthrough followed by failure and tradeoff questions.
5. Identify remaining gaps and choose the next four weeks of deliberate practice.

Deliverable: portfolio repository, short demonstration, evaluation report, and interview notes.
Checkpoint: explain the system without a framework's vocabulary doing the work for you.
This checkpoint shows progress; it does not guarantee interview success or employment.

## Troubleshooting reference
| Symptom | Inspect first | Controlled next experiment |
|---|---|---|
| Wrong document retrieved | Parsing, metadata filters, query, retrieval scores | Compare lexical and vector retrieval on the same queries |
| Relevant text is absent | Chunk boundaries, top-k, indexing completeness | Inspect source pages and alter one retrieval variable |
| Relevant text retrieved but answer wrong | Exact model input, conflicting passages, instruction following | Test with the correct passage alone |
| Unsupported claim or citation | Evidence mapping and citation generation | Verify cited passages against each claim |
| Tool call fails | Tool arguments, schema, response, timeout | Reproduce the call independently of the model |
| Slow response | Timings by stage, input size, model, tool calls | Optimize the measured bottleneck |
| Quality drops after an update | Document/model/prompt versions and changed question mix | Re-run the frozen evaluation and compare traces |

These are diagnostic starting points, not guarantees of root cause.

## Reusable decision and incident templates
Decision:
- Requirement and constraints:
- Options considered:
- Evidence and sample size:
- Choice and tradeoffs:
- What would make me reconsider:

Incident:
- Expected versus actual behavior:
- Exact input and trace:
- Failure stage and evidence:
- Hypothesis:
- Single change tested:
- Result and regressions:
- Remaining uncertainty:

## Completion tracker
| Week | Content reviewed | Experiment completed | Checkpoint explained | Evidence recorded |
|---|---|---|---|---|
| 1 | [ ] | [ ] | [ ] | [ ] |
| 2 | [ ] | [ ] | [ ] | [ ] |
| 3 | [ ] | [ ] | [ ] | [ ] |
| 4 | [ ] | [ ] | [ ] | [ ] |
| 5 | [ ] | [ ] | [ ] | [ ] |
| 6 | [ ] | [ ] | [ ] | [ ] |
| 7 | [ ] | [ ] | [ ] | [ ] |
| 8 | [ ] | [ ] | [ ] | [ ] |
| 9 | [ ] | [ ] | [ ] | [ ] |

## Your first session
Watch the first 20–30 minutes of R1. Write a five-sentence explanation of training versus inference. Pick the manuals for the project and write five questions a useful assistant should answer. Stop there; there is no need to set up a large framework on day one.

## Evidence and limitations
Resource links and public descriptions were checked during the October 26, 2026 conversation. University archives are intentionally labeled by edition; examples and libraries can age. The ordering, time budget, experiments, and readiness checkpoints are recommendations tailored to your stated goals, not claims from the course providers. Practitioner talks are selected for relevant explanations and case studies, not verified evidence that viewing them produces a career transition.
