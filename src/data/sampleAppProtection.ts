// SPDX-License-Identifier: AGPL-3.0-or-later

import type { AppProtectionInput } from "../types.js";

export interface ProtectionLanePacket {
  assignmentId: string;
  owner: string;
  lane: string;
  businessRole: string;
  nextAction: string;
  note: string;
}

export interface EnforcementPacket {
  packetId: string;
  lane: string;
  owner: string;
  status: "green" | "yellow" | "red";
  completenessScore: number;
  blocker: string;
  launchWindowHours: number;
  decisionNote: string;
}

export const sampleAppProtectionPayload: AppProtectionInput = {
  value: [
    {
      id: "app-outlook-ios",
      appName: "Outlook Mobile",
      appSuite: "Microsoft 365",
      owner: "Workplace Messaging",
      persona: "Field leadership",
      lane: "Executive collaboration",
      platform: "iOS",
      protectionStatus: "protected",
      enrollmentType: "byod",
      policyName: "M365 Executive BYOD",
      policyVersion: 7,
      expectedPolicyVersion: 7,
      lastPolicySyncDateTime: "2026-05-26T12:00:00Z",
      pinRequired: true,
      biometricRequired: true,
      encryptBackup: true,
      blockSaveAs: true,
      blockCopyPasteToPersonalApps: true,
      requireManagedBrowser: true,
      appSdkVersion: "20.3.0",
      minimumSdkVersion: "20.0.0",
      conditionalLaunchLevel: "strict",
      jailbreakAccessAllowed: false,
      wipeAfterOfflineDays: 7,
      recommendedMaxOfflineDays: 7,
      note: "Healthy BYOD lane with managed browser and wipe posture."
    },
    {
      id: "app-teams-android",
      appName: "Teams Mobile",
      appSuite: "Microsoft 365",
      owner: "Frontline Operations",
      persona: "Regional managers",
      lane: "Frontline coordination",
      platform: "Android",
      protectionStatus: "warning",
      enrollmentType: "mam-we",
      policyName: "Frontline Android MAM",
      policyVersion: 4,
      expectedPolicyVersion: 5,
      lastPolicySyncDateTime: "2026-05-08T09:00:00Z",
      pinRequired: true,
      biometricRequired: false,
      encryptBackup: true,
      blockSaveAs: true,
      blockCopyPasteToPersonalApps: true,
      requireManagedBrowser: false,
      appSdkVersion: "18.1.0",
      minimumSdkVersion: "18.4.0",
      conditionalLaunchLevel: "moderate",
      jailbreakAccessAllowed: false,
      wipeAfterOfflineDays: 14,
      recommendedMaxOfflineDays: 7,
      note: "Older Android policy version still active during staged rollout."
    },
    {
      id: "app-salesforce-ios",
      appName: "Salesforce",
      appSuite: "Go-to-market",
      owner: "Revenue Systems",
      persona: "Contractor sellers",
      lane: "Contractor access boundary",
      platform: "iOS",
      protectionStatus: "exception",
      enrollmentType: "contractor",
      policyName: "Contractor CRM Exception",
      policyVersion: 2,
      expectedPolicyVersion: 4,
      lastPolicySyncDateTime: "2026-04-20T08:00:00Z",
      pinRequired: false,
      biometricRequired: false,
      encryptBackup: false,
      blockSaveAs: false,
      blockCopyPasteToPersonalApps: false,
      requireManagedBrowser: false,
      appSdkVersion: "16.2.0",
      minimumSdkVersion: "18.0.0",
      conditionalLaunchLevel: "none",
      jailbreakAccessAllowed: true,
      wipeAfterOfflineDays: 30,
      recommendedMaxOfflineDays: 7,
      note: "Legacy exception lane needs containment before broader seller rollout."
    },
    {
      id: "app-workday-android",
      appName: "Workday",
      appSuite: "HR",
      owner: "People Systems",
      persona: "Employee self-service",
      lane: "BYOD HR apps",
      platform: "Android",
      protectionStatus: "missing",
      enrollmentType: "byod",
      policyName: "Pending Android HR",
      policyVersion: 0,
      expectedPolicyVersion: 3,
      lastPolicySyncDateTime: "2026-05-05T15:00:00Z",
      pinRequired: false,
      biometricRequired: false,
      encryptBackup: false,
      blockSaveAs: false,
      blockCopyPasteToPersonalApps: false,
      requireManagedBrowser: false,
      appSdkVersion: "17.0.0",
      minimumSdkVersion: "17.0.0",
      conditionalLaunchLevel: "none",
      jailbreakAccessAllowed: false,
      wipeAfterOfflineDays: 21,
      recommendedMaxOfflineDays: 7,
      note: "Android app was published before the matching protection policy assignment."
    },
    {
      id: "app-onedrive-ios",
      appName: "OneDrive",
      appSuite: "Microsoft 365",
      owner: "Endpoint Platform",
      persona: "Finance mobile access",
      lane: "Finance document lane",
      platform: "iOS",
      protectionStatus: "limited",
      enrollmentType: "managed",
      policyName: "Finance iOS Docs",
      policyVersion: 6,
      expectedPolicyVersion: 6,
      lastPolicySyncDateTime: "2026-05-18T10:30:00Z",
      pinRequired: true,
      biometricRequired: true,
      encryptBackup: true,
      blockSaveAs: true,
      blockCopyPasteToPersonalApps: true,
      requireManagedBrowser: true,
      appSdkVersion: "19.4.0",
      minimumSdkVersion: "19.4.0",
      conditionalLaunchLevel: "strict",
      jailbreakAccessAllowed: false,
      wipeAfterOfflineDays: 10,
      recommendedMaxOfflineDays: 7,
      note: "Document lane is stable but still carrying a longer offline grace than policy owners want."
    }
  ]
};

export const protectionLanePackets: ProtectionLanePacket[] = [
  {
    assignmentId: "app-outlook-ios",
    owner: "Workplace Messaging",
    lane: "Executive collaboration",
    businessRole: "Board and leadership communications",
    nextAction: "Keep BYOD scope current and preserve managed-browser continuity.",
    note: "Healthy lane with no blocking findings."
  },
  {
    assignmentId: "app-teams-android",
    owner: "Frontline Operations",
    lane: "Frontline coordination",
    businessRole: "Regional manager mobile collaboration",
    nextAction: "Advance policy v5 and close the managed-browser gap before wider Android expansion.",
    note: "Stale sync and policy drift are starting to stack."
  },
  {
    assignmentId: "app-salesforce-ios",
    owner: "Revenue Systems",
    lane: "Contractor access boundary",
    businessRole: "CRM access for external sellers",
    nextAction: "Remove the exception lane or isolate it behind stricter launch controls immediately.",
    note: "This is the riskiest route in the current sample."
  },
  {
    assignmentId: "app-workday-android",
    owner: "People Systems",
    lane: "BYOD HR apps",
    businessRole: "Employee self-service on personal devices",
    nextAction: "Attach the Android app to the approved policy envelope before broader publish.",
    note: "Missing assignment and weak enforcement stack together."
  },
  {
    assignmentId: "app-onedrive-ios",
    owner: "Endpoint Platform",
    lane: "Finance document lane",
    businessRole: "Sensitive document access on managed devices",
    nextAction: "Shorten offline grace to the target wipe window and keep finance documents in the protected lane.",
    note: "Mostly healthy but still outside the preferred offline threshold."
  }
];

export const enforcementPackets: EnforcementPacket[] = [
  {
    packetId: "ipr-17",
    lane: "Contractor access boundary",
    owner: "Revenue Systems",
    status: "red",
    completenessScore: 42,
    blocker: "Legacy exception still allows unmanaged transfer and rooted-device access.",
    launchWindowHours: 18,
    decisionNote: "Do not expand contractor CRM access until the exception is narrowed or retired."
  },
  {
    packetId: "ipr-24",
    lane: "BYOD HR apps",
    owner: "People Systems",
    status: "red",
    completenessScore: 37,
    blocker: "Android HR app is live without a matching protection assignment.",
    launchWindowHours: 12,
    decisionNote: "Attach policy coverage before any employee-wide communication goes out."
  },
  {
    packetId: "ipr-31",
    lane: "Frontline coordination",
    owner: "Frontline Operations",
    status: "yellow",
    completenessScore: 71,
    blocker: "Outdated policy version and mobile browser control drift remain open.",
    launchWindowHours: 30,
    decisionNote: "Safe to continue in the pilot lane, but not for broad frontline adoption yet."
  },
  {
    packetId: "ipr-38",
    lane: "Finance document lane",
    owner: "Endpoint Platform",
    status: "yellow",
    completenessScore: 84,
    blocker: "Offline wipe grace is still longer than the finance target.",
    launchWindowHours: 48,
    decisionNote: "Close the grace-period delta before moving this lane to fully governed status."
  }
];
