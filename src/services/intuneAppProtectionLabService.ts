// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze, normalizeInput } from "../analyze.js";
import {
  enforcementPackets,
  protectionLanePackets,
  sampleAppProtectionPayload
} from "../data/sampleAppProtection.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-29T00:00:00Z";
const report = analyze(sampleAppProtectionPayload, {
  now: NOW,
  staleAfterDays: 14
});
const assignments = normalizeInput(sampleAppProtectionPayload);

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    assignments: report.assignments,
    protectedApps: report.byStatus.protected,
    blockingPolicyGaps: report.byStatus.missing + report.byStatus.exception,
    stalePolicies: report.findings.filter((finding) => finding.code === "stale-policy-sync").length,
    byodAssignments: report.byEnrollmentType.byod,
    highFindings: report.findings.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Close unmanaged-transfer exceptions and missing app assignments first so BYOD growth does not outrun protection posture."
  };
}

export function protectionLane() {
  return assignments.map((assignment) => {
    const packet = protectionLanePackets.find((item) => item.assignmentId === assignment.id);
    const relatedFindings = report.findings.filter((finding) => finding.assignmentId === assignment.id);
    const severity =
      relatedFindings.find((finding) => finding.severity === "high") !== undefined
        ? "red"
        : relatedFindings.find((finding) => finding.severity === "medium") !== undefined
          ? "yellow"
          : "green";

    return {
      assignmentId: assignment.id,
      appName: assignment.appName,
      owner: packet?.owner ?? assignment.owner,
      lane: packet?.lane ?? assignment.lane,
      businessRole: packet?.businessRole ?? assignment.persona,
      platform: assignment.platform,
      protectionStatus: assignment.protectionStatus,
      severity,
      findingCount: relatedFindings.length,
      nextAction: packet?.nextAction ?? "Review policy assignment and attach operator evidence.",
      note: packet?.note ?? assignment.note ?? "Synthetic app protection sample lane."
    };
  });
}

export function policyGaps() {
  return [...report.findings]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => {
      const assignment = assignments.find((item) => item.id === finding.assignmentId);
      return {
        ...finding,
        owner: assignment?.owner ?? finding.owner ?? "Endpoint Platform",
        platform: assignment?.platform ?? "Web",
        protectionStatus: assignment?.protectionStatus ?? "warning"
      };
    });
}

export function enforcementPosture() {
  return enforcementPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline analyzer and CLI, not static marketing copy.",
    "Intune app protection posture is rendered with synthetic sample data only; no tenant export or token is published.",
    "Protection lane, policy gap, and enforcement packet views stay buyer-readable for Intune, Microsoft 365, security, and endpoint teams.",
    "This surface demonstrates mobile application management and data-protection operations, not a generic cloud lab.",
    "It composes cleanly with Entra, Intune device, and conditional-access proof for a stronger recruiter-facing Microsoft admin lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    protectionLane: protectionLane(),
    policyGaps: policyGaps(),
    enforcementPosture: enforcementPosture(),
    verification: verification(),
    sample: sampleAppProtectionPayload
  };
}
