import type { AppProtectionReport, FindingSeverity } from "./types.js";

const SEVERITY_LABEL: Record<FindingSeverity, string> = {
  high: "🔴 high",
  medium: "🟠 medium",
  low: "🟡 low",
  info: "ℹ️  info"
};

const SEVERITY_RANK: Record<FindingSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
  info: 3
};

export function toMarkdown(report: AppProtectionReport): string {
  const lines: string[] = [];
  lines.push(report.ok ? `# Intune app protection ✅` : `# Intune app protection ❌`);
  lines.push(``);
  lines.push(`Generated: \`${report.generatedAt}\``);
  lines.push(``);
  lines.push(`## Assignment posture`);
  lines.push(``);
  lines.push(`- Assignments: **${report.assignments}**`);
  lines.push(
    `- Status: protected=${report.byStatus.protected} · warning=${report.byStatus.warning} · exception=${report.byStatus.exception} · missing=${report.byStatus.missing} · limited=${report.byStatus.limited}`
  );
  lines.push(
    `- Enrollment: managed=${report.byEnrollmentType.managed} · mam-we=${report.byEnrollmentType["mam-we"]} · byod=${report.byEnrollmentType.byod} · contractor=${report.byEnrollmentType.contractor} · shared=${report.byEnrollmentType.shared}`
  );

  const ranked = [...report.findings].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
  );

  if (ranked.length > 0) {
    lines.push(``);
    lines.push(`## Findings (${ranked.length})`);
    lines.push(``);
    lines.push(`| severity | code | app | owner | message |`);
    lines.push(`|---|---|---|---|---|`);
    for (const finding of ranked) {
      lines.push(
        `| ${SEVERITY_LABEL[finding.severity]} | \`${finding.code}\` | ${finding.appName ?? finding.assignmentId} | ${finding.owner ?? "—"} | ${finding.message} |`
      );
    }
  } else {
    lines.push(``);
    lines.push(`No findings.`);
  }

  return lines.join("\n");
}

export function toSummary(report: AppProtectionReport): string {
  const counts: Record<FindingSeverity, number> = { high: 0, medium: 0, low: 0, info: 0 };
  for (const finding of report.findings) counts[finding.severity] += 1;
  return `${report.assignments} assignment${report.assignments === 1 ? "" : "s"} · ${counts.high} high · ${counts.medium} medium · ${counts.info} info (${report.ok ? "ok" : "fail"})`;
}
