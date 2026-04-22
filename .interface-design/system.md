# Interface Design System: Radix Professional

## Direction
**Refined Software Grade.** A lightweight, airy, and professional interface inspired by the official Radix UI documentation. Focuses on clarity, subtle layering, and developer-grade aesthetics.

## Palette (Radix Slate & Violet)
- **Background:** `var(--slate-1)` (#fbfcfd) - Main canvas.
- **Sidebar/Secondary:** `var(--slate-2)` (#f8f9fa) or `slate-50`.
- **Ink (Primary):** `var(--slate-12)` (#11181c) - Main headings and text.
- **Ink (Muted):** `var(--slate-11)` (#687076) - Secondary labels and metadata.
- **Accent:** `var(--violet-9)` (#7e51f1) - Primary actions and highlights.
- **Borders:** `var(--slate-4)` (#eceef0) - Subtle separation.

## Depth & Layering
- **Strategy:** Subtle Layering.
- **Cards:** `variant="surface"`. White background, 1px `slate-4` border, minimal `0 1px 2px` shadow.
- **Hover States:** Slight border darkening (`slate-5`) and very soft shadow lift.
- **Separators:** Solid 1px `slate-4`.

## Typography (Geist)
- **Headings:** `Geist Sans`, Bold, `tracking-tight` (-0.02em).
- **UI Labels:** `Geist Sans`, Medium (500), `size-2`.
- **Numbers/Data:** Tabular figures for alignment in tables and metrics.

## Spacing & Radius
- **Base Unit:** 4px (Radix scale).
- **Radius:** `large` (consistent across cards, buttons, and inputs).
- **Padding:** Generous (P-8 to P-12 for main containers).

## Key Patterns
- **Sidebar:** `slate-50` background, full height, `slate-200` right border.
- **Navigation:** Soft rounded rectangles for links, `violet-50` background for active state.
- **Badges:** `variant="soft"`, pastel colors with high-contrast text.
- **Activity Feed:** Left-aligned vertical line (`slate-200`) with small circular indicators.
