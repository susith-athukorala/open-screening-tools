/* Terminology for the FHIR pilot (PHQ-9, GAD-7).
 * Every code below was checked against its source on 2026-11-26:
 *  - LOINC panels 44249-1 and 69737-5 (loinc.org), answer list LL358-3 and LL359-1
 *  - SNOMED CT 720433000 (PHQ-9 score, observable entity); 445455005 (GAD-7 score, observable entity)
 * Re-check against a terminology server (e.g. Ontoserver / NCTS) before production use.
 */
var LOINC = "http://loinc.org";
var SCT = "http://snomed.info/sct";

var FREQ_ANSWERS = [
  { code: "LA6568-5", display: "Not at all", weight: 0 },
  { code: "LA6569-3", display: "Several days", weight: 1 },
  { code: "LA6570-1", display: "More than half the days", weight: 2 },
  { code: "LA6571-9", display: "Nearly every day", weight: 3 }
];
var DIFFICULTY_ANSWERS = [
  { code: "LA6572-7", display: "Not difficult at all" },
  { code: "LA6573-5", display: "Somewhat difficult" },
  { code: "LA6575-0", display: "Very difficult" },
  { code: "LA6574-3", display: "Extremely difficult" }
];

var PILOT = {
  phq9: {
    panel: { system: LOINC, code: "44249-1", display: "PHQ-9 quick depression assessment panel [Reported.PHQ]" },
    itemCodes: ["44250-9", "44255-8", "44259-0", "44254-1", "44251-7", "44258-2", "44252-5", "44253-3", "44260-8"],
    difficultyCode: "69722-7",
    total: [
      { system: LOINC, code: "44261-6", display: "Patient Health Questionnaire 9 item (PHQ-9) total score [Reported]" },
      { system: SCT, code: "720433000", display: "Patient Health Questionnaire Nine Item score" }
    ]
  },
  gad7: {
    panel: { system: LOINC, code: "69737-5", display: "Generalized anxiety disorder 7 item (GAD-7)" },
    itemCodes: ["69725-0", "68509-9", "69733-4", "69734-2", "69735-9", "69689-8", "69736-7"],
    difficultyCode: null, // LOINC panel 69737-5 has no difficulty item; kept as a local item
    total: [
      { system: LOINC, code: "70274-6", display: "Generalized anxiety disorder 7 item (GAD-7) total score [Reported.PHQ]" },
      { system: SCT, code: "445455005", display: "Generalized anxiety disorder 7 item score" }
    ]
  }
};

var FHIR_CODES = { LOINC, SCT, FREQ_ANSWERS, DIFFICULTY_ANSWERS, PILOT };
if (typeof module !== "undefined") module.exports = FHIR_CODES;
