# Aditya Kulkarni

**Location:** Raleigh, NC  
**Phone:** (281) 876-7066  
**Email:** adityakulkarnius@gmail.com  
**LinkedIn:** linkedin.com/in/aditya-kulkarni-355b81217  
**GitHub:** github.com/Aditya-k24  
**Portfolio:** kulkarniaditya.com  

---

## Education

**North Carolina State University** — Raleigh, NC  
Master of Science in Computer Science | Aug 2024 – May 2026  
Courses: Artificial Intelligence, Operating Systems, Data Science, Object Oriented Development, Software Engineering, Algorithms

**Mumbai University** — Mumbai, India  
Bachelor of Technology in Computer Science | Aug 2020 – May 2024  
CGPA: 9.32/10  
Courses: Data Warehousing, Big Data Infra, DS & Algorithms, OS, Machine Learning, Software Engineering, Blockchain

---

## Experience

### Graduate Research Assistant — NC State University | April 2025 – Present
- Designed a cloud-based genomic data platform with JBrowse 2, enabling interactive exploration of strawberry and grape datasets (500GB) for 100+ researchers worldwide, deployed on Google Cloud Run
- Collaborated on ML architecture design, applying hyperparameter tuning and time-series analysis, improving model accuracy by 12%

### Product Engineer Intern — Isomer AI | May 2025 – May 2026
- Shipped features across a per-tenant insurance AI platform — each customer runs on its own Fly.io + Supabase + Temporal Cloud stack with Tailscale VPN access to customer-internal networks for browser automation
- Built Temporal.io durable workflow engine: configurable multi-step LLM agent pipelines (Claude, GPT-4o, Gemini), workflow versioning (Draft→Live→Archived) with canary traffic splits and QA sampling percentage; risk signal detection (CRITICAL/HIGH/STANDARD urgency tiers) with daily narrative signal digests; 30+ customer deployments
- Built MCP servers in Python (separate repo) and TypeScript (separate repo); Playwright browser automation for navigating customer-internal systems via Tailscale VPN; document classification with typed field extraction schemas; email ingestion via Postmark webhooks, Google Service Accounts (Gmail), and Microsoft Graph API (Outlook/Exchange); PDF generation and file storage via Tigris (S3-compatible)
- Stack: TypeScript, Node.js, Express, React, Vite, Temporal.io, PostgreSQL (Supabase), Redis, Prisma, Auth0, Fly.io, Tigris, Playwright, MCP (Python + TS), Sentry, Tailscale

### Software Developer Intern — Mphasis (HP Company) | Jun 2024 – Aug 2024
- Built 5+ AI-driven workflows including a health claim automation tool using OCR, NLP, and ML; improved claim accuracy by 25%
- Automated deployments on AWS & GCP, integrated monitoring dashboards with Grafana, supported model validation and red-teaming to enhance reliability

### AI/ML Intern — Capgemini | Jun 2023 – Aug 2023
- Led end-to-end SDLC for a data-driven system automating support ticket analysis, reducing processing time by 15%
- Implemented distributed data pipelines using Hadoop + Spark for batch processing, and integrated Kafka streaming for real-time data ingestion, reducing ticket-processing latency by 20%

---

## Projects

### Expertiza – Ruby on Rails Open Source Contribution | NC State University | 2024–2025 | [github.com/expertiza/expertiza](https://github.com/expertiza/expertiza)
- Refactored core controllers in a production Ruby on Rails codebase (5,000+ users, 300+ teams, 300+ global contributors) applying SOLID and DRY principles; extracted business logic into service layers, eliminated copy-pasted patterns across controllers
- Added 110+ RSpec tests covering happy path and edge cases across refactored controllers and APIs; increased overall code coverage by 25% and reduced code redundancy by 35%; first PR rejected for over-engineering, iterated on reviewer feedback, revised PR merged
- Stack: Ruby, Ruby on Rails, RSpec

### CortexQ – Kubernetes LLM Inference Autoscaling Platform | Independent Project | 2026 | [github.com/Aditya-k24/CortexQ](https://github.com/Aditya-k24/CortexQ)
- Built Kubernetes-native LLM inference platform: FastAPI router with 3-state circuit breaker and EWMA latency-aware load balancing across Claude, GPT-4o, and Gemini backends; KEDA autoscaler scales model pods 0 → N on Redis queue depth (scale-to-zero when idle)
- Python Kopf CRD operator (LLMDeployment) reconciles Deployments, Services, and KEDA ScaledObjects; OpenTelemetry + Prometheus + Grafana observability; Helm + ArgoCD GitOps; k6 load-tested to 500 VUs; 88 pytest tests
- Stack: Python, FastAPI, Redis, Kubernetes, KEDA, Kopf, Helm, ArgoCD, OpenTelemetry, Prometheus, Grafana, k6, Docker

### VectorLift – Semantic Search & Ranking Engine | Independent Project | 2026 | [github.com/Aditya-k24/VectorLift](https://github.com/Aditya-k24/VectorLift)
- Built a production-grade semantic search system on MS MARCO: BM25 baseline (Elasticsearch), dense bi-encoder retrieval (sentence-transformers fine-tuned with in-batch negatives on MS MARCO), and cross-encoder re-ranker (MiniLM); evaluated across 6 pipeline configurations with NDCG@10, MRR@10, MAP, and paired bootstrap significance testing
- Designed a Kafka-driven indexing pipeline for event-based corpus ingestion into Elasticsearch and Qdrant vector store; served search via FastAPI with per-stage latency tracking; visualized experiment comparisons and significance test outputs in a Streamlit dashboard
- Stack: Python, PyTorch, Sentence-Transformers, Elasticsearch, FAISS, Qdrant, Kafka, FastAPI, Streamlit, PostgreSQL, Redis, Prometheus, Grafana, Docker Compose

### LLM Eval Harness | Independent Project | 2025 | [github.com/Aditya-k24/llm-eval-harness](https://github.com/Aditya-k24/llm-eval-harness)
- Built a vendor-neutral benchmark comparing Claude Sonnet 4.6, GPT-4o, and Gemini 2.5 Pro across 3 task types (grounded QA, multi-hop QA, FEVER claim verification) on a 2,000-example frozen test set with 3 repeated runs per model
- Metrics tracked per model: ExactMatch, TokenF1, abstention accuracy, evidence-quote validity, grounded hallucination rate, p50/p95 latency, and cost/call; statistical significance via paired bootstrap CIs, McNemar test, and Holm correction
- Stack: Python, Anthropic/OpenAI/Google GenAI SDKs, DuckDB, Parquet, Streamlit, Docker

### Inventory Reservation Service | Independent Project | 2026 | [github.com/Aditya-k24/InventoryReservationService](https://github.com/Aditya-k24/InventoryReservationService)
- Built a transactional inventory reservation API in Java 21 + Spring Boot preventing overselling via PostgreSQL row-level locking (SELECT FOR UPDATE) across multi-SKU reservations; idempotent POST endpoints with RFC 9457 error responses and automated expiry via scheduled cleanup job
- Verified concurrency correctness with Testcontainers integration tests — two concurrent reservations against quantity 1 produce exactly one success and one 409 Conflict; Flyway migrations, Spring Security (role-based), multi-stage Docker build, GitHub Actions CI
- Stack: Java 21, Spring Boot 3.5, PostgreSQL, Flyway, Spring Data JPA, Spring Security, Testcontainers, Docker

### PulseRank – Real-Time Leaderboard & Activity Feed | Independent Project | 2026 | [github.com/Aditya-k24/PulseRank](https://github.com/Aditya-k24/PulseRank)
- Built an event-driven leaderboard and activity feed platform: MySQL for transactional event writes with idempotency-key deduplication and outbox pattern, MongoDB for feed document projections with TTL expiry, Redis sorted sets for sub-millisecond leaderboard reads; live score updates over Server-Sent Events
- Validated multi-store consistency with Testcontainers integration tests; benchmarked hot paths with k6; shipped observability with OpenTelemetry + Prometheus and CI/CD with GitHub Actions
- Stack: TypeScript, NestJS, Next.js, MySQL, MongoDB, Redis, Docker, GitHub Actions, OpenTelemetry, Prometheus

### AlgoPulse – Agentic AI Platform | Independent Project | 2025 | [github.com/Aditya-k24/AlgoPulse](https://github.com/Aditya-k24/AlgoPulse)
- Architected an event-driven AI orchestration platform; identified API-polling bottleneck under load and pivoted to Supabase Edge Functions streaming AI reasoning loops directly to the client
- Scaled worker architecture with Temporal.io and Kafka for state synchronization and fault tolerance — 2,000 async inference requests/second without state loss
- Stack: TypeScript, Node.js, React Native, Supabase Edge Functions, Temporal.io, Kafka

### Glance AI – Job Pipeline Chrome Extension | Independent Project | 2025 | [github.com/Aditya-k24/GlanceAI](https://github.com/Aditya-k24/GlanceAI)
- Built a Chrome extension in TypeScript connecting to Gmail (OAuth PKCE, read-only) to auto-classify job emails by hiring stage, group them per-company, and fire deadline alerts 24 hours before expiry
- Built BM25 search over email evidence; ranked results per company with per-chain scoping; no server, no ML model — all data stays in IndexedDB in the browser
- Stack: TypeScript, React 18, Vite, Chrome MV3, IndexedDB, chrono-node, BM25 (custom inverted index)

### CryptoKnight – Trustless AI Trading Agent | HackNC State | 2025 | [github.com/adityapai18/HackNCState26](https://github.com/adityapai18/HackNCState26)
- Solved the "Delegation Dilemma" in autonomous finance: built a trustless architecture using ERC-4337 Account Abstraction so an AI agent can trade Polymarket prediction markets without ever holding private keys
- Issued Session Keys with strict on-chain policies (trade limits, max allowance, expiration, instant revocation) to a Python trading agent — funds stay in self-custody smart account vault at all times
- Stack: Alchemy Account Kit (ERC-4337), Session Keys, Python agent (Sepolia), Next.js 16, viem, wagmi

### PerCent – GenAI Finance App | HackNC24 Finalist | Nov 2024 – Dec 2024
- Developed a GenAI finance app with goal tracking, expense logging, and an AI chatbot in React Native; ranked Top 10 of 100+ teams
- Designed a RAG-based chatbot with Selenium, Hugging Face, and Qwen-14B-Chat, reducing manual financial research by 30%
- Stack: React Native, Python, Hugging Face, Qwen-14B-Chat, RAG
- GitHub: github.com/adityapai18/HackNC24

### Mapify – ML & NLP Tool | IEEE Published | Feb 2022 – Nov 2022
- Built T5-transformer model pipeline that converted 1,500+ PDFs/images into mind maps and flowcharts
- Reduced academic review time by 60%; used NLTK and NetworkX for structure extraction; presented to 500+ attendees at IEEE
- GitHub: github.com/Aditya-k24/mapify

### Sanjeevani – Health App | Full Stack + ML | Jan 2023 – Aug 2023
- Developed an ML-powered app achieving 87% accuracy using real-time sensor data and classification models
- Shortlisted Top 1% (12 of 1100+) for innovation in UI and predictive health insights; built full-stack with React
- GitHub: github.com/heet214/Sanjeevani-health

### Demand Paging – Xinu OS | Systems Programming | Oct 2024 – Dec 2024
- Implemented demand paging in the Xinu OS kernel in C: 8-store virtual memory architecture, Second-Chance page replacement algorithm, inverted page tables, custom fault handler, and 7+ kernel system calls for memory allocation, deallocation, and performance monitoring
- Reduced page faults by 25% and improved overall memory performance by 15%; kernel integrates seamlessly with existing Xinu process scheduler
- Added 7+ kernel system calls, increasing memory performance by 15% using inverted page tables and a new fault handler

---

## Publications

- **Computer Vision-Based Cybersecurity Threat Detection System with GAN-Enhanced Data Augmentation** | Springer, icSoftComp 2023 | [link.springer.com/chapter/10.1007/978-3-031-53728-8_5](https://link.springer.com/chapter/10.1007/978-3-031-53728-8_5)
- **Mapify – Automated Mind Map Generation from Documents** | IEEE Published, 2022 | [github.com/Aditya-k24/mapify](https://github.com/Aditya-k24/mapify)

---

## Skills

**Languages:** Python, TypeScript, Java, JavaScript, R, SQL, NoSQL, C, Ruby  
**AI/ML:** OpenAI API, LangChain, MCP, Hugging Face, TensorFlow, PyTorch, RAG, Pandas, NumPy  
**Cloud & DevOps:** AWS, GCP, Docker, Kubernetes, CI/CD pipelines, Terraform, Grafana, Distributed Systems, Beam  
**Frameworks & Tools:** Node.js, React, React Native, Angular, MERN Stack, Temporal, Kafka, Spark, Hadoop, Tailwind, Git, Overleaf
**Mobile:** Android (Java/Kotlin), React Native; shipped hackathon apps across Android and cross-platform  

---

## Awards & Leadership

- **Lead at Google Developers Student Club:** Led 4+ tech events (hackathons, conferences) reaching 500+ students
- **National Hackathon Winner:** Won or ranked Top 10 in 6+ national hackathons; developed 3 complete MVPs within 48-hour builds
