# Celebrity Salad website design rules

Celebrity Salad and PadelWrist are products from the same developer. They should feel like different products built on the same web design system: shared grid, spacing, type roles, navigation behaviour, accessibility, footer structure and interaction rules, with product-specific branding layered on top.

The website must still feel unmistakably like the Celebrity Salad app. The shared studio foundation and Material 3 principles govern structure and behaviour rather than visual identity.

## Priority

1. Accessibility and usability
2. Shared developer web foundation used by PadelWrist
3. Material 3 adaptive layout principles
4. Celebrity Salad brand identity
5. SEO and content clarity
6. Creative embellishment

The `gpt-taste` skill is inspiration only. If it conflicts with this file, this file wins. Do not introduce randomised layouts, stock imagery, forced GSAP, arbitrary spacing or new typography stacks simply because the skill suggests them.

## Shared family conventions

Keep these aligned with PadelWrist unless there is a clear product-specific reason not to:

- `1280px` maximum content container
- `32px` expanded/desktop edge gutters, `24px` medium, `16px` compact
- 12-column expanded grid, 8-column medium grid, 4-column compact grid
- `24px` grid gap at expanded/medium, `16px` compact
- major section rhythm of `120px` expanded, `96px` medium, `80px` compact
- 72px desktop app bar, 68px medium, 64px compact
- 48px minimum primary navigation targets
- compact mobile menu pattern with an explicit menu control, Escape-to-close and keyboard support
- visible skip-to-content link
- visible breadcrumbs on inner content pages
- shared type-role hierarchy: Display, Headline, Title, Body and Label
- shared shape scale: 12, 16, 24 and 28px plus full pills
- shared motion timing: approximately 180ms fast, 300ms normal, Material-style easing
- footer aligned to the same responsive grid as the rest of the page
- consent controls following the same component anatomy and accessibility rules

Do not copy PadelWrist's dark theme, sports photography, Montserrat branding or product-specific component styling into Celebrity Salad.

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

All main layouts should use the shared grid. Stack or simplify at medium/compact widths rather than inventing unrelated fractional grids for each section.

## Spacing

Use the shared 4px-based scale:

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120, 144px`

Prefer the existing CSS custom properties. Do not introduce arbitrary values such as 18px, 27px, 70px, 74px, 82px or 92px for layout spacing.

## Typography

Treat typography as Material 3-style roles rather than one-off sizes:

- Display: page hero / major campaign statement
- Headline: section title
- Title: card and subsection heading
- Body large: lead copy
- Body: standard content
- Label: navigation, eyebrow, metadata

Celebrity Salad may use a different display font from PadelWrist, but the role hierarchy and vertical rhythm should feel related. Long-form body content should generally stay around 60–70 characters per line and should not stretch simply because the window is wide.

## Components

Header, navigation, footer, buttons, article grid, breadcrumbs, TOC, cards, chips, tables, cookie consent and focus states are shared structural components. Fix them centrally instead of adding page-specific copies.

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
- The compact navigation must remain usable without a pointer.

## Shape and elevation

Use the shared shape tokens. Prefer 12, 16, 24 and 28px corner radii plus full pills where semantically appropriate.

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
- header/logo/nav consistency with the shared studio foundation
- section spacing rhythm
- heading and description baselines
- card height/action alignment
- no accidental horizontal scrolling
- touch target sizes
- keyboard focus states
- mobile menu operation and Escape behaviour
- breadcrumbs
- tables and tools remain usable
- reduced-motion behaviour
- footer and cookie controls

Do not roll a new visual system across the site until these checks have been completed coherently.
