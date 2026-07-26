#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let errors = [];
let warnings = [];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function req(rel) {
  if (!exists(rel)) errors.push("Missing required file: " + rel);
}
function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

const required = [
  "AGENTS.md",
  "CLAUDE.md",
  ".cursor/rules/00-storify-governance.mdc",
  ".cursor/rules/10-storify-code-quality.mdc",
  ".cursor/rules/20-storify-phase-execution.mdc",
  "docs/README.md",
  "docs/master-plan/STORIFY_MASTER_PLAN.md",
  "docs/master-plan/EXECUTION_ROADMAP.md",
  "docs/master-plan/PHASE_GATES.md",
  "docs/master-plan/MVP_SCOPE.md",
  "docs/master-plan/LONG_TERM_SCOPE.md",
  "docs/master-plan/MASTER_PLAN_CHANGELOG.md",
  "docs/status/CURRENT_STATE.md",
  "docs/status/IMPLEMENTATION_STATUS.md",
  "docs/status/IMPLEMENTATION_MATRIX.yaml",
  "docs/status/ACTIVE_PHASE.md",
  "docs/status/BLOCKERS.md",
  "docs/status/EXTERNAL_DEPENDENCIES.md",
  "docs/status/DECISIONS_NEEDED.md",
  "docs/status/COMPLETION_EVIDENCE.md",
  "docs/status/RISKS.md",
  "docs/status/STATUS_CHANGELOG.md",
  "docs/handoffs/AGENT_HANDOFF.md",
  "docs/execution/PHASE_INDEX.md",
  "docs/project-audit/STORIFY_AUDIT_REPORT.md",
  "docs/project-audit/STORIFY_MASTER_PLAN_INPUT.md",
  "docs/adr/README.md",
];

for (const f of required) req(f);

const phaseFiles = [
  "PHASE_00_GOVERNANCE.md",
  "PHASE_01_RESCUE_AND_SECURITY.md",
  "PHASE_02_MULTI_TENANT_FOUNDATION.md",
  "PHASE_03_COMMERCE_CORE.md",
  "PHASE_04_MERCHANT_ADMIN.md",
  "PHASE_05_STOREFRONT_BUILDER.md",
  "PHASE_06_EGYPT_MENA_PILOT.md",
  "PHASE_07_AI_NATIVE_PLATFORM.md",
  "PHASE_08_AUTOMATION_OMNICHANNEL.md",
  "PHASE_09_POS_INDUSTRY_PACKS.md",
  "PHASE_10_B2B_INTERNATIONAL.md",
  "PHASE_11_DEVELOPER_PLATFORM.md",
  "PHASE_12_BUYER_NETWORK.md",
  "PHASE_13_ENTERPRISE_SCALE.md",
];
for (const f of phaseFiles) req("docs/execution/" + f);

for (let i = 1; i <= 12; i++) {
  const prefix = "docs/adr/ADR-" + String(i).padStart(4, "0") + "-";
  const dir = path.join(root, "docs/adr");
  const found = fs.readdirSync(dir).some((n) => n.startsWith("ADR-" + String(i).padStart(4, "0") + "-"));
  if (!found) errors.push("Missing ADR: " + prefix + "*");
}

const auditFiles = [
  "STORIFY_EXECUTIVE_STATUS.md",
  "STORIFY_FEATURE_INVENTORY.md",
  "STORIFY_ROUTE_INVENTORY.md",
  "STORIFY_DATABASE_AUDIT.md",
  "STORIFY_UI_UX_AUDIT.md",
  "STORIFY_SECURITY_AUDIT.md",
  "STORIFY_TECHNICAL_DEBT.md",
  "STORIFY_DEPLOYMENT_READINESS.md",
  "STORIFY_REMAINING_WORK_BACKLOG.md",
  "STORIFY_MASTER_PLAN_INPUT.md",
  "STORIFY_AUDIT_REPORT.md",
];
for (const f of auditFiles) req("docs/project-audit/" + f);

const headings = [
  "## 1. Phase number and name",
  "## 5. Entry criteria",
  "## 6. Scope",
  "## 7. Explicit non-scope",
  "## 22. Acceptance criteria",
  "## 23. Phase exit gate",
  "## 27. Forbidden shortcuts",
];
for (const f of phaseFiles) {
  const body = read("docs/execution/" + f);
  for (const h of headings) {
    if (!body.includes(h)) errors.push(f + " missing heading: " + h);
  }
}

// YAML-ish parse of matrix without dependency
try {
  const y = read("docs/status/IMPLEMENTATION_MATRIX.yaml");
  if (!/active_phase:\s*0\b/.test(y) && !/active_phase:\s*0\n/.test(y)) {
    // allow active_phase: 0
  }
  if (!y.includes("active_phase:")) errors.push("IMPLEMENTATION_MATRIX.yaml missing active_phase");
  if (!y.includes("audited_commit:")) errors.push("IMPLEMENTATION_MATRIX.yaml missing audited_commit");
  const phaseIds = [...y.matchAll(/- id:\s*(\d+)/g)].map((m) => Number(m[1]));
  for (let i = 0; i <= 13; i++) {
    if (!phaseIds.includes(i)) errors.push("IMPLEMENTATION_MATRIX.yaml missing phase id " + i);
  }
  const inProgress = [...y.matchAll(/status:\s*(\w+)/g)].map((m) => m[1]);
  void inProgress;
  // crude: ensure not multiple IN_PROGRESS on phases other than documenting — warn if >2 IN_PROGRESS
  const ip = (y.match(/status:\s*IN_PROGRESS/g) || []).length;
  if (ip > 1) warnings.push("Multiple IN_PROGRESS statuses in matrix (" + ip + ")");
} catch (e) {
  errors.push("Cannot read IMPLEMENTATION_MATRIX.yaml: " + e.message);
}

const active = read("docs/status/ACTIVE_PHASE.md");
const phase00Verified =
  /Phase\s*00.*VERIFIED/i.test(active) || /00 status:.*VERIFIED/i.test(active);
if (!active.includes("00") && !phase00Verified) {
  errors.push("ACTIVE_PHASE.md does not declare phase 00");
}
// Phase 01 may be active only after Phase 00 is verified
if (
  /Phase\s*\*\*01\*\*.*IN_PROGRESS/i.test(active) &&
  !phase00Verified &&
  !active.includes("01 — Rescue")
) {
  errors.push("Phase 01 must not be active during Phase 00 docs establishment");
}

// Broken relative links (markdown](./ or ../) simple existence check
function checkLinks(relFile) {
  const body = read(relFile);
  const dir = path.dirname(path.join(root, relFile));
  const re = /\]\((\.\.?\/[^)#\s]+)(?:#[^)]*)?\)/g;
  let m;
  while ((m = re.exec(body))) {
    const target = path.normalize(path.join(dir, m[1]));
    if (!fs.existsSync(target)) warnings.push("Broken link in " + relFile + " -> " + m[1]);
  }
}
for (const f of ["docs/README.md", "docs/master-plan/STORIFY_MASTER_PLAN.md", "AGENTS.md"]) {
  if (exists(f)) checkLinks(f);
}

console.log("Storify docs validation");
if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((w) => console.log("  !", w));
}
if (errors.length) {
  console.log("Errors:");
  errors.forEach((e) => console.log("  x", e));
  process.exit(1);
}
console.log("OK — all required documents present; phase headings OK; matrix parseable.");
process.exit(0);
