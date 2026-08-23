# Design QA — YunSword Engineering Journal

Date: 2026-08-23

## Scope

- Preserve the existing homepage hero and postpone the right-side visual decision.
- Refine the article index, project archive, About page, publishing path, navigation, and responsive behavior.
- Restore the About avatar as a GitHub-synchronized identity element without adding a public upload or password flow.
- Restore global BGM playback and add a repository-level editing and publishing guide.
- Do not push, deploy, or introduce the rejected Dijiang image experiments.

## Visual source and comparisons

The existing deployed site was captured before implementation and used as the baseline. The accepted industrial black-and-signal direction was applied to content pages while the hero remained frozen.

Side-by-side comparisons place the baseline on the left and the implementation on the right:

- `.qa/comparison-home.png` — desktop, 1440 × 1200
- `.qa/comparison-blog.png` — desktop, 1440 × 1200
- `.qa/comparison-about.png` — desktop, 1440 × 1200
- `.qa/comparison-blog-mobile.png` — mobile, 390 × 844
- `.qa/comparison-about-mobile.png` — mobile, 390 × 844

## Edge viewport checks

- Browser: Microsoft Edge only, using device metrics at CSS-pixel scale.
- Desktop: 1440 × 1200; home, blog, article, About, projects, and publishing guide inspected.
- Mobile: 390 × 844; home, blog, article, About, and publishing guide inspected.
- Document scroll width matched viewport width on all checked routes.
- Long code remains horizontally scrollable inside its code container without widening the page.

## Interaction and content checks

- Six primary routes returned HTTP 200 from the local preview.
- Public navigation contains four real destinations: 首页, 文章, 项目, 关于.
- Language menu has an accessible name, expanded state, menu roles, and Escape dismissal.
- Article index is generated from Markdown frontmatter; no duplicate JSON list is used by the new pages.
- Article generator successfully created a valid draft, refused overwrite, and rejected an invalid slug.
- Pull requests receive an independent build workflow; the new-post workflow creates a branch and either opens a draft pull request or prints a safe manual link when repository settings block automatic creation.
- Focus-visible and reduced-motion states are defined.
- The About avatar loads from the verified `littleclock2` GitHub profile, links to that profile, and exposes a Chinese accessible name.
- Avatar updates are documented in the publishing guide through GitHub profile settings; the static site stores no account credential.
- The BGM controller loads a configured playlist, starts only after an explicit user action, persists while navigating between VitePress routes, and exposes keyboard-operable previous/play/next, direct track selection, progress, and volume controls.
- The BGM unavailable state is visible, disables playback, and does not show stale timing information.
- The BGM controller defaults to a 48px note control, exposes real playback progress in its SVG ring, expands on selection, and returns to the compact state after five seconds without interaction while audio continues.
- Playlist switching preserves the current play/pause intent, completed tracks advance automatically, and the selected track is restored locally on reload.

## Visual findings

- Homepage hero matches the baseline apart from the deliberate removal of the public Editor navigation item and music/effect controls.
- Article index now uses clear date, tag, title, and description rows instead of loosely spaced definition-list content.
- About remains display-only and content-led; the avatar is restored in a square one-pixel frame while fake proficiency percentages, password prompts, crop/upload controls, and placeholder contact data remain absent.
- Mobile headings, summaries, tags, project text, and publishing instructions wrap within the viewport.
- Square borders, restrained amber signal color, and mono typography are consistent across the refined content pages.

## Verification

- `npm run build`: passed
- Sitemap generation: passed
- `designmd lint DESIGN.md`: passed with 0 errors and 0 warnings
- Frontend premium strict audit: passed with 0 findings
- Route smoke test: passed
- Edge desktop visual inspection: passed
- Edge mobile visual inspection: passed
- Responsive overflow inspection: passed
- Avatar load, profile destination, keyboard focus, and accessible-name inspection: passed
- BGM metadata/load check: passed (`audio/mpeg`, 5:42)
- BGM play, route persistence, pause, seek/volume controls, and keyboard focus: passed
- BGM missing-file failure state: passed
- BGM compact/expanded states, five-second auto-collapse, timer reset after interaction, progress ring, uninterrupted playback, and focus restoration: passed in Edge
- BGM responsive layout: passed at 1440×900 and 390×844; compact control remains 48×48, expanded panel remains inside the viewport, and no horizontal overflow was introduced
- Four-track playlist loading, previous/next controls, direct selection, automatic continuation, selected-track persistence, and uninterrupted switching while playing: passed in Edge
- Playlist audio metadata: passed (`站点 BGM` 5:42, `明天的云` 1:03, `拾忆` 5:57, `宇宙的不可思议` 2:16)
- Playlist responsive layout: passed at 1440×900, 390×844, and 320×720; all skip controls remain 44px and no horizontal overflow was introduced
- README path and command review: passed
- Article generator success/failure-path tests: passed

final result: passed
