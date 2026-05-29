// SPDX-License-Identifier: AGPL-3.0-or-later
// Operator surface for Microsoft Intune app protection.
// Input: synthetic policy-assignment packets modeled after Intune MAM posture.

export type Platform = "iOS" | "Android" | "Windows" | "Web";
export type ProtectionStatus = "protected" | "warning" | "exception" | "missing" | "limited";
export type EnrollmentType = "managed" | "mam-we" | "byod" | "contractor" | "shared";
export type ConditionalLaunchLevel = "strict" | "moderate" | "none";

export interface AppProtectionAssignment {
  id: string;
  appName: string;
  appSuite: string;
  owner: string;
  persona: string;
  lane: string;
  platform: Platform;
  protectionStatus: ProtectionStatus;
  enrollmentType: EnrollmentType;
  policyName: string;
  policyVersion: number;
  expectedPolicyVersion: number;
  lastPolicySyncDateTime?: string;
  pinRequired: boolean;
  biometricRequired: boolean;
  encryptBackup: boolean;
  blockSaveAs: boolean;
  blockCopyPasteToPersonalApps: boolean;
  requireManagedBrowser: boolean;
  appSdkVersion?: string;
  minimumSdkVersion?: string;
  conditionalLaunchLevel: ConditionalLaunchLevel;
  jailbreakAccessAllowed: boolean;
  wipeAfterOfflineDays: number;
  recommendedMaxOfflineDays: number;
  note?: string;
}

export type AppProtectionInput =
  | AppProtectionAssignment
  | AppProtectionAssignment[]
  | { value: AppProtectionAssignment[] };

export type FindingCode =
  | "missing-protection-assignment"
  | "unmanaged-transfer-allowed"
  | "missing-user-presence-control"
  | "stale-policy-sync"
  | "outdated-policy-version"
  | "missing-managed-browser"
  | "weak-conditional-launch"
  | "jailbreak-access-allowed"
  | "outdated-app-sdk"
  | "oversized-offline-grace-period"
  | "byod-protection-lane";

export type FindingSeverity = "high" | "medium" | "low" | "info";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  assignmentId: string;
  appName?: string;
  owner?: string;
}

export interface AppProtectionOptions {
  now?: string | Date;
  staleAfterDays?: number;
}

export interface AppProtectionReport {
  generatedAt: string;
  assignments: number;
  byStatus: Record<ProtectionStatus, number>;
  byPlatform: Record<Platform, number>;
  byEnrollmentType: Record<EnrollmentType, number>;
  findings: Finding[];
  ok: boolean;
}
