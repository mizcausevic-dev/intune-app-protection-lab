import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze, normalizeInput } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { AppProtectionAssignment, AppProtectionInput } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): AppProtectionInput =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as AppProtectionInput;

const NOW = "2026-05-29T08:00:00Z";

describe("analyze", () => {
  it("counts assignments and groups by status / enrollment / platform", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW });
    expect(report.assignments).toBe(5);
    expect(report.byStatus.protected).toBe(1);
    expect(report.byStatus.warning).toBe(1);
    expect(report.byStatus.exception).toBe(1);
    expect(report.byStatus.missing).toBe(1);
    expect(report.byEnrollmentType.byod).toBe(2);
    expect(report.byPlatform.iOS).toBe(3);
  });

  it("flags missing assignments as high", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW });
    const finding = report.findings.find((item) => item.code === "missing-protection-assignment");
    expect(finding?.severity).toBe("high");
    expect(finding?.appName).toBe("Workday");
  });

  it("flags unmanaged transfer routes", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW });
    const finding = report.findings.find((item) => item.code === "unmanaged-transfer-allowed" && item.appName === "Salesforce");
    expect(finding?.severity).toBe("high");
  });

  it("flags missing user-presence control", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW });
    const finding = report.findings.find((item) => item.code === "missing-user-presence-control" && item.appName === "Workday");
    expect(finding?.severity).toBe("high");
  });

  it("flags stale policy sync beyond threshold", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW, staleAfterDays: 14 });
    const finding = report.findings.find((item) => item.code === "stale-policy-sync" && item.appName === "Salesforce");
    expect(finding?.severity).toBe("high");
  });

  it("flags outdated policy versions", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW });
    const finding = report.findings.find((item) => item.code === "outdated-policy-version" && item.appName === "Teams Mobile");
    expect(finding?.severity).toBe("medium");
  });

  it("flags managed browser and conditional-launch gaps", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW });
    expect(report.findings.find((item) => item.code === "missing-managed-browser" && item.appName === "Teams Mobile")).toBeDefined();
    expect(report.findings.find((item) => item.code === "weak-conditional-launch" && item.appName === "Workday")).toBeDefined();
  });

  it("flags jailbreak access and oversized offline grace", () => {
    const report = analyze(fixture("app-protection.json"), { now: NOW });
    expect(report.findings.find((item) => item.code === "jailbreak-access-allowed" && item.appName === "Salesforce")?.severity).toBe("high");
    expect(report.findings.find((item) => item.code === "oversized-offline-grace-period" && item.appName === "OneDrive")?.severity).toBe("medium");
  });

  it("returns ok=true on a clean fixture", () => {
    const report = analyze(fixture("app-protection-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findings.filter((item) => item.severity === "high")).toEqual([]);
  });
});

describe("normalizeInput", () => {
  it("accepts single, array, and envelope shapes", () => {
    const assignment: AppProtectionAssignment = {
      id: "a",
      appName: "Outlook",
      appSuite: "Microsoft 365",
      owner: "Messaging",
      persona: "Leaders",
      lane: "Exec",
      platform: "iOS",
      protectionStatus: "protected",
      enrollmentType: "byod",
      policyName: "Policy",
      policyVersion: 1,
      expectedPolicyVersion: 1,
      pinRequired: true,
      biometricRequired: true,
      encryptBackup: true,
      blockSaveAs: true,
      blockCopyPasteToPersonalApps: true,
      requireManagedBrowser: true,
      conditionalLaunchLevel: "strict",
      jailbreakAccessAllowed: false,
      wipeAfterOfflineDays: 7,
      recommendedMaxOfflineDays: 7
    };

    expect(normalizeInput(assignment)).toEqual([assignment]);
    expect(normalizeInput([assignment])).toEqual([assignment]);
    expect(normalizeInput({ value: [assignment] })).toEqual([assignment]);
  });
});

describe("formatters", () => {
  it("renders markdown with high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("app-protection.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("ℹ️"));
  });

  it("renders clean markdown and summary", () => {
    const report = analyze(fixture("app-protection-clean.json"), { now: NOW });
    expect(toMarkdown(report)).toContain("✅");
    expect(toMarkdown(report)).toContain("No findings.");
    expect(toSummary(report)).toMatch(/^2 assignments/);
  });
});
