import {
  policyGaps,
  protectionLane,
  summary
} from "../src/services/intuneAppProtectionLabService.js";

console.log("intune-app-protection-lab demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(
  JSON.stringify(
    protectionLane().map((lane) => ({
      appName: lane.appName,
      owner: lane.owner,
      protectionStatus: lane.protectionStatus
    })),
    null,
    2
  )
);
console.log(JSON.stringify(policyGaps().slice(0, 3), null, 2));
