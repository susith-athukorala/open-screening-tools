#!/usr/bin/env node
/* Builds SDC Questionnaire resources (FHIR R4) for the pilot tools from js/tools.js
 * plus the verified codes in codes.js. Run:  node fhir-src/build.js
 * Output: fhir/Questionnaire/<id>.json (and an extension-less copy so the canonical URL resolves on GitHub Pages).
 */
const fs = require("fs");
const path = require("path");
const { TOOLS, REF } = require("../js/tools.js");
const C = require("./codes.js");

// Change this if the site is hosted elsewhere. Must match FHIR_BASE in js/app.js.
const FHIR_BASE = process.env.FHIR_BASE || "https://www.susith.lk/open-screening-tools/fhir";
const SDC = "http://hl7.org/fhir/uv/sdc/StructureDefinition/";
const AU_CORE_DIAG = "http://hl7.org.au/fhir/core/StructureDefinition/au-core-diagnosticresult";
const VERSION = "0.1.0";
const DATE = "2026-11-26";

const fhirpath = s => ({ language: "text/fhirpath", expression: s });
const extractValue = expr => ({ extension: [{ url: SDC + "sdc-questionnaire-templateExtractValue", valueString: expr }] });

function bandsExpr(bands) {
  // nested iif() from the highest band down
  let e = `'${bands[bands.length - 1].label}'`;
  for (let i = bands.length - 2; i >= 0; i--) e = `iif(%score <= ${bands[i].max}, '${bands[i].label}', ${e})`;
  return e;
}

const BANDS = {
  phq9: [
    { max: 4, label: "Minimal symptom range" }, { max: 9, label: "Mild symptom range" },
    { max: 14, label: "Moderate symptom range" }, { max: 19, label: "Moderately severe symptom range" },
    { max: 27, label: "Severe symptom range" }
  ],
  gad7: [
    { max: 4, label: "Minimal anxiety symptom range" }, { max: 9, label: "Mild anxiety symptom range" },
    { max: 14, label: "Moderate anxiety symptom range" }, { max: 21, label: "Severe anxiety symptom range" }
  ]
};

function build(id) {
  const tool = TOOLS.find(t => t.id === id);
  const codes = C.PILOT[id];
  const url = `${FHIR_BASE}/Questionnaire/${id}`;
  const scored = tool.items.filter(i => i.id !== "difficulty");
  const tmplId = `${id}-total-observation`;

  const items = [
    { linkId: "stem", type: "display", text: tool.stem },
    ...scored.map((it, n) => ({
      linkId: it.id,
      code: [{ system: C.LOINC, code: codes.itemCodes[n], display: it.text }],
      prefix: String(n + 1) + ".",
      text: it.text,
      type: "choice",
      required: true,
      answerOption: C.FREQ_ANSWERS.map(a => ({
        extension: [
          { url: "http://hl7.org/fhir/StructureDefinition/itemWeight", valueDecimal: a.weight },
          { url: "http://hl7.org/fhir/StructureDefinition/ordinalValue", valueDecimal: a.weight }
        ],
        valueCoding: { system: C.LOINC, code: a.code, display: a.display }
      }))
    })),
    {
      linkId: "difficulty",
      ...(codes.difficultyCode ? { code: [{ system: C.LOINC, code: codes.difficultyCode }] } : {}),
      text: tool.items.find(i => i.id === "difficulty").text,
      type: "choice",
      required: false,
      answerOption: C.DIFFICULTY_ANSWERS.map(a => ({ valueCoding: { system: C.LOINC, code: a.code, display: a.display } }))
    },
    {
      linkId: "total",
      code: codes.total,
      text: `${tool.name} total score`,
      type: "integer",
      readOnly: true,
      extension: [{ url: SDC + "sdc-questionnaire-calculatedExpression", valueExpression: { ...fhirpath("%score"), name: "total" } }]
    },
    {
      linkId: "interpretation",
      text: "Published score band (screening only, not a diagnosis)",
      type: "string",
      readOnly: true,
      extension: [{ url: SDC + "sdc-questionnaire-calculatedExpression", valueExpression: fhirpath(bandsExpr(BANDS[id])) }]
    }
  ];

  // Template: one Observation for the total score, shaped for AU Core Diagnostic Result Observation 2.0.0.
  // subject/performer come from QuestionnaireResponse.subject, which the RECEIVING system sets (the website never does).
  const template = {
    resourceType: "Observation",
    id: tmplId,
    meta: { profile: [AU_CORE_DIAG] },
    status: "final",
    category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "survey", display: "Survey" }] }],
    code: { coding: codes.total, text: `${tool.name} total score` },
    subject: extractValue("%resource.subject"),
    _effectiveDateTime: extractValue("%resource.authored"),
    performer: [extractValue("%resource.subject")],
    valueQuantity: {
      _value: extractValue("%resource.item.where(linkId='total').answer.value"),
      unit: "{score}", system: "http://unitsofmeasure.org", code: "{score}"
    },
    interpretation: [{ _text: extractValue("%resource.item.where(linkId='interpretation').answer.value") }],
    derivedFrom: [{ _reference: extractValue("iif(%resource.id.exists(), 'QuestionnaireResponse/' + %resource.id, {})") }],
    note: [{ text: `Self-completed ${tool.name} screening questionnaire. The score band is from the published instrument and is not a diagnosis.` }]
  };

  const sumExpr = `%resource.item.where(${scored.map(i => `linkId='${i.id}'`).join(" or ")}).answer.value.weight().sum()`;

  return {
    resourceType: "Questionnaire",
    id,
    meta: { profile: [SDC + "sdc-questionnaire"] },
    contained: [template],
    extension: [
      { url: "http://hl7.org/fhir/StructureDefinition/variable", valueExpression: { ...fhirpath(sumExpr), name: "score" } },
      { url: SDC + "sdc-questionnaire-templateExtract", extension: [{ url: "template", valueReference: { reference: "#" + tmplId } }] }
    ],
    url,
    version: VERSION,
    name: id.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    title: tool.title,
    status: "draft",
    experimental: true,
    subjectType: ["Patient"],
    date: DATE,
    publisher: "Open Screening Tools",
    description: `${tool.summary} Screening only, not a diagnosis. FHIR representation for teaching and interoperability testing.`,
    purpose: "Self-completed screening. Results are not a diagnosis or a recommendation from a health professional.",
    copyright: tool.licence + " LOINC codes © Regenstrief Institute, Inc. (loinc.org). SNOMED CT codes © SNOMED International, used under the licence applicable in the user's jurisdiction.",
    code: [codes.panel],
    item: items
  };
}

const outDir = path.join(__dirname, "..", "fhir", "Questionnaire");
fs.mkdirSync(outDir, { recursive: true });
const index = [];
for (const id of Object.keys(C.PILOT)) {
  const q = build(id);
  const json = JSON.stringify(q, null, 2) + "\n";
  fs.writeFileSync(path.join(outDir, id + ".json"), json);
  fs.writeFileSync(path.join(outDir, id), json); // extension-less copy so the canonical URL resolves on GitHub Pages
  index.push({ id, url: q.url, title: q.title });
  console.log("wrote", id, json.length, "bytes");
}
fs.writeFileSync(path.join(outDir, "..", "index.json"), JSON.stringify({ base: FHIR_BASE, questionnaires: index }, null, 2) + "\n");
module.exports = { build, BANDS, FHIR_BASE };
