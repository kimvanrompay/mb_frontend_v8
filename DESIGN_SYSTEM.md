# Meribas Proctored Assessment & HR Design System

This guide adapts the soft, card-based layout into a secure, professional Assessment Platform. The visual language shifts from "Medical Care" to "Proctored Security & Human Potential."

## The Core Aesthetic

- **Structure**: Reliable, deterministic grid (Angular-friendly).
- **Palette**: High-contrast Monochrome (Black/White) with Deep Forest Green accents.
- **Vibe**: "Clinical Precision meets Human Insight."

## 1. The Palette: "Secure Monochrome"

```css
:root {
  /* --- BRAND ANCHORS --- */
  --meribas-black: #0F1115;       /* Sidebar, Primary Text, Modal Backdrops */
  --meribas-charcoal: #1A1D23;    /* Sidebar Active States, Tooltips */
  --meribas-smoke: #F4F4F5;       /* Page Background (Light Mode) */
  --meribas-white: #FFFFFF;       /* Card Surfaces */

  /* --- ACCENT: "VERIFIED GREEN" --- */
  --accent-green-900: #052e16;    /* Deep Forest - Hover States */
  --accent-green-600: #15803d;    /* Primary Action / "Passed" */
  --accent-green-400: #4ade80;    /* Success Icons / Charts */
  --accent-green-100: #f0fdf4;    /* Light Green Backgrounds (Safe Zones) */

  /* --- ASSESSMENT STATES (The "Proctored" Logic) --- */
  --status-flagged: #BE123C;      /* Red: Cheating/Violation Flag */
  --status-warning: #D97706;      /* Amber: Suspicious Activity */
  --status-neutral: #6B7280;      /* Grey: Not Started */
  
  /* --- SHADOWS (The "Floating" Look) --- */
  --shadow-card: 0px 4px 24px rgba(0, 0, 0, 0.06);
  --shadow-lift: 0px 12px 32px rgba(0, 0, 0, 0.08);
}
```

## 2. Typography: "Data-Dense & Legible"

**Font Family**: 'Inter' or 'Roboto'

| Usage | Size | Weight | Color | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Page Title)** | 26px | Bold (700) | Black | -0.5px |
| **H2 (Card Header)** | 18px | SemiBold (600) | Black | -0.3px |
| **Score (KPI)** | 42px | ExtraBold (800) | Black | -1.0px |
| **Label/Meta** | 11px | Bold (700) | Grey 500 | +0.5px (Caps) |
| **Body Text** | 14px | Regular (400) | Grey 800 | 0px |

## 3. UI Components Rules

### A. The "Proctor Card" (Base Container)
- **Radius**: 20px (Strict rule).
- **Border**: None (Shadow only) OR 1px solid #F0F0F0.
- **Shadow**: `var(--shadow-card)`.
- **Padding**: 24px.
- **Header**: Top-aligned, Title left, Actions right.

### B. The "Integrity Badge" (Pills)
- **Design**: Full rounded pill (`border-radius: 99px`).
- **Verified**: Bg: Green-100 / Text: Green-700 / Icon: Checkmark
- **Suspicious**: Bg: Red-50 / Text: Red-700 / Icon: Eye-Slash

### C. The "Skill Gauge" (Donut & Radar)
- **Donut**: 70% Black (Hard Skills), 30% Green (Soft Skills).
- **Radar**: Thin Black lines, Green transparent fill.

## 4. Domain Mapping

| Reference (Medical) | Meribas Context (Assessment) | Data / Action |
| :--- | :--- | :--- |
| "Top Treatment" | **"Skill Breakdown"** | Donut: Coding (40%), Cognitive (30%), Personality (30%) |
| "Satisfaction Rate" | **"Trust Score"** | Gauge: "98% Integrity" (Green) |
| "Total Patients" | **"Active Candidates"** | "620 Invited", "420 Completed" |
| "Upcoming Appointments" | **"Live Proctoring Feed"** | Status: "Live" (Pulsing Green Dot) |
| "Complications Rate" | **"Cheating Flag Distribution"** | Heatmap: "Browser Tab Switch" spikes |

## 5. Angular Implementation Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar-black/
│   │   │   ├── topbar-white/
│   │   ├── cards/
│   │   │   ├── card-base/
│   │   │   ├── card-kpi/
│   │   │   ├── card-candidate-row/
│   │   ├── charts/
│   │   │   ├── radar-personality/
│   │   │   ├── gauge-trust/
```
