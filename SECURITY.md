# Security Policy

`intune-app-protection-lab` includes an offline analyzer, CLI, and public synthetic operator dashboard for Microsoft Intune app-protection posture. It does **not** store Graph tokens, perform live tenant fetches, or expose authenticated write paths.

The input material may contain app names, owner teams, rollout notes, and protection-policy details. Treat captured tenant exports and generated reports as sensitive operator material.

## Supported versions

Only the latest tagged release is supported.

## Operational posture

- public Pages deployment uses **synthetic sample data only**
- no tenant credentials or live Graph exports are committed
- this repo is intended for operator-surface demonstration and offline analysis patterns
- embedded or production tenant integrations require formal tenant review and secret-handling controls

## Reporting a vulnerability

Please use GitHub Security Advisories for private disclosure:

- [Open a security advisory](https://github.com/mizcausevic-dev/intune-app-protection-lab/security/advisories/new)

Do not file public issues for security reports.
