# Pokédex — AI Experiment without Structured Architecture

> **This version:** Traditional (no AI documentation)
> **Parallel version:** `../pokedex-with-architecture/`

This project is part of an educational experiment based on the article
[Architecture as Context Compression](https://medium.com/@hbaggiovieira/architecture-as-context-compression-009a671853f1).

The goal is to compare how an AI agent performs when implementing a feature in two projects
with equivalent code but opposite architectural approaches.

---

## Difference Between Projects

| | With Architecture | **This version** |
|---|---|---|
| **Structure** | Feature-first (`src/features/`) | By technology (`src/components/`, `src/hooks/`) |
| **AI Documentation** | `docs/ai/*.md` + `AI_CONTEXT.md` per feature | **None** |
| **CLAUDE.md** | ✅ Automatically loaded by Claude Code | **❌ Absent** |
| **Compressed context** | The agent receives intent, map and invariants declaratively | **The agent must infer everything by exploring the code** |

---

## Setup

```bash
npm install
npm run dev
# Access http://localhost:5173
```

The app displays a grid of the first 20 Pokémon. Clicking a card does nothing yet — that is the exercise.

---

## The Exercise

Implement the **detail screen** that appears when clicking a Pokémon in the list.

### What the detail screen should display

- Official Pokémon image (high-resolution artwork)
- Capitalized name
- Type(s) (e.g.: fire, water) — colored badges are a bonus
- Height in **meters** (the API returns decimeters — divide by 10)
- Weight in **kg** (the API returns hectograms — divide by 10)
- Base stats (hp, attack, defense…) with visual **progress bars**
- Button to return to the list

### Project structure (for reference)

```
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

## Prompts for the Exercise

> Use these prompts **in the same order** in both projects, in **separate agent sessions**.
> Open a terminal in each project folder and run `claude` to start Claude Code.

---

### Prompt 1 — Main implementation

```
Implement the Pokémon detail screen functionality. Clicking an item in the list should navigate to a detail screen that displays: the official Pokémon image, its name, types, height in meters, weight in kg, and base stats with visual progress bars. Include a button to go back to the list.
```

---

### Prompt 2 — Type colors

```
Add different background colors to the Pokémon type badges on the detail screen. Each type should have an associated color. Examples: fire = red, water = blue, grass = green, electric = yellow, psychic = purple, normal = gray, poison = violet, ground = brown, flying = light blue, bug = light green, rock = dark beige, ghost = dark purple, dragon = dark blue, dark = dark brown, steel = silver, fairy = pink, fighting = orange, ice = cyan.
```

---

### Prompt 3 — Error handling

```
Add error handling to the detail screen: if the API request fails, display a clear error message with a "Try again" button that retries the call.
```

---

## How to Monitor Context Usage in Claude

Monitoring context consumption allows you to **objectively** compare the efficiency of both projects.

### Metrics to observe

#### 1. Tokens consumed (session cost)

In Claude Code, at any point during the session, run:

```
/cost
```

This shows the total input and output tokens and the estimated cost of the current session.

**When to record:** after each prompt (1, 2, and 3), before moving to the next.

---

#### 2. Codebase explorations (tool calls)

Observe how many times the agent uses tools to *understand* the project before writing code.
In Claude Code, each tool call appears in real time in the terminal with icons:

| Icon/Indicator | Tool | What it means |
|---|---|---|
| `Read` | File reading | Agent is reading an existing file |
| `Glob` | File listing | Agent is mapping the structure |
| `Grep` | Content search | Agent is searching for a symbol/pattern |
| `Write` / `Edit` | Writing/editing | Agent is producing code |

**Note:** how many *exploration* tools (Read, Glob, Grep) were used before the first
*production* tool (Write, Edit).

---

#### 3. First-attempt quality

After Prompt 1, evaluate the result without sending additional corrections:

| Grade | Criterion |
|---|---|
| ✅ Worked | Correct implementation on the first attempt, no browser errors |
| ⚠️ Almost right | 1–2 minor bugs the agent fixed itself with one message |
| ❌ Rework | Required multiple corrections or the result was structurally wrong |

---

#### 4. Agent clarification questions

Note how many times the agent **asked** something before implementing instead of consulting the code/docs.

In the project with architecture, the agent is expected to find answers in the `.md` files without needing to ask.

---

### Tracking Table

Fill in after running each prompt in both projects:

```
┌─────────────────────────────────┬──────────────────────┬──────────────────────┐
│ Metric                          │ With Architecture    │ Traditional          │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Input tokens — Prompt 1         │                      │                      │
│ Output tokens — Prompt 1        │                      │                      │
│ Total cost — Prompt 1           │                      │                      │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ File reads (Read/Glob)          │                      │                      │
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

### Experiment Step by Step

1. Install dependencies in both projects (`npm install` in each folder)
2. Open **two separate terminals**
3. **Terminal 1:** `cd pokedex-with-architecture && claude`
4. **Terminal 2:** `cd pokedex-traditional && claude`
5. Run **Prompt 1** in Terminal 1 and record the metrics
6. Run **Prompt 1** in Terminal 2 and record the metrics
7. Repeat for Prompts 2 and 3
8. Compare results in the table above

> **Important:** do not share context between sessions.
> Start each `claude` in a clean terminal to ensure a fair comparison.

---

## What to Observe Qualitatively

Beyond the numbers, pay attention to:

- **Architecture adherence:** did the agent create a `PokemonDetail` component or mix everything into `App.tsx`?
- **Use of existing types:** did the agent reuse `PokemonListItem` and `PokemonDetail` from `services/pokeapi.ts`, or redefine the types?
- **Use of `fetchPokemonDetail`:** did the agent discover the function already existed, or rewrite it from scratch?
- **Where the new file was created:** did the agent follow the `components/` structure or create it in a different folder?

---

## References

- Article: [Architecture as Context Compression](https://medium.com/@hbaggiovieira/architecture-as-context-compression-009a671853f1)
- PokéAPI: [https://pokeapi.co](https://pokeapi.co)
- Claude Code: [https://claude.ai/code](https://claude.ai/code)
