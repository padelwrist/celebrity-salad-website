# Celebrity Salad website design rules

The website must feel like the Celebrity Salad app, but its layout and interaction system is governed by Material 3 principles rather than by ad-hoc page composition.

## Priority

1. Accessibility and usability
2. Material 3 adaptive layout principles
3. Celebrity Salad brand identity
4. SEO and content clarity
5. Creative embellishment

The `gpt-taste` skill is inspiration only. If it conflicts with this file, this file wins. Do not introduce randomised layouts, stock imagery, forced GSAP, arbitrary spacing or new typography stacks simply because the skill suggests them.

## Brand that stays fixed

- Stage Violet, Cream, Gold and the established round colours
- Celebrity Salad authored wordmark
- Gold Celebrity Star
- Ingredient cast artwork
- Physical card/deck language
- Condensed display typography with the existing body-system stack
- Light, tactile, playful tone

Do not replace authored brand assets with procedurally recreated versions.

## Adaptive layout

Use Material 3 width classes as the only responsive breakpoints:

- Compact: `< 600px`
- Medium: `600–839px`
- Expanded: `840–1199px`
- Large: `1200–1599px`
- Extra large: `1600px+`

Do not add one-off breakpoints such as 650px, 700px, 900px or 980px.

All main layouts should use the shared shell and a 12-column grid at expanded widths. Stack or simplify at medium/compact widths rather than inventing unrelated fractional grids for each section.

## Spacing

Use this spacing scale only:

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128px`

Prefer the existing CSS custom properties. Do not introduce arbitrary values such as 18px, 27px, 70px, 74px, 82px or 92px for layout spacing.

## Typography

Treat typography as Material 3-style roles rather than one-off sizes:

- Display: page hero / major campaign statement
- Headline: section title
- Title: card and subsection heading
- Body large: lead copy
- Body: standard content
- Label: navigation, eyebrow, metadata

Keep line lengths readable. Long-form body content should generally stay around 60–70 characters per line and should not stretch simply because the window is wide.

## Components

Header, navigation, footer, buttons, article grid, TOC, cards, chips, tables, cookie consent and focus states are shared components. Fix them centrally instead of adding page-specific copies.

Cards use a consistent anatomy:

`label → title → supporting copy → flexible space → action`

When cards sit in the same row, their internal content and actions should align visually even when title lengths differ.

## Interaction and accessibility

- Interactive targets should be at least 48×48px where practical.
- Keep at least 8px between adjacent touch targets.
- Every interactive element needs a visible `:focus-visible` state.
- Do not rely on hover alone.
- Respect `prefers-reduced-motion`.
- Preserve semantic HTML and keyboard access.
- Maintain sufficient colour contrast.

## Shape and elevation

Use the shared shape tokens. Prefer 12, 16 and 24px corner radii plus full pills where semantically appropriate.

Use restrained, repeated tactile shadows rather than inventing a different shadow offset for each component.

## Page-specific CSS

Avoid inline `style` attributes and local `<style>` blocks for layout. If a page needs a genuinely unique component, it may define a small scoped style, but spacing, typography, breakpoints, touch targets and grid rules must still use the shared system.

## SEO and analytics

Do not remove or weaken canonical URLs, metadata, structured data, internal links, `robots.txt`, sitemap or `llms.txt` while changing design.

Google Analytics remains consent-gated. Do not cause GA4 to load before the visitor accepts analytics.

## QA before release

Check every changed page at these representative widths:

- 390px compact
- 768px medium
- 1024px expanded
- 1440px large
- 1728px extra large

For each width check:

- global shell alignment
- header/logo/nav consistency
- section spacing rhythm
- heading and description baselines
- card height/action alignment
- no accidental horizontal scrolling
- touch target sizes
- keyboard focus states
- tables and tools remain usable
- reduced-motion behaviour
- footer and cookie controls

Do not roll a new visual system across the site until these checks have been completed coherently.
