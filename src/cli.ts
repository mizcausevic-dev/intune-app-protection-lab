#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { analyze } from "./analyze.js";
import { toMarkdown, toSummary } from "./format.js";
import type { AppProtectionInput, AppProtectionOptions } from "./types.js";

type Format = "json" | "markdown" | "summary";

interface Args {
  input?: string;
  format: Format;
  now?: string;
  staleAfterDays?: number;
  failOnHigh: boolean;
  out?: string;
  help: boolean;
}

const FORMATS: Format[] = ["json", "markdown", "summary"];

function parseArgs(argv: string[]): Args {
  const args: Args = { format: "json", failOnHigh: false, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "-h" || value === "--help") args.help = true;
    else if (value === "--format") {
      const format = argv[++index] as Format;
      if (!FORMATS.includes(format)) throw new Error(`--format must be one of: ${FORMATS.join(", ")}`);
      args.format = format;
    } else if (value === "--now") args.now = argv[++index];
    else if (value === "--stale-after-days") args.staleAfterDays = Number(argv[++index]);
    else if (value === "--fail-on-high") args.failOnHigh = true;
    else if (value === "--out") args.out = argv[++index];
    else if (!value.startsWith("-")) args.input = value;
    else throw new Error(`Unknown option: ${value}`);
  }
  return args;
}

const HELP = `intune-app-protection-lab — analyze Microsoft Intune app-protection posture exports

Usage:
  intune-app-protection <export.json> [--format json|markdown|summary]
                                      [--now <iso>] [--stale-after-days N]
                                      [--fail-on-high] [--out FILE]

Input:
  Synthetic app-protection assignment packets — single assignment, array,
  or the standard \`{ "value": [ ... ] }\` collection envelope.

Findings:
  - high     missing-protection-assignment, unmanaged-transfer-allowed,
             missing-user-presence-control, jailbreak-access-allowed,
             stale-policy-sync beyond 2×N days.
  - medium   stale-policy-sync between N and 2N days, outdated-policy-version,
             missing-managed-browser, weak-conditional-launch,
             outdated-app-sdk, oversized-offline-grace-period.
  - info     byod-protection-lane.

Exit code:
  0 — no high findings (or --fail-on-high not set)
  1 — high finding AND --fail-on-high set
  2 — usage / I/O error`;

export function run(argv: string[]): number {
  let args: Args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    return 2;
  }

  if (args.help || !args.input) {
    process.stdout.write(`${HELP}\n`);
    return args.help ? 0 : 2;
  }

  let payload: AppProtectionInput;
  try {
    payload = JSON.parse(readFileSync(args.input, "utf8")) as AppProtectionInput;
  } catch (error) {
    process.stderr.write(`error reading input: ${(error as Error).message}\n`);
    return 2;
  }

  const options: AppProtectionOptions = {};
  if (args.now) options.now = args.now;
  if (args.staleAfterDays !== undefined) options.staleAfterDays = args.staleAfterDays;

  const report = analyze(payload, options);
  const output =
    args.format === "json"
      ? JSON.stringify(report, null, 2)
      : args.format === "markdown"
        ? toMarkdown(report)
        : toSummary(report);

  if (args.out) writeFileSync(args.out, `${output}\n`, "utf8");
  else process.stdout.write(`${output}\n`);

  if (args.failOnHigh && !report.ok) return 1;
  return 0;
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  try {
    process.exit(run(process.argv.slice(2)));
  } catch (error) {
    process.stderr.write(`fatal: ${(error as Error).message}\n`);
    process.exit(2);
  }
}
