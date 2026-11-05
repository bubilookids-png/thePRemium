---
name: obscura
description: Use Obscura headless browser and built-in MCP/CDP server for ultra-fast, lightweight web scraping, stealth browser automation, and JS execution without Chromium bloat.
---

# Obscura — Ultra-fast Headless Browser & MCP for AI Agents

**Obscura** (`h4ckf0r0day/obscura` / `obscura.sh`) is a lightweight headless browser engine built in Rust with Google V8 DOM evaluation. It uses ~30 MB RAM (instead of Chrome's 500MB+) and starts in under 100ms.

## When to Use
- Web scraping protected or modern JS-heavy sites without heavy Chromium overhead.
- AI agent browser automation via CDP or native MCP server.
- Anti-detection tasks (masks `navigator.webdriver`, randomizes canvas/GPU fingerprints, blocks trackers).

## Running Obscura

### 1. As an MCP Server for Antigravity / Agents
```bash
obscura mcp --http --port 8080
# Endpoint: http://127.0.0.1:8080/mcp
```

### 2. As a CDP (Chrome DevTools Protocol) Drop-in
Connect Puppeteer, Playwright, or Agent-browser directly:
```bash
obscura serve --port 9222
```

### 3. CLI Direct Scraping
```bash
obscura scrape "https://example.com" --wait-for selector
obscura snapshot "https://example.com" --output screenshot.png
```

## Binary Setup (Windows)
Pre-compiled Windows binaries can be downloaded from the official repository release:
`https://github.com/h4ckf0r0day/obscura/releases`
Place `obscura.exe` and `obscura-worker.exe` in `PATH` or invoke directly.
