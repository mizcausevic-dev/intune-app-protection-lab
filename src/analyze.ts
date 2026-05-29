// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  AppProtectionAssignment,
  AppProtectionInput,
  AppProtectionOptions,
  AppProtectionReport,
  EnrollmentType,
  Finding,
  Platform,
  ProtectionStatus
} from "./types.js";

const DAY_MS = 86_400_000;

const STATUSES: ProtectionStatus[] = ["protected", "warning", "exception", "missing", "limited"];
const PLATFORMS: Platform[] = ["iOS", "Android", "Windows", "Web"];
const ENROLLMENT_TYPES: EnrollmentType[] = ["managed", "mam-we", "byod", "contractor", "shared"];

function emptyMap<T extends string>(values: readonly T[]): Record<T, number> {
  const out = {} as Record<T, number>;
  for (const value of values) out[value] = 0;
  return out;
}

export function normalizeInput(input: AppProtectionInput): AppProtectionAssignment[] {
  if (Array.isArray(input)) return input;
  if ("value" in input && Array.isArray((input as { value: AppProtectionAssignment[] }).value)) {
    return (input as { value: AppProtectionAssignment[] }).value;
  }
  return [input as AppProtectionAssignment];
}

function compareVersion(left: string | undefined, right: string | undefined): number {
  if (!left || !right) return 0;
  const a = left.split(/[.\s-]/).map((item) => Number.parseInt(item, 10) || 0);
  const b = right.split(/[.\s-]/).map((item) => Number.parseInt(item, 10) || 0);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const av = a[index] ?? 0;
    const bv = b[index] ?? 0;
    if (av < bv) return -1;
    if (av > bv) return 1;
  }
  return 0;
}

export function analyze(input: AppProtectionInput, opts: AppProtectionOptions = {}): AppProtectionReport {
  const now = opts.now ? new Date(opts.now) : new Date();
  const staleAfter = (opts.staleAfterDays ?? 14) * DAY_MS;

  const assignments = normalizeInput(input);
  const findings: Finding[] = [];
  const byStatus = emptyMap(STATUSES);
  const byPlatform = emptyMap(PLATFORMS);
  const byEnrollmentType = emptyMap(ENROLLMENT_TYPES);

  for (const assignment of assignments) {
    byStatus[assignment.protectionStatus] += 1;
    byPlatform[assignment.platform] += 1;
    byEnrollmentType[assignment.enrollmentType] += 1;

    const finding = (code: Finding["code"], severity: Finding["severity"], message: string): Finding => ({
      code,
      severity,
      message,
      assignmentId: assignment.id,
      appName: assignment.appName,
      owner: assignment.owner
    });

    if (assignment.protectionStatus === "missing") {
      findings.push(
        finding(
          "missing-protection-assignment",
          "high",
          "App route is still outside the protection policy envelope."
        )
      );
    }

    if (!assignment.blockCopyPasteToPersonalApps || !assignment.blockSaveAs) {
      findings.push(
        finding(
          "unmanaged-transfer-allowed",
          assignment.protectionStatus === "exception" ? "high" : "medium",
          "Managed data can still leave the governed container through copy/paste or Save As."
        )
      );
    }

    if (!assignment.pinRequired && !assignment.biometricRequired) {
      findings.push(
        finding(
          "missing-user-presence-control",
          "high",
          "The assignment does not require PIN or biometric re-entry before app access."
        )
      );
    }

    if (assignment.lastPolicySyncDateTime) {
      const age = now.getTime() - new Date(assignment.lastPolicySyncDateTime).getTime();
      if (age > staleAfter) {
        findings.push(
          finding(
            "stale-policy-sync",
            age > staleAfter * 2 ? "high" : "medium",
            `Policy sync is ${Math.round(age / DAY_MS)} day(s) old and outside the expected review window.`
          )
        );
      }
    }

    if (assignment.policyVersion < assignment.expectedPolicyVersion) {
      findings.push(
        finding(
          "outdated-policy-version",
          "medium",
          `Assignment is on policy v${assignment.policyVersion} while v${assignment.expectedPolicyVersion} is the expected baseline.`
        )
      );
    }

    if (!assignment.requireManagedBrowser && (assignment.platform === "iOS" || assignment.platform === "Android")) {
      findings.push(
        finding(
          "missing-managed-browser",
          "medium",
          "Links can still open outside the managed browser path on mobile devices."
        )
      );
    }

    if (assignment.conditionalLaunchLevel === "none") {
      findings.push(
        finding(
          "weak-conditional-launch",
          "medium",
          "Conditional launch controls are effectively disabled for this assignment."
        )
      );
    }

    if (assignment.jailbreakAccessAllowed) {
      findings.push(
        finding(
          "jailbreak-access-allowed",
          "high",
          "Jailbroken or rooted devices can still open the protected app surface."
        )
      );
    }

    if (compareVersion(assignment.appSdkVersion, assignment.minimumSdkVersion) < 0) {
      findings.push(
        finding(
          "outdated-app-sdk",
          "medium",
          `App SDK ${assignment.appSdkVersion ?? "unknown"} is below the minimum ${assignment.minimumSdkVersion}.`
        )
      );
    }

    if (assignment.wipeAfterOfflineDays > assignment.recommendedMaxOfflineDays) {
      findings.push(
        finding(
          "oversized-offline-grace-period",
          "medium",
          `Offline wipe grace is ${assignment.wipeAfterOfflineDays} day(s); the recommended cap is ${assignment.recommendedMaxOfflineDays}.`
        )
      );
    }

    if (
      assignment.enrollmentType === "byod" &&
      (assignment.protectionStatus === "protected" || assignment.protectionStatus === "warning")
    ) {
      findings.push(
        finding(
          "byod-protection-lane",
          "info",
          "BYOD assignment is inside the protection envelope; keep scope and user messaging aligned."
        )
      );
    }
  }

  const ok = !findings.some((item) => item.severity === "high");

  return {
    generatedAt: now.toISOString(),
    assignments: assignments.length,
    byStatus,
    byPlatform,
    byEnrollmentType,
    findings,
    ok
  };
}
