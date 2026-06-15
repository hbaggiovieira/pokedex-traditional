Pokédex — AI Experiment Without Structured Architecture
> **This version:** Traditional, without AI-oriented documentation  
> **Parallel version:** `../pokedex-with-architecture/`
This project is part of an educational experiment based on the article Architecture as Context Compression.
The goal is to compare how an AI agent performs when implementing a feature in two projects with equivalent code, but opposite architectural approaches.
---
Difference Between the Projects
	Project with Architecture	This version
Structure	Feature-first (`src/features/`)	By technology (`src/components/`, `src/hooks/`)
AI documentation	`docs/ai/*.md` + `AI_CONTEXT.md` per feature	None
CLAUDE.md	✅ Automatically loaded by Claude Code	❌ Missing
Compressed context	The agent receives intent, map, and invariants declaratively	The agent must infer everything by exploring the code
---
Setup
```bash
npm install
npm run dev
# Open http://localhost:5173
```
The app displays a grid with the first 20 Pokémon. Clicking a card does nothing yet — that is the exercise.
---
The Exercise
Implement the details screen that appears when clicking a Pokémon in the list.
What should be displayed on the details screen
Official Pokémon image, high-resolution artwork
Capitalized name
Type(s), such as fire or water — colored badges are a bonus
Height in meters — the API returns decimeters, so divide by 10
Weight in kg — the API returns hectograms, so divide by 10
Base stats, such as hp, attack, defense, with visual progress bars
Button to return to the list
Project structure, for reference
```text
src/
├── components/
│   ├── PokemonList.tsx   ← list component
│   └── PokemonList.css
├── hooks/
│   └── usePokemonList.ts ← list hook
├── services/
│   └── pokeapi.ts        ← PokéAPI calls
├── App.tsx
└── main.tsx
```
---
Prompts for the Exercise
> Use these prompts **in the same order** in both projects, in **separate agent sessions**.  
> Open a terminal in each project folder and run `claude` to start Claude Code.
---
Prompt 1 — Main implementation
```text
Implement the Pokémon details screen functionality. When clicking an item in the list, it should navigate to a details screen that displays: the Pokémon’s official image, name, types, height in meters, weight in kg, and base stats with visual progress bars. Include a button to return to the list.
```
---
Prompt 2 — Type colors
```text
Add different background colors to the Pokémon type badges on the details screen. Each type should have an associated color. Examples: fire = red, water = blue, grass = green, electric = yellow, psychic = purple, normal = gray, poison = violet, ground = brown, flying = light blue, bug = light green, rock = dark beige, ghost = dark purple, dragon = dark blue, dark = dark brown, steel = silver, fairy = pink, fighting = orange, ice = cyan.
```
---
Prompt 3 — Error handling
```text
Add error handling to the details screen: if the API request fails, display a clear error message with a “Try again” button that retries the call.
```
---
How to Monitor Context Usage in Claude
Monitoring context usage allows you to compare the efficiency of both projects more objectively.
Metrics to observe
1. Tokens consumed, session cost
In Claude Code, at any point during the session, run:
```text
/cost
```
This displays the total input and output tokens, as well as the estimated cost of the current session.
When to record it: after each prompt, before moving to the next one.
---
2. Codebase exploration, tool calls
Observe how many times the agent uses tools to understand the project before writing code.
In Claude Code, each tool call appears in real time in the terminal with indicators such as:
Indicator	Tool	What it means
`Read`	File reading	The agent is reading an existing file
`Glob`	File listing	The agent is mapping the structure
`Grep`	Content search	The agent is searching for a symbol or pattern
`Write` / `Edit`	Writing/editing	The agent is producing code
Record: how many exploration tools (`Read`, `Glob`, `Grep`) were used before the first production tool (`Write`, `Edit`).
---
3. First-attempt quality
After Prompt 1, evaluate the result without sending additional corrections:
Score	Criterion
✅ Worked	Correct implementation on the first attempt, with no browser errors
⚠️ Almost right	1–2 minor bugs that the agent fixed after one message
❌ Rework	Required multiple corrections or the result was structurally wrong
---
4. Clarifying questions from the agent
Record how many times the agent asked something before implementing instead of consulting the code or documentation.
In the project with architecture, the expectation is that the agent finds the answers in the `.md` files without needing to ask.
---
Recording Table
Fill this in after running each prompt in both projects:
```text
┌─────────────────────────────────┬──────────────────────┬──────────────────────┐
│ Metric                          │ With Architecture    │ Traditional          │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Input tokens — Prompt 1         │                      │                      │
│ Output tokens — Prompt 1        │                      │                      │
│ Total cost — Prompt 1           │                      │                      │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ File reads/listing (Read/Glob)  │                      │                      │
│ Searches (Grep)                 │                      │                      │
│ Explorations before writing     │                      │                      │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ First-attempt quality           │ ✅ / ⚠️ / ❌          │ ✅ / ⚠️ / ❌          │
│ Questions asked by the agent    │                      │                      │
│ Followed project structure      │ Yes / No             │ Yes / No             │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Total cost — full session       │                      │                      │
└─────────────────────────────────┴──────────────────────┴──────────────────────┘
```
---
Experiment Step by Step
Install dependencies in both projects with `npm install` in each folder.
Open two separate terminals.
Terminal 1: `cd pokedex-with-architecture && claude`
Terminal 2: `cd pokedex-traditional && claude`
Run Prompt 1 in Terminal 1 and record the metrics.
Run Prompt 1 in Terminal 2 and record the metrics.
Repeat the same process for Prompts 2 and 3.
Compare the results using the table above.
> **Important:** do not share context between sessions.  
> Start each `claude` session in a clean terminal to ensure a fair comparison.
---
What to Observe Qualitatively
Beyond the numbers, pay attention to:
Architecture adherence: did the agent create a `PokemonDetail` component or mix everything into `App.tsx`?
Use of existing types: did the agent reuse `PokemonListItem` and `PokemonDetail` from `services/pokeapi.ts`, or redefine the types?
Use of `fetchPokemonDetail`: did the agent discover that the function already existed, or rewrite it from scratch?
Where the new file was created: did the agent follow the `components/` structure, or create files somewhere else?
---
References
Article: Architecture as Context Compression
PokéAPI: https://pokeapi.co
Claude Code: https://claude.ai/code
