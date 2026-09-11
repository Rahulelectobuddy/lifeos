# 🔍 Search Engine Architecture — Life OS

**Document Version:** 1.0.0  
**Status:** Approved  

---

## 1. Multi-Tier Search Architecture

1. **Tier 1: Structured Search:** Filter by workspace, PARA category (`category:project`, `category:resource`), status, and date bounds.
2. **Tier 2: Full-Text Search (FTS):** PostgreSQL GIN / OpenSearch trigram full-text indexing across note contents, task titles, OCR documents, and chat messages ($< 250\text{ ms}$ SLA).
3. **Tier 3: Semantic RAG Search (Phase 3):** Vector embedding index (e.g. pgvector / Qdrant) powering natural language semantic queries (*"find setup notes for homelab GPU"*).
