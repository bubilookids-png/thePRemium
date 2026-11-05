---
name: graphify
description: Eliminates redundant codebase scanning and re-reading. Uses pre-indexed architectural knowledge graphs (like ARCHITECTURE_GRAPH.md) to instantly pinpoint target files and execute edits with zero token waste.
---

# Graphify — Codebase Indexing & Redundant Read Prevention

Graphify prevents the assistant from scanning entire repositories or making repetitive `read_file` or `grep` sweeps on familiar projects.

## Core Rules for 1startup
1. **Never Re-Scan:** Do not list or inspect entire directories.
2. **Consult Graph First:** Read `ARCHITECTURE_GRAPH.md` once or rely on memory.
3. **Pinpoint Navigation:**
   - UI / Components ➔ `client/src/components/<Target>.tsx`
   - Styles / Layout ➔ `client/src/styles.css` or Tailwind config
   - API / Backend ➔ `server/routes/` or `server/services/`
   - DB / Schema ➔ `server/db/`
4. **Direct Precision Edits:** Jump directly to the exact target file and apply the minimal needed changes.
