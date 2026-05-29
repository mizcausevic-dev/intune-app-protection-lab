# Changelog

## v0.1.0 — 2026-05-28

- Initial release: operator control plane for Microsoft Intune app protection.
- Public dashboard routes for `/`, `/protection-lane`, `/policy-gaps`, `/enforcement-posture`, `/verification`, and `/docs`.
- Static GitHub Pages deploy with `CNAME`, `robots.txt`, `sitemap.xml`, OG/Twitter meta generation, and README proof screenshots.
- Reads synthetic app-protection assignment packets (single assignment, array, or `{ "value": [ ... ] }` envelope).
- 10 finding codes covering missing assignment, unmanaged transfer, weak user-presence controls, stale sync, outdated policy versions, missing managed browser, weak conditional launch, jailbreak access, outdated app SDK, and oversized offline grace periods.
- Library API: `analyze(input, opts)` → `AppProtectionReport`; `toMarkdown(report)` + `toSummary(report)` formatters.
- CLI: `intune-app-protection <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-after-days N`, `--fail-on-high`, `--out FILE`.
- Identity / endpoint expansion lane — sibling of `intune-device-compliance-ops`, `entra-access-review-control-plane`, and `conditional-access-posture-board`.
- Node 20/22 CI (lint, typecheck, coverage, build, demo, smoke), AGPL-3.0-or-later, Dependabot.
