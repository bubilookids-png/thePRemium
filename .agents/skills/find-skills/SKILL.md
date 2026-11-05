---
name: find-skills
description: Helps users discover, evaluate, and install agent skills using the skills CLI (npx skills) and skills.sh directory. Use when the user asks for a skill, capability, or how to do something with skills.
---

# Find Skills — Discover and Install Agent Skills

`find-skills` is a meta-skill (by Vercel Labs / skills.sh) that allows AI agents to search for, inspect, and install new skills dynamically when required.

## When to Use
- User asks: "Find a skill for X", "Is there a skill that can...", or wants to extend agent abilities.
- A task requires specialized instructions or tooling that is not currently available locally.

## CLI Commands

### 1. Search for Skills
```bash
npx skills find <query>
```
Searches the `skills.sh` registry for matching skills.

### 2. View Skill Details
```bash
npx skills view <owner/repo@skill-name>
```

### 3. Install a Skill
```bash
npx skills add <owner/repo>
```
Or for a specific sub-skill:
```bash
npx skills add <owner/repo> --skill <skill-name>
```
