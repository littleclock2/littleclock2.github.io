---
version: alpha
name: "YunSword Engineering Journal"
description: "A Chinese-first embedded-systems field journal with a disciplined black-and-amber industrial identity."
colors:
  primary: "#FFB800"
  canvas: "#0B0C0A"
  surface: "#121310"
  surface-raised: "#191A16"
  text-primary: "#F2F2ED"
  text-secondary: "#A5A69D"
  border: "#30312A"
typography:
  mono:
    fontFamily: "IBM Plex Mono, Cascadia Mono, JetBrains Mono, ui-monospace, monospace"
rounded:
  DEFAULT: "0px"
  sm: "0px"
  md: "0px"
  lg: "0px"
spacing:
  page-gutter: "1.5rem"
  section-gap: "4.5rem"
  page-max: "90rem"
components:
  page-frame:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
    typography: "{typography.mono}"
    padding: "{spacing.page-gutter}"
    width: "{spacing.page-max}"
  navigation:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.mono}"
    rounded: "{rounded.DEFAULT}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.mono}"
    rounded: "{rounded.DEFAULT}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.mono}"
    rounded: "{rounded.DEFAULT}"
  article-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
    typography: "{typography.mono}"
    padding: "{spacing.page-gutter}"
  article-row-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  project-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.DEFAULT}"
  project-link-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.primary}"
  divider:
    backgroundColor: "{colors.border}"
    size: "1px"
  section:
    padding: "{spacing.section-gap}"
---

# YunSword Engineering Journal Design System

## Overview

### Creative North Star

An embedded engineer's field operations journal: matte equipment panels, precise one-pixel rules, a readable technical grid, and content-led navigation. It must feel engineered and personal, not like a copied game interface.

### Product context and register

- **Audience and primary job:** Readers interested in embedded development, MCU projects, hardware design, and the author's project archive need to find and read real technical work quickly.
- **Target market and evidence:** The current site and articles are Chinese-first and publicly hosted from the `littleclock2.github.io` repository. No geographic market behavior is assumed.
- **Locales and language policy:** Simplified Chinese is primary; English and Traditional Chinese remain optional navigation/content fallbacks. Real project names stay in their repository spelling.
- **Usage scene:** Desktop and mobile reading, with the homepage as a compact index and article pages optimized for long technical prose and code.
- **Register:** Brand-forward on the homepage; quiet content-first presentation on articles, projects, and About.
- **Memorable signature:** The existing homepage hero is preserved while the article, project, publishing, and About experiences are refined. A future hero asset remains a separate design decision.
- **Restraint:** Navigation, article rows, project links, body copy, and publishing guidance remain conventional, concise, and highly legible.
- **Anti-references:** No fake telemetry, coordinates, counters, status strips, client-side password gates, game logos, copied vehicles, neon cyberpunk, glass panels, rounded SaaS cards, emoji icons, or decorative labels with no information value.
- **Token ownership/runtime mapping:** Model B. `docs/.vitepress/theme/custom.css` is the canonical runtime token source; this file mirrors the accepted values and intent. Vue components consume semantic CSS custom properties rather than repeating raw values.

## Colors

`canvas` is the document ground. `surface` and `surface-raised` separate regions through tone and one-pixel borders, never shadows. `primary` is the only expressive color and maps to the runtime `--ys-signal` token for focus, active navigation, important headings, and controls. Text contrast must meet WCAG 2.2 AA.

## Typography

All authored interface, display, body, code, and utility text use the mono stack. IBM Plex Mono leads when available; Cascadia Mono and JetBrains Mono are local fallbacks. The generic monospace fallback supplies script coverage where a named face lacks Chinese glyphs. Large Latin display text may use tighter line height, while Chinese prose keeps at least 1.75 line height and a readable measure.

## Layout

The homepage keeps its current hero and adds compact full-width list rows below it. Article pages use a narrower reading measure. One-pixel rules encode section boundaries. Desktop gutters expand fluidly; mobile collapses to one column without horizontal clipping, hidden controls, or fixed-width text. Code blocks own their horizontal scrolling.

## Elevation & Depth

The system is flat. Hierarchy comes from tonal surfaces, borders, scale, and spacing. Static content has no drop shadow, blur, glass treatment, or gradient. The existing hero is a frozen exception until its visual direction is reviewed separately.

## Shapes

All containers and controls use square corners. UI chrome does not imitate game hardware with decorative polygons.

## Components

### Foundational visual states

Links and buttons have explicit default, hover, focus-visible, and active states. Focus uses a two-pixel `primary` outline with offset. Disabled and busy states appear only when the underlying behavior exists. Scrollbars are globally visible and tokenized.

### Buttons and actions

Primary actions use a filled `primary` surface with dark text. Secondary actions use transparent fill and a one-pixel border. Labels state the actual destination or action. Geometry remains stable across hover and focus.

### Navigation and data display

Navigation has four real destinations: 首页, 文章, 项目, 关于. Article and project lists are semantic links with real titles, descriptions, dates, and repository names. The public Editor destination is removed because it is not a secure publishing surface.

The About introduction uses the owner's public GitHub avatar in a square one-pixel frame. Avatar ownership and updates remain in GitHub profile settings; the public site provides no upload control, client-side password, or duplicated avatar file.

### Forms and overlays

The public site introduces no custom content-editing forms or client-side secret prompts. Search remains owned by VitePress and must retain its keyboard and accessibility behavior.

### Iconography

Use the VitePress-owned icons already supplied by the theme for search, menu, theme, and GitHub. Do not add Unicode glyphs, emoji, or decorative icon substitutes. Text-only links are preferred for article and project rows. The compact BGM control is the single exception: it may use one semantic SVG note inside its real playback-progress ring because the theme does not provide a suitable music icon.

### Motion

The existing hero motion remains unchanged in this iteration. New hover transitions stay between 140ms and 220ms. Under `prefers-reduced-motion: reduce`, ambient, pointer, and entrance motion stops and scrolling is immediate.

The global BGM player defaults to a 48px square note control whose SVG ring reports real playback progress. Selecting it opens the complete playlist, previous/play/next, direct track selection, time, progress, and volume controls; five seconds without interaction returns it to the compact state without stopping audio. Direct track selection deliberately uses the browser-owned native Select/Listbox for reliable keyboard and mobile behavior; its platform popup is accepted as part of that ownership decision. A finished track advances to the next configured song, while the most recently selected track and volume persist locally. Playback always starts from an explicit user action, focus is restored when an expanded control collapses, and the site never forces autoplay. The player uses the existing square one-pixel control language and introduces no glow, circular container, simulated spectrum, or decorative telemetry.

### Content and data visualization

Copy is direct and Chinese-first. Every visible number, date, description, and project name comes from repository content. No decorative telemetry or fabricated expertise percentages are permitted.

## Do's and Don'ts

- **Do:** Treat the hero as a separately reviewed module and keep this iteration focused on content and publishing usability.
- **Do:** Keep article metadata generated from Markdown frontmatter so one source stays authoritative.
- **Don't:** imitate a named game's exact vehicle, interface copy, branding, or proprietary asset.
- **Don't:** hide overflow to conceal responsive defects or use fixed widths that clip Chinese content.
