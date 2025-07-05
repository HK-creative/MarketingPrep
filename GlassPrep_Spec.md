
# Interview Prep Mini‑Games Web App – Technical Specification  
**Internal Code‑Name:** *“GlassPrep”*  
**Target Delivery:** ASAP (night before interview)  
**Primary User:** *Yuval (single authenticated user)*  

---

## 1. Purpose  
Build a **single‑user web application** containing a suite of *mini‑games* that drill marketing interview skills specific to the **Digital Marketing Execution Specialist** role at **Agilite**.  
The focus is *hands‑on practice & rapid feedback*; no community or multi‑user features are required.

---

## 2. Functional Requirements  

### 2.1 Global
| ID | Requirement | Notes |
|----|-------------|-------|
| F‑01 | All content must load locally (no external APIs) to guarantee offline access on laptop. | Use JSON/LocalStorage. |
| F‑02 | Persist user scores & streaks in *browser LocalStorage*. | No backend DB needed. |
| F‑03 | Single sign‑in gate (PIN or passphrase) to hide content from prying eyes. | Hard‑code in env. |
| F‑04 | Responsive layout (mobile & desktop). | Flexbox / CSS Grid. |
| F‑05 | Dark‑mode toggle (optional stretch). | Derived colors. |

### 2.2 Game Modules  
Each module lives under `/game/<slug>` and returns to **Dashboard** on completion.

| Module | Goal | Core Loop | Win Condition | Timer? | Key Metrics Stored |
|--------|------|-----------|---------------|--------|--------------------|
| **Quick‑Fire Quiz** | Recall factual know‑how. | Show MCQ → user picks answer → instant feedback. | ≥80 % correct over 10 questions. | 8 s/question. | correct, wrong, avg response time |
| **Flashcards** | Memorize terms/definitions. | Flip card → self‑report “Got it / Missed”. | 2 full cycles with 90 % “Got it”. | None | attempts per term |
| **Case Builder** | Practice structured thinking. | Prompt shows scenario → textarea answer → user self‑grades 1‑5. | Self‑graded ≥4 three times. | 5 min soft timer | self‑scores |
| **Matching Matrix** | Cement metric ↔ description pairs. | Drag metric tile to matching definition slot. | 100 % match within 3 min. | 3 min total | completion time |
| **Acronym Sprint** | Recall acronyms fast (CTR, ROAS…). | Random acronym → input expansion. | 15 correct in 90 s. | 90 s | streak, hits |

> **Data Source:** `data/questions.json`, `data/flashcards.json`, etc. Schema examples in §6.

### 2.3 Dashboard  
* `/` route.  
* Cards for each module: status (✅/❌), personal best, “Play” button.  
* Progress ring showing overall readiness percentage (avg of module scores).  

### 2.4 Settings  
* Change PIN  
* Reset progress  
* Toggle dark‑mode  

---

## 3. Non‑Functional Requirements  

| Category | Spec |
|----------|------|
| Performance | FCP < 1.5 s on desktop; bundle ≤ 300 kB gzip (tree‑shaking, code‑splitting). |
| Security | No sensitive data stored; PIN hashed with SHA‑256 & stored in LocalStorage. |
| Accessibility | WCAG 2.1 AA; keyboard‑navigable games; aria‑labels on glassmorphic containers. |
| Browser Support | Chromium‑based + Firefox (latest). |

---

## 4. Tech Guidelines  

* **Frontend Framework:** Dev may choose React (vite), Svelte, or plain TS.  
* **State Management:** Context/Store or lightweight signals.  
* **Styling:** TailwindCSS *with custom glassmorphism utilities* **OR** vanilla CSS modules.  
* **Build & Deploy:** Static export → `dist/` → drag‑and‑drop to Netlify/Vercel.  

#### 4.1 Glassmorphism Tokens  
| Variable | Value (reference) |
|----------|------------------|
| `--glass‑bg` | rgba(255,255,255,0.08) |
| `--glass‑blur` | 14px |
| `--glass‑border` | 1px solid rgba(255,255,255,0.3) |
| `--radius` | 16px |

Apply via:  
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
  border-radius: var(--radius);
}
```

---

## 5. UI / UX Blueprint  

### 5.1 Pages & Routes  
1. `/login` – PIN gate (numeric keypad UI).  
2. `/` – Dashboard.  
3. `/game/quiz`  
4. `/game/flashcards`  
5. `/game/case`  
6. `/game/matching`  
7. `/game/acronym`  
8. `/settings`

### 5.2 Layout  
* Full‑width **frosted glass cards** over subtle blurred background image (SVG noise + gradient).  
* Minimal typography: **Inter** / **Alef** (Hebrew fallback).  
* Accent color `#00BFA6` for progress rings & CTA buttons.

### 5.3 Micro‑interactions  
* Card hover: scale 1.03, shadow‑glow.  
* Confetti burst (CSS) on module completion.  
* Timer rings animate with SVG stroke‑dasharray.

---

## 6. Data Schemas & Samples  

### 6.1 Multiple‑Choice Question
```json
{
  "id": "q_meta_01",
  "prompt": "Which metric indicates ad relevance in Meta Ads?",
  "options": ["CTR", "ROAS", "Quality Ranking", "Frequency"],
  "answerIndex": 2,
  "explanation": "Meta's Quality Ranking compares your ad's perceived quality ..."
}
```

### 6.2 Flashcard
```json
{
  "id": "fc_term_seo",
  "term": "Alt Text",
  "definition": "HTML attribute describing an image for accessibility & SEO."
}
```

### 6.3 Matching Pair
```json
{
  "metric": "CPM",
  "definition": "Cost per 1,000 impressions"
}
```

Store arrays in `/data/*.json`, lazy‑load per module.

---

## 7. Game Logic Algorithms (Pseudo)

* **Quiz:**  
  1. Shuffle questions.  
  2. Start 8‑second countdown per question; auto‑advance on timeout (counts as wrong).  
  3. Save result `{ id, correct, timeMs }` to LocalStorage array.

* **Matching:**  
  – Drag API or library of choice; on drop check if pair valid; grey‑out matched tiles.

* **Acronym Sprint:**  
  – Maintain `remaining[]`; random `current`; listen to `Enter`; compare `input.trim().toUpperCase()`.

---

## 8. Progress Calculation  
```
moduleScore = (userHighScore / winThreshold) capped 100
overall = average(moduleScore[])
```

Render circular progress with SVG.

---

## 9. Build Steps Checklist  

1. `pnpm create vite glassprep --template react-ts`  
2. Install Tailwind & configure glass utilities.  
3. Scaffold routes with **React Router**.  
4. Implement `useLocalStorage` hook for persistence.  
5. Drop sample JSON under `src/data/`.  
6. Deploy `vite build` → Netlify site.  

---

## 10. Stretch Enhancements (Ignore if time‑boxed)  
* Voice‑to‑text answer option in Case Builder.  
* Import additional question packs via drag‑and‑drop JSON.  
* Export performance summary PDF.

---

**End of Spec – Good luck & ship fast!**
