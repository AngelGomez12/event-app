# Skill Registry - admin-front

## Project Standards (auto-resolved)

### Stack: Next.js 16 + React 19
- Follow Next.js 16 app router conventions.
- React 19: use new hooks and patterns (e.g., `use`, `useActionState`).
- Components should be modular and follow Atomic Design if applicable (src/components).

### Styling: Tailwind 4 + Radix UI
- Tailwind 4: use new engine features, no @tailwind base/components/utilities needed (standard @import "tailwindcss";).
- Radix UI Themes: use theme-aware components for accessibility and consistent UI.

### State Management: Zustand
- Create stores in `src/store/`.
- Use shallow selector for performance.

### API: Axios
- Centralized client in `src/services/apiClient.ts`.
- Service-based architecture in `src/services/`.

### Testing & Quality
- No test runner detected. Strict TDD Mode: disabled.
- Use `npm run lint` for ESLint checks.
- Use `tsc` for type checking.

---

## User Skills Registry

### skill-creator
- **Trigger**: asks to create a new skill, add agent instructions, or document patterns for AI.
- **Location**: /Users/angelgomez/.gemini/skills/skill-creator/SKILL.md

### judgment-day
- **Trigger**: "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen".
- **Location**: /Users/angelgomez/.gemini/skills/judgment-day/SKILL.md

### issue-creation
- **Trigger**: creating a GitHub issue, reporting a bug, or requesting a feature.
- **Location**: /Users/angelgomez/.gemini/skills/issue-creation/SKILL.md

### go-testing
- **Trigger**: writing Go tests, using teatest, or adding test coverage.
- **Location**: /Users/angelgomez/.gemini/skills/go-testing/SKILL.md

### branch-pr
- **Trigger**: creating a pull request, opening a PR, or preparing changes for review.
- **Location**: /Users/angelgomez/.gemini/skills/branch-pr/SKILL.md
