# Article & Project Digest — Aditya Kulkarni

Detailed proof points for use in CV generation, cover letters, and evaluations.
System reads this file at evaluation time — NEVER hardcode metrics from here.

---

## LLM Eval Harness

**Type:** Independent project
**Stack:** Python, Anthropic SDK, OpenAI SDK, Google GenAI SDK, DuckDB, Parquet, Streamlit, Docker
**When to use:** AI/ML Engineer roles, LLMOps/Platform roles, OpenAI/Anthropic/Glean/Harvey/Sierra — any role that cares about model quality measurement

**The problem:** Most engineers can *use* LLMs. Almost none can systematically *measure* them. Without a rigorous eval harness, model selection is guesswork — you can't compare vendors, detect regressions, or quantify hallucination risk under controlled conditions.

**The solution:** Built a vendor-neutral benchmark from scratch comparing Claude Sonnet 4.6, GPT-4o, and Gemini 2.5 Pro. Each vendor gets its own adapter behind a common `ModelAdapter` protocol — no shared abstractions that obscure billing semantics or rate-limit signals. Structured JSON outputs enforced at the schema level to eliminate parser noise.

**Benchmark scope:**
- 3 tasks: grounded single-hop QA, multi-hop QA (HotpotQA), claim verification (FEVER)
- 2,000-example frozen test set (700 grounded QA, 500 multi-hop, 400 FEVER, 400 synthetic enterprise-style)
- 3 repeated runs per model; temperature 0, pinned model IDs, fixed dataset manifest hash

**Metrics tracked:**
- Accuracy: ExactMatch, TokenF1, AbstentionAccuracy, EvidenceQuoteValidity
- Hallucination: grounded ResponseHallucinationRate (unsupported answer claims / total) + human annotation protocol with IAA and 3rd adjudicator on disagreements
- Latency: p50/p95 E2E and API round-trip (ms), TTFT for streaming runs
- Cost: per-call estimate + per-experiment reconciled against provider billing APIs
- Reliability: JSONValidity (schema pass rate per model)

**Statistical rigor:** Paired bootstrap 95% CIs, McNemar test on pairwise correctness, Holm correction across all pairwise comparisons.

**Infrastructure:** JSONL raw logs + Parquet normalized tables, DuckDB for analytical queries, Streamlit dashboard (accuracy vs cost scatter, p50/p95 latency bars, hallucination heatmap, per-example failure explorer), Docker container for reproducibility.

**Framing by archetype:**
- *LLMOps/Platform:* "Built a reproducible 3-model eval harness — grounded hallucination rate, p50/p95 latency, and cost/call tracked per model with statistical significance testing"
- *Agentic/AI Engineer:* "Benchmarked Claude, GPT-4o, Gemini on grounded QA + abstention — evidence-quote validation, FEVER claim verification, 2K-example frozen test set"
- *General SWE:* "Designed vendor-neutral adapter protocol and automated annotation pipeline; DuckDB + Parquet + Streamlit analytics stack"

---

## AlgoPulse – Agentic AI Platform

**Type:** Independent project  
**Stack:** TypeScript, Node.js, React, Supabase Edge Functions, Temporal.io, Kafka  
**When to use:** Platform/LLMOps roles, Agentic/Automation roles, Backend SDE roles

**The problem:** Standard API polling created a throughput bottleneck under heavy inference load — the architecture couldn't handle concurrent AI reasoning loops at scale.

**The solution:** Pivoted the entire stack to an event-driven model. Supabase Edge Functions stream AI reasoning loops directly to the client in real time. Temporal.io manages durable workflow state; Kafka handles backend message brokering and worker coordination.

**Metrics:**
- 2,000 async inference requests/second without dropping state
- Fault-tolerant worker architecture via Temporal state machines
- Zero message loss under load (Kafka durable queues)

**Framing by archetype:**
- *Platform/LLMOps:* "Identified polling bottleneck under load, re-architected to event-driven streaming — 2K req/sec throughput"
- *Agentic:* "Built durable agentic orchestration with Temporal — workflows survive failures, state is never lost"
- *Backend SDE:* "Led architecture pivot from polling to event-driven; TypeScript + Kafka + Supabase Edge Functions"

---

## Glance AI – Privacy-First RAG System

**Type:** Independent project  
**Stack:** Python, LLMs, Vector Databases, RAG  
**When to use:** AI/ML Engineer roles, Solutions Architect roles, fintech/healthcare-adjacent companies

**The problem:** Standard RAG systems leak context across tenants and generate hallucinations — unacceptable in regulated industries like fintech and healthcare.

**The solution:** Designed a per-tenant data isolation architecture at the vector retrieval layer. Each retrieval context is scoped to its tenant boundary before being passed to the LLM, preventing cross-contamination. Deterministic output patterns reduce hallucination risk.

**Metrics:**
- Per-tenant isolation: 0 cross-tenant context leakage by design
- Hallucination mitigation via deterministic retrieval constraints
- Compliance-ready for fintech/healthcare data environments

**Framing by archetype:**
- *AI/ML Engineer:* "RAG with per-tenant isolation — built for environments where data leakage is a compliance risk"
- *Solutions Architect:* "Designed privacy-first RAG architecture for regulated industries; deterministic retrieval, no hallucination"
- *Backend/Full Stack:* "Python RAG pipeline with vector DB scoping — enterprise-grade context management"

---

## CryptoKnight – Trustless AI Trading Agent

**Type:** Hackathon project (HackNC State) — built with Nisarg Jasani
**Stack:** ERC-4337 Account Abstraction, Alchemy Account Kit, Session Keys, Python agent, Next.js 16, viem, wagmi, Sepolia testnet
**When to use:** Crypto/Web3 roles, DeFi/autonomous finance, AI agent security, FinTech

**The problem:** To let an AI trade on your behalf (e.g., Polymarket prediction markets), you currently have to give it your private key. One bug or model compromise and all funds are lost — the "Delegation Dilemma."

**The solution:** ERC-4337 Account Abstraction with Session Keys. The AI agent receives a scoped Session Key (not the master key) bound to on-chain policies: max trade count, max allowance per trade, expiration timestamp, instant revocation. Funds stay in a self-custody smart account vault at all times. The agent is 100% autonomous but can never exceed its mandate.

**Analogy:** Pre-filled arcade game card (Session Key) vs. Platinum Credit Card (Private Key).

**Metrics:**
- 100% autonomous Polymarket farming — 0 private keys shared
- Session Key policies enforced on-chain: trade limits + allowance cap + expiry + revocation
- Full self-custody: funds never leave the smart account vault

**Framing by archetype:**
- *Crypto/Web3:* "Built trustless AI trading using ERC-4337 Account Abstraction — session key delegation with on-chain policy enforcement"
- *AI Agents:* "Designed constrained AI agent architecture for autonomous finance — the agent acts within cryptographically enforced limits"
- *FinTech/Security:* "Solved the private key delegation problem for AI-driven trading using smart account session keys"
- *Full Stack:* "Next.js 16 + viem + wagmi frontend + Python agent backend + Alchemy Account Kit — full DeFi stack"

---

## Isomer AI – Product Engineer Intern

**Type:** Internship (production)  
**Stack:** TypeScript, Node.js, Express, PostgreSQL, Redis, Prisma, Pusher, Temporal.io, Anthropic Claude, OpenAI GPT-4o, Google Gemini, MCP, Auth0, Docker, Playwright, Sentry  
**When to use:** Any SDE/AI role — strongest production proof point

**Metrics:**
- 394 commits to codebase
- 10+ backend features shipped
- 7 production deployments
- 3 LLM providers integrated (Claude, GPT-4o, Gemini), 8+ models
- Multi-model AI agent tooling with MCP

**Key systems built:**
- Temporal.io workflow orchestration for claims automation
- Role-based access control
- Real-time event pipelines (Pusher)
- Document processing pipelines (PDF generation, email parsing via Microsoft Graph API, S3)
- Multi-provider LLM routing with MCP tooling

**Framing by archetype:**
- *Agentic/Automation:* "Temporal.io orchestration + multi-model MCP tooling in production — 394 commits"
- *Platform/LLMOps:* "Multi-provider LLM routing across 3 providers, 8+ models; Sentry observability in prod"
- *Backend SDE:* "Full backend ownership: 10+ features, 7 deploys, TypeScript/Node.js/PostgreSQL"

---

## NC State Genomics Platform

**Type:** Graduate Research Assistant  
**Stack:** JBrowse 2, Google Cloud Run, ML (hyperparameter tuning, time-series)  
**When to use:** Cloud/infra roles, data platform roles, research-adjacent companies

**Metrics:**
- 500GB genomic dataset (strawberry + grape)
- 100+ researchers worldwide served
- 12% model accuracy improvement via hyperparameter tuning
- Deployed on Google Cloud Run

---

## PerCent – GenAI Finance App (HackNC24)

**Type:** Hackathon (48 hours)  
**Stack:** Python, Selenium, Hugging Face, Qwen-14B-Chat, RAG  
**GitHub:** github.com/adityapai18/HackNC24  
**When to use:** AI/ML roles, GenAI roles, Forward Deployed (speed signal), fintech-adjacent

**Metrics:**
- Top 10 of 100+ teams at HackNC24
- 30% reduction in manual financial research time
- Built complete MVP in 48 hours: goal tracking + expense logging + RAG chatbot
- Qwen-14B-Chat via Hugging Face for financial domain reasoning

---

## Mapify – ML & NLP Tool (IEEE Published)

**Type:** Published research / independent project  
**Stack:** T5-transformer, NLTK, NetworkX  
**GitHub:** github.com/Aditya-k24/mapify  
**When to use:** ML/NLP roles, research-adjacent, any role where publication signals rigor

**Metrics:**
- 1,500+ PDFs and images processed
- 60% reduction in academic review time
- Presented to 500+ attendees at IEEE conference
- IEEE published

---

## Sanjeevani – Predictive Health App

**Type:** Competition project  
**Stack:** React, ML classification models (real-time sensor data)  
**GitHub:** github.com/heet214/Sanjeevani-health  
**When to use:** ML roles, healthtech, full-stack + ML combos

**Metrics:**
- Top 1% of 1,100+ submissions (top 12)
- 87% classification accuracy on real-time sensor data
- Recognized for UI innovation and predictive health insights

---

## Demand Paging – Xinu OS

**Type:** Graduate coursework systems project  
**Stack:** C, Xinu OS  
**When to use:** Systems/infrastructure roles, kernel-adjacent work, low-level signal

**Metrics:**
- 8-store virtual memory system implemented from scratch in C
- Second-Chance page replacement: 25% page fault reduction
- 7+ kernel-level system calls added
- 15% memory performance improvement via inverted page tables + custom fault handler

---

## Cross-cutting signals

| Signal | Evidence |
|--------|----------|
| Production AI systems | Isomer AI: 394 commits, 7 deployments |
| Scale under load | AlgoPulse: 2K async req/sec |
| Compliance/regulated AI | Glance AI: per-tenant RAG isolation |
| Research publication | Mapify: IEEE published, 500+ audience |
| Speed / hackathon execution | PerCent: Top 10 of 100+ in 48h |
| Distributed systems | Kafka (AlgoPulse + Capgemini), Temporal (AlgoPulse + Isomer), Spark/Hadoop (Capgemini) |
| Multi-model LLM | Isomer AI: Claude + GPT-4o + Gemini + MCP |
| LLM evaluation / model measurement | Eval Harness: 2K-example benchmark, hallucination rate, p50/p95 latency, cost/call across 3 vendors |
| Low-level systems | Demand Paging: C, kernel syscalls, virtual memory |
