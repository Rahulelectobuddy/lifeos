# 🖥️ Screen Specifications & Layout Wireframes — Life OS

**Document Version:** 1.0.0  
**Status:** Approved  

> [!IMPORTANT]
> **Phase 1 Implementation Scope:** Phase 1 delivers the **Responsive Web Application Screen Spec** (Section 1 & 3 via Web Browser). Android Mobile (Section 2) and macOS Native Desktop clients are targeted for Phase 2 system expansion.

## 1. Web Application & Desktop 3-Column Screen Spec (Phase 1 MVP)

- **Left Sidebar ($240\text{px}$):** Workspace Selector, Search trigger, Quick Links, PARA Category Tree (Projects, Areas, Resources, Archives), Settings.
- **Center Canvas ($60\%\text{--}80\%$):** Multi-view workspace (Markdown Editor, Board, Whiteboard, Calendar, Finance Ledger, Chat stream).
- **Right Context Panel ($320\text{px}$):** Life Graph Inspector rendering entity metadata, PARA badges, bidirectional links, backlinks, attachments, and AI context summaries.

---

## 2. Android Mobile Screen Spec

- **Top App Bar:** Hamburger menu drawer toggle, Workspace Switcher, Global Search icon, Notifications Bell.
- **Viewport Canvas:** Touch-optimized cards, swipe-to-complete tasks, tabbed views.
- **Bottom Navigation Bar:** 5 fixed icons (Home, Inbox, Tasks, Notes, Chat).
- **FAB (Floating Action Button):** Quick Capture trigger positioned at bottom-right corner ($16\text{px}$ inset).

---

## 3. Quick Capture Overlay Spec (`Cmd+Shift+C`)

- **Modal Dimensions:** Centered overlay ($600\text{px}$ width $\times$ $240\text{px}$ max height).
- **Input:** Auto-focused single-line / multi-line input field with instant capture button.
- **Shortcuts:** `Enter` to capture to Inbox, `Esc` to dismiss.
