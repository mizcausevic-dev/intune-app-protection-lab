import { describe, expect, it } from "vitest";

import {
  enforcementPosture,
  payload,
  policyGaps,
  protectionLane,
  summary,
  verification
} from "./intuneAppProtectionLabService.js";

describe("intuneAppProtectionLabService", () => {
  it("exposes overview metrics", () => {
    expect(summary().assignments).toBe(5);
    expect(summary().highFindings).toBeGreaterThan(0);
  });

  it("returns one protection-lane item per assignment", () => {
    expect(protectionLane()).toHaveLength(5);
    expect(protectionLane()[0]).toHaveProperty("appName");
  });

  it("sorts policy gaps by severity", () => {
    const findings = policyGaps();
    expect(findings[0].severity).toBe("high");
  });

  it("returns remediation packets", () => {
    expect(enforcementPosture().length).toBeGreaterThan(0);
    expect(enforcementPosture()[0]).toHaveProperty("packetId");
  });

  it("includes verification bullets and payload sample", () => {
    expect(verification().length).toBeGreaterThan(2);
    expect(payload()).toHaveProperty("sample");
  });
});
