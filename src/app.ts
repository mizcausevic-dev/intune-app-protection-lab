// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  enforcementPosture,
  payload,
  policyGaps,
  protectionLane,
  summary,
  verification
} from "./services/intuneAppProtectionLabService.js";
import {
  renderDocs,
  renderEnforcementPosture,
  renderOverview,
  renderPolicyGaps,
  renderProtectionLane,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5512);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/protection-lane", (_req, res) => res.type("html").send(renderProtectionLane()));
app.get("/policy-gaps", (_req, res) => res.type("html").send(renderPolicyGaps()));
app.get("/enforcement-posture", (_req, res) => res.type("html").send(renderEnforcementPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/protection-lane", (_req, res) => res.json(protectionLane()));
app.get("/api/policy-gaps", (_req, res) => res.json(policyGaps()));
app.get("/api/enforcement-posture", (_req, res) => res.json(enforcementPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Intune App Protection Lab listening on http://${host}:${port}`);
  });
}

export default app;
