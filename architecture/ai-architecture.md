# 🤖 AI & Multi-Agent Architecture — Life OS

**Document Version:** 1.0.0  
**Status:** Approved  

---

## 1. AI Layer Topology

```text
                               AI ASSISTANT / ORCHESTRATOR
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
   PLANNER AGENT                    KNOWLEDGE AGENT                   FINANCE AGENT
  (Projects Breakdown)             (Notes & Tagging)                (Ledger Summaries)
         │                                 │                                 │
         └─────────────────────────────────┼─────────────────────────────────┘
                                           ▼
                              HYBRID AI PROVIDER GATEWAY
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             LOCAL LLM (Ollama / vLLM)             CLOUD AI (Gemini / OpenAI)
             (Privacy-sensitive ops)               (Heavy reasoning & planning)
                                           │
                                           ▼
                                    LIFE OS APIS
```

1. **Context-Aware Assistant:** Queries the **Life Graph** to answer user questions across PARA buckets.
2. **Multi-Agent Swarm:** Domain-specialized agents operating strictly via authenticated system APIs (Planner, Knowledge, Finance agents).
3. **Hybrid AI Provider Gateway:** Configurable gateway allowing seamless switching between local private models (Ollama) and high-tier cloud LLMs (Google Gemini / OpenAI).
