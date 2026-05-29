import { describe, expect, it } from "vitest";

import {
  renderDocs,
  renderEnforcementPosture,
  renderOverview,
  renderPolicyGaps,
  renderProtectionLane,
  renderVerification
} from "./render.js";

describe("render", () => {
  it("renders the overview shell", () => {
    expect(renderOverview()).toContain("Intune app protection, unmanaged transfer drift");
  });

  it("renders the route-specific views", () => {
    expect(renderProtectionLane()).toContain("Protection Lane");
    expect(renderPolicyGaps()).toContain("Policy Gaps");
    expect(renderEnforcementPosture()).toContain("Enforcement Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderDocs()).toContain("/api/protection-lane");
  });
});
