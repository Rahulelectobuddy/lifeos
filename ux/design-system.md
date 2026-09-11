# 🎨 Design System & UI Specifications — Life OS

**Document Version:** 2.0.0  
**Status:** Approved  
**Default Theme:** Light Mode First (with optional Dark Mode toggle)  
**Styling Architecture:** Vanilla CSS Design System Tokens & Responsive Utility System  
**Target Platforms:** Web Browser (Vite + React), macOS / Windows Desktop (Tauri), Android Mobile (React Native)  

---

## 1. Executive Summary & Design Principles

The Life OS Design System is a modern, clean, **Light-Mode-First** visual language. It prioritizes crisp readability, high contrast, elegant typography, frosted light glassmorphism (`backdrop-filter: blur(12px)`), and vibrant PARA category accents across Web, Desktop, and Mobile.

### Core Principles
1. **Light Mode First Aesthetic:** Soft off-white canvas backgrounds (`hsl(220, 20%, 97%)`), pure white card surfaces (`hsl(0, 0%, 100%)`), deep charcoal typography (`hsl(222, 25%, 12%)`), and subtle soft shadows (`0 8px 32px rgba(0, 0, 0, 0.06)`).
2. **Frosted Light Glassmorphism:** Translucent light surfaces (`rgba(255, 255, 255, 0.75)`) with soft border strokes (`rgba(0, 0, 0, 0.08)`).
3. **PARA Framework Visual Language:** Color-coded badges for Projects (P - Indigo/Blue), Areas (A - Emerald Green), Resources (R - Deep Purple), and Archives (A - Slate Gray).
4. **Multi-Platform Native Adaptation:**
   - **macOS / Windows Desktop (Tauri):** Window drag regions (`-webkit-app-region: drag`), native window translucency, and keyboard shortcut badges.
   - **Android Mobile (React Native):** Touch target minimums ($48\text{px} \times 48\text{px}$), safe-area insets (`env(safe-area-inset-*)`), and bottom-sheet elevation.
   - **Web Browser (Vite + React):** Fluid responsive layouts (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).

---

## 2. Global CSS Variables & Token Registry (Light Theme Default)

```css
/* ============================================================================
   DEFAULT LIGHT THEME REGISTRY (:root & [data-theme="light"])
   ============================================================================ */
:root, [data-theme="light"] {
  /* Surface & Background Tokens (Light Theme) */
  --bg-base: hsl(220, 20%, 97%);          /* Soft off-white canvas */
  --bg-surface: hsl(0, 0%, 100%);         /* Pure white container */
  --bg-card: hsl(220, 20%, 99%);          /* Card surface */
  --bg-hover: hsl(220, 15%, 93%);         /* Subtle hover state */
  --bg-glass: rgba(255, 255, 255, 0.75);  /* Frosted light glass */
  --bg-glass-heavy: rgba(255, 255, 255, 0.90);

  /* Primary Brand & Accent Palette (Light Theme Optimized) */
  --accent-primary: hsl(248, 85%, 58%);      /* Vibrant Indigo */
  --accent-secondary: hsl(190, 90%, 42%);    /* Deep Cyber Cyan */
  --accent-success: hsl(150, 75%, 38%);      /* Emerald Green */
  --accent-warning: hsl(38, 90%, 48%);       /* Amber Gold */
  --accent-danger: hsl(355, 80%, 52%);       /* Rose Crimson */

  /* PARA Framework Badges & Priority Colors */
  --para-project: hsl(210, 85%, 45%);        /* Project Blue */
  --para-area: hsl(140, 70%, 35%);           /* Area Green */
  --para-resource: hsl(280, 75%, 45%);       /* Resource Purple */
  --para-archive: hsl(210, 15%, 45%);        /* Archive Slate */

  --priority-urgent: hsl(355, 80%, 52%);     /* Urgent Red */
  --priority-high: hsl(38, 90%, 48%);        /* High Amber */
  --priority-medium: hsl(210, 85%, 45%);     /* Medium Blue */
  --priority-low: hsl(215, 15%, 50%);        /* Low Muted */

  /* Typography Tokens */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-header: 'Outfit', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */

  /* Text & Content Colors (Light Theme High Contrast) */
  --text-primary: hsl(222, 25%, 12%);        /* Deep charcoal */
  --text-secondary: hsl(215, 16%, 38%);      /* Slate body text */
  --text-muted: hsl(215, 12%, 55%);          /* Muted caption text */

  /* Borders & Shadows */
  --border-subtle: rgba(0, 0, 0, 0.08);      /* Crisp light border */
  --border-focus: rgba(99, 102, 241, 0.6);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.06);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 4px 16px rgba(99, 102, 241, 0.25);
  --backdrop-blur: blur(12px);
}

/* ============================================================================
   OPTIONAL DARK THEME OVERRIDE ([data-theme="dark"])
   ============================================================================ */
[data-theme="dark"] {
  --bg-base: hsl(222, 15%, 8%);
  --bg-surface: hsl(222, 15%, 12%);
  --bg-card: hsl(222, 15%, 16%);
  --bg-hover: hsl(222, 15%, 20%);
  --bg-glass: rgba(255, 255, 255, 0.05);

  --text-primary: hsl(0, 0%, 98%);
  --text-secondary: hsl(215, 15%, 70%);
  --text-muted: hsl(215, 15%, 50%);

  --border-subtle: rgba(255, 255, 255, 0.08);
  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

---

## 3. Light Theme Component Specifications & Utility Classes

### 3.1 Light Glassmorphism Panel (`.glass-panel`)
```css
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-glass);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.glass-panel:hover {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 10px 36px 0 rgba(0, 0, 0, 0.08);
}
```

### 3.2 Light Theme Button Components (`.btn-primary`, `.btn-secondary`, `.btn-fab`)
```css
.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: #ffffff;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: var(--text-sm);
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}

.btn-secondary {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-secondary:hover {
  background: var(--bg-hover);
}

/* Android Floating Action Button (FAB) */
.btn-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
  z-index: 100;
}
```

### 3.3 Light Theme PARA Badges (`.badge-para-p`, `.badge-para-a`, etc.)
```css
.badge-para {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-para-p { background: rgba(59, 130, 246, 0.10); color: var(--para-project); border: 1px solid rgba(59, 130, 246, 0.25); }
.badge-para-a { background: rgba(34, 197, 94, 0.10); color: var(--para-area); border: 1px solid rgba(34, 197, 94, 0.25); }
.badge-para-r { background: rgba(168, 85, 247, 0.10); color: var(--para-resource); border: 1px solid rgba(168, 85, 247, 0.25); }
.badge-para-archive { background: rgba(148, 163, 184, 0.15); color: var(--para-archive); border: 1px solid rgba(148, 163, 184, 0.30); }
```

### 3.4 Light Theme Status Pills & Priority Indicators
```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.to_do { background: var(--text-muted); }
.status-dot.in_progress { background: var(--accent-warning); box-shadow: 0 0 6px var(--accent-warning); }
.status-dot.done { background: var(--accent-success); box-shadow: 0 0 6px var(--accent-success); }
```

### 3.5 Light Theme Inline `[[Wiki-link]]` & Autocomplete Popup
```css
.wiki-link {
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.08);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease;
}

.wiki-link:hover {
  background: rgba(99, 102, 241, 0.18);
  text-decoration: underline;
}

.autocomplete-dropdown {
  position: absolute;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
  max-height: 240px;
  overflow-y: auto;
  z-index: 200;
}
```

---

## 4. Multi-Platform Adaptation Directives

### 4.1 Responsive Breakpoints
```css
@media (max-width: 767px) {
  .left-sidebar { display: none; }
  .right-context-panel { display: none; }
  .main-canvas { width: 100%; padding: 12px; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .right-context-panel { display: none; }
  .main-canvas { width: calc(100% - 240px); }
}

@media (min-width: 1024px) {
  .layout-container { display: grid; grid-template-columns: 240px 1fr 320px; }
}
```

### 4.2 macOS Window Region (`-webkit-app-region`)
```css
.mac-titlebar {
  -webkit-app-region: drag;
  height: 38px;
  display: flex;
  align-items: center;
  padding-left: 80px;
  background: var(--bg-base);
}

.mac-titlebar button, .mac-titlebar input {
  -webkit-app-region: no-drag;
}
```

### 4.3 Android Touch Target Minimums
```css
.mobile-touch-target {
  min-width: 48px;
  min-height: 48px;
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 5. Verification & Sign-Off

| Role | Verification Action | Status |
| :--- | :--- | :--- |
| **UI Design Lead** | Light Mode First design tokens, frosted light glassmorphism, PARA badges & high-contrast typography verified | Verified |
| **Frontend Architect** | Dynamic theme switching (`:root[data-theme="light"]` default) and platform CSS tokens aligned | Verified |
