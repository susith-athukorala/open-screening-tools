/* Offline checks for the FHIR pilot. This is NOT a substitute for the HL7 FHIR Validator
 * or a real SDC $extract engine; it checks structure and the specific expressions used here.
 * Usage: node tests/fhir.test.js <qr.json> [...]
 */
const fs = require("fs"), path = require("path");
let fails = 0;
const ok = (name, cond, extra) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (extra ? " -> " + extra : "")); };
const qdir = path.join(__dirname, "..", "fhir", "Questionnaire");

// --- tiny evaluator for the expression forms used in our Questionnaires ---
function itemAnswer(qr, linkId) { const it = qr.item.find(i => i.linkId === linkId); return it && it.answer && it.answer[0]; }
function weightOf(q, linkId, coding) {
  const it = q.item.find(i => i.linkId === linkId);
  const opt = it.answerOption.find(o => o.valueCoding.code === coding.code && o.valueCoding.system === coding.system);
  return opt && opt.extension.find(e => e.url.endsWith("/itemWeight")).valueDecimal;
}
function evalExpr(expr, qr, q, vars) {
  let m;
  if (expr === "%resource.subject") return qr.subject;
  if (expr === "%resource.authored") return qr.authored;
  if (expr === "%score") return vars.score;
  if ((m = expr.match(/^%resource\.item\.where\(linkId='([^']+)'\)\.answer\.value$/))) { const a = itemAnswer(qr, m[1]); return a && Object.values(a)[0]; }
  if (expr.startsWith("iif(%resource.id.exists()")) return qr.id ? "QuestionnaireResponse/" + qr.id : undefined;
  if ((m = expr.match(/^%resource\.item\.where\((.+)\)\.answer\.value\.weight\(\)\.sum\(\)$/))) {
    const ids = [...m[1].matchAll(/linkId='([^']+)'/g)].map(x => x[1]);
    return ids.reduce((t, id) => t + weightOf(q, id, itemAnswer(qr, id).valueCoding), 0);
  }
  if (expr.startsWith("iif(%score")) {
    const parts = [...expr.matchAll(/%score <= (\d+), '([^']+)'/g)].map(x => [Number(x[1]), x[2]]);
    const last = expr.match(/'([^']+)'\)+$/)[1];
    for (const [max, label] of parts) if (vars.score <= max) return label;
    return last;
  }
  throw new Error("Unsupported expression in test harness: " + expr);
}
const EXT_VAL = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-templateExtractValue";
function applyTemplate(node, qr, q, vars) {
  if (Array.isArray(node)) return node.map(n => applyTemplate(n, qr, q, vars)).filter(v => v !== undefined);
  if (node && typeof node === "object") {
    const ev = node.extension && node.extension.find(e => e.url === EXT_VAL);
    if (ev && Object.keys(node).length === 1) return evalExpr(ev.valueString, qr, q, vars); // whole element replaced
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("_")) {
        const inner = v.extension && v.extension.find(e => e.url === EXT_VAL);
        const val = inner ? evalExpr(inner.valueString, qr, q, vars) : undefined;
        if (val !== undefined) out[k.slice(1)] = val;
        continue;
      }
      const r = applyTemplate(v, qr, q, vars);
      if (r !== undefined && !(Array.isArray(r) && r.length === 0) && !(typeof r === "object" && !Array.isArray(r) && Object.keys(r).length === 0)) out[k] = r;
    }
    return out;
  }
  return node;
}

const files = process.argv.slice(2);
for (const f of files) {
  const qr = JSON.parse(fs.readFileSync(f, "utf8"));
  const qid = qr.questionnaire.split("/").pop().split("|")[0];
  const q = JSON.parse(fs.readFileSync(path.join(qdir, qid + ".json"), "utf8"));
  console.log(`\n== ${qid} ==`);
  ok("canonical matches Questionnaire.url|version", qr.questionnaire === `${q.url}|${q.version}`);
  const qItems = Object.fromEntries(q.item.map(i => [i.linkId, i]));
  for (const it of qr.item) {
    const qi = qItems[it.linkId];
    ok(`linkId ${it.linkId} exists in Questionnaire`, !!qi);
    if (!qi) continue;
    const a = it.answer[0];
    if (qi.type === "choice") ok(`  ${it.linkId} answer is a permitted LOINC option`, qi.answerOption.some(o => o.valueCoding.system === a.valueCoding.system && o.valueCoding.code === a.valueCoding.code), a.valueCoding.code);
    if (qi.type === "integer") ok(`  ${it.linkId} is valueInteger`, Number.isInteger(a.valueInteger));
    if (qi.type === "string") ok(`  ${it.linkId} is valueString`, typeof a.valueString === "string");
  }
  q.item.filter(i => i.required).forEach(i => ok(`required ${i.linkId} answered`, qr.item.some(x => x.linkId === i.linkId)));
  // recompute the calculated items from the Questionnaire's own expressions
  const scoreExpr = q.extension.find(e => e.url.endsWith("/variable")).valueExpression.expression;
  const vars = { score: evalExpr(scoreExpr, qr, q, {}) };
  ok("Questionnaire score expression = site total", vars.score === itemAnswer(qr, "total").valueInteger, `${vars.score} vs ${itemAnswer(qr, "total").valueInteger}`);
  const bandExpr = qItems.interpretation.extension[0].valueExpression.expression;
  ok("Questionnaire band expression = site band", evalExpr(bandExpr, qr, q, vars) === itemAnswer(qr, "interpretation").valueString, evalExpr(bandExpr, qr, q, vars));

  // receiving system adds the patient, then extracts
  const withSubject = { ...qr, id: "qr-1", subject: { reference: "Patient/example" } };
  const tmplRef = q.extension.find(e => e.url.endsWith("templateExtract")).extension.find(e => e.url === "template").valueReference.reference.slice(1);
  const tmpl = q.contained.find(c => c.id === tmplRef);
  const { id, ...body } = tmpl;
  const obs = applyTemplate(body, withSubject, q, vars);
  console.log(JSON.stringify(obs, null, 1).split("\n").slice(0, 200).join("\n").replace(/\n\s*/g, " ").slice(0, 600) + " ...");
  // AU Core Diagnostic Result Observation 2.0.0 mandatory elements and key invariants
  ok("AU Core: status present", !!obs.status);
  ok("AU Core: category 1..*", Array.isArray(obs.category) && obs.category.length > 0);
  ok("AU Core: code present", !!(obs.code && obs.code.coding.length));
  ok("AU Core: subject references a Patient", obs.subject && /^Patient\//.test(obs.subject.reference));
  ok("AU Core: effective[x] to at least the day", /^\d{4}-\d{2}-\d{2}/.test(obs.effectiveDateTime || ""));
  ok("au-core-obs-01: value or dataAbsentReason", obs.valueQuantity && typeof obs.valueQuantity.value === "number");
  ok("code carries LOINC and SNOMED CT", obs.code.coding.some(c => c.system === "http://loinc.org") && obs.code.coding.some(c => c.system === "http://snomed.info/sct"));
  ok("no SNOMED disorder/finding codes used", !JSON.stringify(obs).match(/\(disorder\)|\(finding\)/));
  ok("no extraction extensions left in output", !JSON.stringify(obs).includes("templateExtract"));
  ok("derivedFrom points at the QuestionnaireResponse", obs.derivedFrom && obs.derivedFrom[0].reference === "QuestionnaireResponse/qr-1");

  // without a subject, extraction must NOT invent one
  const anon = applyTemplate(body, qr, q, vars);
  ok("anonymous response: no subject produced (receiving system must add it)", !anon.subject);
}
console.log(fails ? `\n${fails} FAILED` : "\nAll FHIR checks passed");
process.exit(fails ? 1 : 0);
