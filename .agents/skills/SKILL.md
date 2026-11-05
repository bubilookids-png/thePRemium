---
name: agent-reach
description: Multi-platform social and open web retrieval layer for AI agents. Fetch, read, and inspect content from Twitter/X, Reddit, YouTube, GitHub, RSS, and web pages without paid APIs.
---

# Agent-Reach — Internet Capability Layer for AI Agents

**Agent-Reach** (`Panniantong/Agent-Reach`) empowers AI agents to seamlessly read, search, and parse content from 14+ public platforms and the open web without expensive API tokens.

## Built-in Channels (Zero Configuration Needed)
- **Web Pages:** Reads any URL in clean Markdown via Jina Reader:
  ```bash
  curl -s "https://r.jina.ai/<TARGET_URL>"
  ```
- **YouTube:** Video metadata, transcripts, and subtitles via `yt-dlp`:
  ```bash
  yt-dlp --skip-download --write-auto-sub --sub-lang en "https://www.youtube.com/watch?v=..."
  ```
- **GitHub:** Public repos, issues, pull requests, releases via `gh` CLI.
- **RSS Feeds:** Parse blogs, updates, and news via `feedparser`.

## Configured Channels (Session Cookies / Local Logins)
- **Twitter / X:** Search tweets, profiles, and threads.
- **Reddit:** Subreddit posts, top comments, discussions.
- **Bilibili / XiaoHongShu:** Multimedia posts and transcripts.

## CLI Usage
```bash
agent-reach read <url>
agent-reach <channel> search "<query>"
agent-reach channels
agent-reach doctor
```
