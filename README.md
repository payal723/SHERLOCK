# SHERLOCK 🔍 — AI Crime Scene Investigator

> Built for **WeMakeDevs: "The Hangover Part AI" Hackathon**

## The Problem

Detectives and investigators spend most of their time organizing evidence and connecting scattered facts, and only a fraction of that time actually solving cases. Traditional case management tools are:

- ❌ Static document storage with no relationship mapping
- ❌ Unable to surface contradictions across witness statements
- ❌ Siloed evidence that doesn't connect the dots
- ❌ Prone to human error and oversight

## The Solution

**SHERLOCK** is an AI-powered crime investigation platform that turns raw case evidence — witness statements, forensic reports, CCTV logs, phone records — into a connected knowledge graph, and lets investigators ask natural-language questions about the case.

### What Makes SHERLOCK Different

🧠 **Evidence Knowledge Graph** — every piece of evidence, person, location, and object becomes a node with mapped relationships, instead of a flat list of documents.

🔍 **Multi-Hop AI Reasoning** — ask "Who was last with the victim?" and SHERLOCK reasons across the evidence graph (phone records → physical evidence → witness statements) and returns a full reasoning path, not just a one-line answer.

⚡ **Contradiction Detection** — the AI cross-references witness statements, timestamps, and forensic data to surface conflicting claims and suggest follow-up questions.

🎯 **Confidence Scoring** — every AI-generated answer comes with a confidence score grounded in the actual evidence available, not a fixed number.

### Sample Cold Case: "The Vegas Mystery"

The demo comes pre-loaded with a complete cold case for investigation:

- **Victim**: John Doe, 34-year-old software engineer
- **Location**: Grand Vista Hotel, Las Vegas — Penthouse Suite 1502
- **Evidence**: 12 items (CCTV, phone records, witness statements, forensic reports)
- **Entities**: 18 (suspects, witnesses, locations, objects)
- **Relationships**: 19 connections mapped in the knowledge graph
- **Contradictions**: 3 critical conflicts flagged for investigator review

### Demo Queries to Try

1. "Who was the last person to see the victim?"
2. "What connects Mike Ross to the crime scene?"
3. "Find contradictions in witness statements"
4. "What's the murder weapon and where did it come from?"
5. "Who are the primary suspects and what's the evidence?"

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + TypeScript + Tailwind CSS |
| **Backend** | Hono + tRPC |
| **Database / ORM** | MySQL + Drizzle ORM |
| **AI** | Google Gemini API (evidence-grounded reasoning, contradiction detection, confidence scoring) |
| **Storage** | AWS S3 |
| **Deployment** | Vercel |

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     SHERLOCK PLATFORM                     │
├──────────────────────────────────────────────────────────┤
│                                                            │
│   React + Vite Frontend  ──tRPC──►  Hono Backend          │
│                                         │                  │
│                                         ▼                  │
│                                  Drizzle ORM + MySQL       │
│                                         │                  │
│                                         ▼                  │
│                          Evidence / Entities / Relations   │
│                          / Contradictions (per case)       │
│                                         │                  │
│                                         ▼                  │
│                              Gemini AI reasoning layer     │
│                    (grounded strictly in stored evidence)  │
│                                                             │
└─────────────────────────────────────────────────────────┘
```

Each investigation query pulls the case's real evidence, entities, relationships, and known contradictions from MySQL, builds a grounded context, and sends it to Gemini — which returns an answer, a reasoning path, an evidence chain, and a confidence score, all stored back against the case.

## Key Features

### 🔗 Interactive Knowledge Graph
Entities as color-coded nodes (people, locations, objects), relationships as labeled directed edges, draggable/zoomable layout, click-through to connected evidence.

### 📝 Evidence Management
Type filtering (CCTV, witness statements, forensic reports, digital, physical), per-item confidence scoring, full-text search.

### 🤖 AI Investigation Queries
Natural-language questions, multi-hop reasoning paths, confidence scores, evidence chains linking back to source material.

### ⚠️ Contradiction Detection
Cross-references evidence for conflicts, flags severity, suggests follow-up questions.

### 📅 Timeline View
Chronological evidence flow, color-coded by type, time-based grouping.

## Setup & Installation

### Prerequisites
- Node.js 20+
- MySQL database

### Quick Start

```bash
# Clone the repository
git clone https://github.com/payal723/SHERLOCK.git
cd SHERLOCK

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and Gemini API key

# Push database schema
npm run db:push

# Seed demo data
npx tsx db/seed.ts

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:port/db

# AI
GEMINI_API_KEY=your-gemini-api-key
```

## Future Roadmap

- [ ] Real-time CCTV analysis with computer vision
- [ ] Voice command interface for hands-free investigation
- [ ] Inter-agency secure case sharing
- [ ] Predictive crime pattern analysis
- [ ] Mobile-friendly investigator view

## Author

Built by **Payal** — full-stack developer (MERN / Next.js).
GitHub: [@payal723](https://github.com/payal723)

## License

MIT License — feel free to use for law enforcement, research, or education.