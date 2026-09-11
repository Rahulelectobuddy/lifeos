# 🎨 Penpot Design Assets & Version Control — Life OS

**File Name:** Cypher LifeOS  
**Target Platform:** Web Application (Phase 1 Core MVP)  
**Layout Resolution:** $1440 \times 900\text{ px}$ per board (6 Boards Total)  

---

## 🗂️ What Penpot Assets Are Stored in Git?

To ensure full version control, reproducibility, and offline developer documentation, the following Penpot artifacts are stored directly within the repository under `ux/penpot/`:

| Artifact | File Path | Purpose |
| :--- | :--- | :--- |
| **Penpot Source File** | `ux/penpot/cypher-lifeos.penpot` | Binary `.penpot` file export containing all pages, boards, components, vector paths, and interactive prototyping transitions. |
| **Design Tokens JSON** | [`ux/penpot/design-tokens.json`](file:///Users/ritikgarg/workspace/lifeos/ux/penpot/design-tokens.json) | Exported JSON token registry containing HSL color variables, typography fonts, and PARA badge specs. |
| **Automation Plugin Script** | `ux/penpot/generate-wireframes.js` | Programmatic Penpot API script used to construct and wire the 6 Web Application boards. |
| **Exported Screen Previews** | `ux/wireframes/*.svg` / `*.png` | High-resolution vector SVG and PNG image previews of all 6 interactive web wireframe boards. |

---

## 📥 How to Export `.penpot` File from Penpot UI to Git

1. Open your Penpot file **'Cypher LifeOS'** in the Penpot Web App.
2. In the top-left menu bar, click **File ➔ Export ➔ Export file (.penpot)**.
3. Save the exported file as `cypher-lifeos.penpot` inside `ux/penpot/`.
4. Commit the file to Git:
   ```bash
   git add ux/penpot/cypher-lifeos.penpot
   git commit -m "feat(ux): update Penpot design source file cypher-lifeos.penpot"
   ```

---

## 🖼️ How to Export Board Previews (SVG / PNG) to Git

1. Select a board in Penpot (e.g., `Web - Home Dashboard & Command Center`).
2. In the right-hand inspection panel, scroll down to the **Export** section.
3. Choose format **SVG** or **PNG (2x)** and click **Export**.
4. Save the image into `ux/wireframes/` (e.g., `01-home-dashboard.svg`).

---

## 📐 6 Web Application Wireframe Board Inventory

1. **`Web - Home Dashboard & Command Center`** ($1440 \times 900\text{ px}$): 24 interactive click triggers.
2. **`Web - Second Brain Note Workspace`** ($1440 \times 900\text{ px}$): 10 interactive click triggers.
3. **`Web - Tasks & Project Management`** ($1440 \times 900\text{ px}$): 16 interactive click triggers.
4. **`Web - Daily Journal & Habit Tracker`** ($1440 \times 900\text{ px}$): 9 interactive click triggers.
5. **`Web - Interactive Knowledge Graph Explorer`** ($1440 \times 900\text{ px}$): 14 interactive click triggers.
6. **`Web - Universal Command Palette Modal (⌘K)`** ($1440 \times 900\text{ px}$): 16 interactive click triggers.
