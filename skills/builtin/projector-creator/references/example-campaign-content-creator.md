# Example: Campaign Content Creator (Agent-Driven Pattern)

This example shows the **content-generator pattern** — no HTML sandbox, no browser widget.
The agent uses its tools directly: web search, image search, directory creation, file download.

Use this pattern when the projector's job is to **produce files the user keeps** (graphics, posts, reports),
not to render an interactive UI.

---

## What the Finished Skill Does

User says: *"Create social media content for our youth literacy campaign"*

Agent:
1. `web_search` — find facts, statistics, and messaging angles
2. `web_search` (image search) — find relevant free-use graphics
3. `shell` / `file-io` — create output directory `/workspace/Output/campaigns/<slug>/`
4. `file-io: download` — save selected images into that directory
5. `file-io: write` — write social media copy, captions, and a brief summary file

---

## SKILL.md Frontmatter Template

```yaml
---
name: create-campaign-content
description: >
  Create campaign social media content and graphic assets. Use when the user wants
  to generate campaign materials, social media posts, promotional graphics, or
  awareness content for a cause, event, service, or community.
version: 1.0.0
tags: [content, social-media, campaigns, graphics]
---
```

> **Description tip:** the description must name the trigger phrases ("social media content",
> "campaign materials", "promotional graphics"). The agent reads only this field to decide
> whether to load the skill — if it doesn't match, the skill never fires.

---

## Complete Workflow (copy this into the SKILL.md body)

```markdown
## Workflow

### 1 — Clarify (one message only)
If the user has not provided a campaign name, cause, target audience, or platform
(Instagram / Facebook / WhatsApp), ask in a single message. Never ask more than once.

### 2 — Research with web_search
Search for:
- Key facts and statistics about the cause (embed top 3 in the copy)
- Current messaging angles used by similar campaigns
- Hashtags in active use

tool call:
  web_search("youth literacy statistics sub-saharan africa 2024 site:unicef.org OR site:worldbank.org")

### 3 — Find Graphics with web_search (images)
Search for royalty-free images. Prefer Unsplash, Pexels, Wikimedia Commons.

tool call:
  web_search("site:unsplash.com youth reading education africa")
  web_search("site:commons.wikimedia.org youth literacy campaign poster")

Select 2–4 images. Record direct download URLs.

### 4 — Create Output Directory
Slugify the campaign name (lowercase, hyphens). Create the directory.

tool call:
  shell("mkdir -p /workspace/Output/campaigns/youth-literacy-2024")

### 5 — Download Images
Download each selected image into the campaign directory.

tool call:
  file_download(url="https://...", path="/workspace/Output/campaigns/youth-literacy-2024/photo-01.jpg")

Always verify the download succeeded before moving on.

### 6 — Generate Social Media Copy
Write platform-specific copy for each piece of content. Save as a single text file.

Format for each post:
  Platform: Instagram
  Image: photo-01.jpg
  Caption: ...
  Hashtags: #YouthLiteracy #Education #ReadToSucceed
  CTA: Link in bio → [landing page]

tool call:
  write_file("/workspace/Output/campaigns/youth-literacy-2024/posts.txt", <content>)

### 7 — Write Summary
Create a brief README-style file listing all assets generated.

tool call:
  write_file("/workspace/Output/campaigns/youth-literacy-2024/README.txt", <content>)

### 8 — Report to User
"Your campaign pack for **Youth Literacy 2024** is ready in
`/workspace/Output/campaigns/youth-literacy-2024/`. It includes:
- 3 photos ready for social media
- Instagram, Facebook, and WhatsApp captions in `posts.txt`
- Hashtag set and CTA suggestions"
```

---

## Key Rules for This Pattern

| Rule | Why |
|------|-----|
| Always create the output directory before downloading | Downloads fail silently if the path doesn't exist |
| Verify each download before referencing the file | A 403 or redirect produces an empty/corrupt file |
| Embed fetched facts in the copy, not just as links | The user wants ready-to-post content, not a reading list |
| Use slugified directory names | Spaces in paths break shell commands |
| One `posts.txt` per campaign, not one file per post | Easier for the user to copy-paste from a single file |

---

## Directory Structure Produced

```
/workspace/Output/campaigns/youth-literacy-2024/
├── photo-01.jpg
├── photo-02.jpg
├── photo-03.jpg
├── posts.txt          ← all captions, hashtags, CTAs
└── README.txt         ← asset list and usage notes
```

---

## Contrast With the HTML Widget Pattern

| | HTML Widget (fundraising tracker) | Content Generator (this example) |
|---|---|---|
| Output | A single `index.html` the user opens | A folder of files the user keeps/publishes |
| Tools used | `write_file`, `edit_file` | `web_search`, `file_download`, `shell`, `write_file` |
| Network access | None (sandbox) | Full (agent runs outside sandbox) |
| Best for | Calculators, trackers, converters | Social media packs, reports, graphics downloads |
