# MATERIAL DESIGN 3 MIGRATION PLAN
## From Tailwind Prototype to Google-Scale System

### THE VISION
Transform from generic Tailwind utility classes to **Material Design 3** — the design system that powers Google Cloud, Analytics, and Gmail. Stop looking like a side project. Start looking like an empire.

---

## PHASE 1: INSTALL THE FOUNDATION

### Option A: Angular Material (Recommended - Pure M3)
```bash
ng add @angular/material
```

**Configuration:**
- Select **Material 3** theme during setup
- Choose custom theme with brand color: `#0F5132` (Emerald)
- Import core modules in `app.config.ts`

### Option B: Tailwind + M3 Tokens (Hybrid Approach)
Update `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // M3 Color System
        primary: '#0F5132',
        'primary-container': '#C4EED0',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#052112',
        
        secondary: '#526350',
        'secondary-container': '#D4E8CF',
        'on-secondary-container': '#101F0F',
        
        surface: '#FEF7FF',
        'surface-dim': '#DED8E1',
        'surface-bright': '#FEF7FF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F2FA',
        'surface-container': '#F3EDF7',
        'surface-container-high': '#ECE6F0',
        'surface-container-highest': '#E6E0E9',
        
        'on-surface': '#1C1B1F',
        'on-surface-variant': '#49454F',
        
        outline: '#79747E',
        'outline-variant': '#C4C7C5',
      },
      borderRadius: {
        'm3-none': '0px',
        'm3-xs': '4px',
        'm3-sm': '8px',
        'm3-md': '12px',
        'm3-lg': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px',
      },
      boxShadow: {
        'm3-1': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'm3-2': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'm3-3': '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
      }
    }
  }
}
```

---

## PHASE 2: THE NAVIGATION DRAWER REVOLUTION

### Current State: Boring Static List
- Plain text links
- No hierarchy
- No visual feedback
- Disconnected actions

### M3 Target: Standard Navigation Drawer

#### Structure:
```
┌─────────────────────────────┐
│  [+ Invite Candidate]       │ ← Extended FAB (Top Action)
│                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━  │ ← Divider
│                             │
│  ●  Overview               │
│  ●  Positions              │
│  ●  Assessments            │
│  ████ Candidates ████      │ ← Active Pill Indicator
│  ●  Invitations            │
│                             │
│  ASSESSMENT TOOLS          │ ← Section Header
│  ━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ●  Test Library           │
│  ●  Interview Scheduler    │
└─────────────────────────────┘
```

#### Implementation:

**HTML Structure:**
```html
<aside class="w-[280px] h-screen bg-surface-container-low flex flex-col">
  
  <!-- Extended FAB -->
  <div class="p-4">
    <button class="h-14 w-full bg-primary-container rounded-m3-lg 
                   flex items-center justify-center gap-2 
                   text-on-primary-container font-medium text-sm
                   shadow-m3-1 hover:shadow-m3-2 transition-all">
      <mat-icon>person_add</mat-icon>
      <span>Invite Candidate</span>
    </button>
  </div>

  <!-- Navigation Items -->
  <nav class="flex-1 px-3 py-2 space-y-1">
    <!-- Regular Item -->
    <a href="/overview" 
       class="h-14 px-6 flex items-center gap-4 
              text-on-surface-variant rounded-m3-full
              hover:bg-surface-container-high transition-colors">
      <mat-icon>dashboard</mat-icon>
      <span class="text-sm font-medium">Overview</span>
    </a>

    <!-- Active Item (with pill) -->
    <a href="/candidates" 
       class="h-14 px-6 flex items-center gap-4 
              bg-secondary-container text-on-secondary-container 
              rounded-m3-full font-bold">
      <mat-icon>people</mat-icon>
      <span class="text-sm">Candidates</span>
    </a>

    <!-- Section Divider -->
    <div class="py-4">
      <div class="h-px bg-outline-variant"></div>
    </div>

    <!-- Section Header -->
    <div class="px-6 py-2">
      <span class="text-xs font-bold text-on-surface-variant 
                   tracking-wider uppercase">
        Assessment Tools
      </span>
    </div>

    <!-- Section Items -->
    <a href="/test-library" 
       class="h-14 px-6 flex items-center gap-4 
              text-on-surface-variant rounded-m3-full
              hover:bg-surface-container-high transition-colors">
      <mat-icon>library_books</mat-icon>
      <span class="text-sm font-medium">Test Library</span>
    </a>
  </nav>

  <!-- Bottom Section -->
  <div class="p-4 border-t border-outline-variant">
    <a href="/settings" 
       class="h-12 px-4 flex items-center gap-3 
              text-on-surface-variant rounded-m3-md
              hover:bg-surface-container-high">
      <mat-icon>settings</mat-icon>
      <span class="text-sm">Settings</span>
    </a>
  </div>
</aside>
```

---

## PHASE 3: MAIN CONTENT TRANSFORMATION

### The "Pane" Layout
The main content area should have a **rounded top-left corner** where it meets the sidebar (24px radius). This creates the "lifted pane" effect seen in Gmail, Google Drive, etc.

```html
<main class="flex-1 bg-surface rounded-tl-[24px] overflow-hidden">
  <!-- Your candidate list/detail content -->
</main>
```

### Search Bar Upgrade
Replace the floating island with M3 Search Bar:

```html
<div class="h-16 px-6 flex items-center bg-surface-container-high">
  <div class="flex-1 h-12 px-4 flex items-center gap-3 
              bg-surface-container-highest rounded-m3-full">
    <mat-icon class="text-on-surface-variant">search</mat-icon>
    <input type="text" 
           placeholder="Search 19 candidates..."
           class="flex-1 bg-transparent border-0 outline-0 
                  text-on-surface placeholder:text-on-surface-variant">
  </div>
</div>
```

---

## PHASE 4: CARD SYSTEM

### Kill the Glassmorphism
Replace all `backdrop-blur-xl`, `bg-white/40`, `shadow-xl` with M3 cards:

**Before (Puffy):**
```html
<div class="bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
```

**After (Crisp):**
```html
<div class="bg-surface-container-low border border-outline-variant 
            rounded-m3-lg shadow-m3-1 p-6">
```

### Card Variants:
- **Elevated Card**: `shadow-m3-1` (default)
- **Filled Card**: `bg-surface-container-highest`
- **Outlined Card**: `border border-outline-variant`

---

## PHASE 5: TYPOGRAPHY SYSTEM

Replace all font sizing with M3 type scale:

| M3 Token | Tailwind Class | Use Case |
|----------|---------------|----------|
| Display Large | `text-[57px] leading-[64px]` | Hero numbers |
| Headline Large | `text-[32px] leading-[40px]` | Page titles |
| Title Large | `text-[22px] leading-[28px]` | Card headers |
| Title Medium | `text-[16px] leading-[24px] font-medium` | Section titles |
| Body Large | `text-[16px] leading-[24px]` | Body text |
| Body Medium | `text-[14px] leading-[20px]` | Default text |
| Label Large | `text-[14px] leading-[20px] font-medium` | Buttons |
| Label Small | `text-[11px] leading-[16px] font-medium tracking-wider` | Captions |

---

## PHASE 6: COMPONENT LIBRARY

### Create Reusable M3 Components

#### 1. M3 Button Component
```typescript
// button.component.ts
@Component({
  selector: 'app-m3-button',
  template: `
    <button [class]="buttonClasses" [disabled]="disabled">
      <mat-icon *ngIf="icon">{{icon}}</mat-icon>
      <span>{{label}}</span>
    </button>
  `
})
export class M3ButtonComponent {
  @Input() variant: 'filled' | 'tonal' | 'outlined' | 'text' = 'filled';
  @Input() icon?: string;
  @Input() label: string = '';
  @Input() disabled: boolean = false;

  get buttonClasses() {
    const base = 'h-10 px-6 rounded-m3-full flex items-center gap-2 transition-all';
    switch(this.variant) {
      case 'filled': return `${base} bg-primary text-on-primary hover:shadow-m3-1`;
      case 'tonal': return `${base} bg-secondary-container text-on-secondary-container`;
      case 'outlined': return `${base} border border-outline text-primary`;
      case 'text': return `${base} text-primary hover:bg-primary/[0.08]`;
    }
  }
}
```

#### 2. M3 Card Component
```typescript
// card.component.ts
@Component({
  selector: 'app-m3-card',
  template: `
    <div [class]="cardClasses">
      <div class="p-6">
        <h3 class="text-[16px] leading-[24px] font-medium text-on-surface mb-4">
          {{title}}
        </h3>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class M3CardComponent {
  @Input() variant: 'elevated' | 'filled' | 'outlined' = 'elevated';
  @Input() title: string = '';

  get cardClasses() {
    const base = 'rounded-m3-lg overflow-hidden';
    switch(this.variant) {
      case 'elevated': return `${base} bg-surface-container-low shadow-m3-1`;
      case 'filled': return `${base} bg-surface-container-highest`;
      case 'outlined': return `${base} bg-surface border border-outline-variant`;
    }
  }
}
```

---

## IMPLEMENTATION CHECKLIST

### Week 1: Foundation
- [ ] Install Angular Material or configure Tailwind with M3 tokens
- [ ] Set up M3 color palette in theme
- [ ] Import Material Icons

### Week 2: Navigation
- [ ] Redesign sidebar with Navigation Drawer pattern
- [ ] Add Extended FAB for primary action
- [ ] Implement active pill indicators
- [ ] Add section dividers

### Week 3: Content Area
- [ ] Add rounded corner to main content pane
- [ ] Replace glassmorphism cards with M3 elevated cards
- [ ] Implement M3 Search Bar
- [ ] Left-align all centered content

### Week 4: Components
- [ ] Build reusable M3 button component
- [ ] Build reusable M3 card component
- [ ] Update typography throughout app
- [ ] Test accessibility (color contrast, focus states)

---

## THE RESULT

**Before:** Tailwind hobby project with inconsistent styling
**After:** Enterprise-grade M3 system that scales to 100+ screens

**Visual Coherence:** Everything uses the same design language
**Performance:** Component-based architecture is faster
**Accessibility:** M3 is WCAG AA compliant by default
**Scalability:** New features automatically inherit the system

---

## RESOURCES

- **M3 Guidelines**: https://m3.material.io/
- **Angular Material**: https://material.angular.io/
- **Material Icons**: https://fonts.google.com/icons
- **Color Tool**: https://m3.material.io/theme-builder

---

**This is how you build for Google-scale. Go execute.**
