# 🏛️ ContraBoard (Devil's Advocate Boardroom)

> **Adversarial AI Decision & Architecture Stress-Tester**
> A virtual executive boardroom where your proposals, RFCs, and startup pitches face a gauntlet of ruthless specialized AI critics before you spend money or write code.

---

## ⚡ Live Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Build for production
npm run build
```

Local URL: **http://127.0.0.1:5173**

---

## 🎨 Frontend Architecture

The frontend is built with:
- **React 19 & TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (icons)
- **Web Audio API** (tactile sound synthesis for gavel strikes and voice pings)
- **Canvas Confetti** (celebration trigger for passing scores)

### Component Hierarchy:
- `src/components/Navbar.tsx` — Executive header with sound toggle, proposal selector, and report action
- `src/components/TensionMeter.tsx` — Real-time hostility & skepticism gauge (0–100%)
- `src/components/BoardroomTable.tsx` — Visual conference seating with speaking animations & skepticism gauges
- `src/components/HearingFeed.tsx` — Live transcript feed with crossfire callouts
- `src/components/HotSeatConsole.tsx` — The interactive defense dock with tactical counter-argument chips
- `src/components/ProposalDrawer.tsx` — RFC selector with 4 curated presets + custom RFC builder
- `src/components/PreMortemModal.tsx` — Executive Pre-Mortem report with 4-axis risk matrix & markdown export

---

## 🔌 Backend Integration Guide (For Team Member #2)

The frontend contains an abstracted API layer in [`src/services/api.ts`](file:///c:/Users/Nagap/Documents/antigravity/adventurous-mendel/src/services/api.ts).

Currently, **`USE_MOCK_ENGINE = true`**, allowing the frontend to run completely standalone with full interactivity, realistic dialogue, and scoring.

### To plug in your real Node.js / FastAPI backend:
1. Open [`src/services/api.ts`](file:///c:/Users/Nagap/Documents/antigravity/adventurous-mendel/src/services/api.ts#L4)
2. Change `export const USE_MOCK_ENGINE = false;`
3. Set your backend URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Expected Endpoints:
- `POST /api/board/session` — `{ proposal, personas }` ➡️ `{ sessionId }`
- `GET /api/board/round/1` ➡️ `HearingMessage[]`
- `GET /api/board/round/2` ➡️ `HearingMessage[]`
- `POST /api/board/defend` — `{ defenseText, targetPersonaId }` ➡️ `{ rebuttalMessage, updatedPersonas, overallTensionChange }`
- `GET /api/board/pre-mortem` ➡️ `PreMortemReport`
