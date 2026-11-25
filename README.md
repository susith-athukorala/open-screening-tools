# Open Screening Tools

Free, private health screening questionnaires that score in the browser. Stage 1 of a larger project: no sign-up, no data storage, no longitudinal record.

## What is included

17 interactive tools: PHQ-9, PHQ-2, GAD-7, GAD-2, K10, WHO-5, PC-PTSD-5, ASRS-v1.1 (6Q), PHQ-15, EPDS, GDS-15, AUDIT, AUDIT-C, FTND, BMI, waist-to-height ratio and IPAQ-SF.

8 tools are linked to their official source but not reproduced, because the owner needs to give permission, a trained examiner is needed, or checking is not finished: CRT6, SCAT6, SCOAT6, SMHAT-1/APSQ, LEAF-Q, AUSDRISK, STOP-Bang and SCOFF.

## Privacy by design

- Plain static files with no backend, no build step and no third-party code or fonts.
- Answers are held in memory only. Nothing is written to cookies or any browser storage.
- A Content Security Policy in `index.html` blocks all network connections (`connect-src 'none'`).
- The print and FHIR JSON exports are created on the user's device.

## Deploy on GitHub Pages

1. Create a repository (for example `open-screening-tools`) and upload these files to the root, including `.nojekyll`.
2. Go to **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. Optional: add a custom domain or subdomain (for example `screening.susith.lk`) and turn on **Enforce HTTPS**.

To preview locally, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Adding or editing a tool

Every instrument is defined in `js/tools.js`. Before you add a tool:

1. Confirm the licence allows free reproduction on a public website, and record the exact wording in `licence`.
2. Copy the item wording and scoring from the original publication or the owner's official form.
3. Add at least one verified DOI or official URL in `refs`, and a plain-language `METHOD` entry.
4. If any item asks about self-harm or suicide, or very high scores need urgent follow-up, add a `crisis` rule.
5. Add test cases to the scoring test and re-run it.
6. Update the TGA self-assessment record.

## FHIR pilot: PHQ-9 and GAD-7

```
fhir/
  index.json                      list of published Questionnaires
  Questionnaire/phq9(.json)       SDC Questionnaire, LOINC + SNOMED CT coded, with an extraction template
  Questionnaire/gad7(.json)
  examples/*-questionnaire-response.json   sample exports from the site (anonymous)
fhir-src/
  codes.js                        verified codes (single source, also loaded by the site)
  build.js                        regenerates fhir/Questionnaire/* from js/tools.js + codes.js
tests/fhir.test.js                offline structure and extraction checks
```

**How it works:**
1. The site exports an SDC QuestionnaireResponse. The answers are LOINC answer codes (for example LA6570-1), and `questionnaire` points to `.../fhir/Questionnaire/phq9|0.1.0`.
2. The website never adds a patient. A receiving clinical system sets `QuestionnaireResponse.subject` to its own AU Core Patient.
3. SDC `$extract` (for example CSIRO Smart Forms) applies the contained template and produces one Observation shaped for **AU Core Diagnostic Result Observation 2.0.0**:
   - category `survey`
   - code: LOINC 44261-6 / 70274-6 and SNOMED CT 720433000 / 445455005
   - `valueQuantity` in `{score}`
   - the published band as interpretation text
   - `derivedFrom` pointing to the response

**Codes deliberately not used:** SNOMED CT disorder or finding codes such as "moderate depression". A self-screen must not be recorded as a diagnosis.

**If you host the site somewhere else:** change `FHIR_BASE` in both `fhir-src/build.js` and `js/app.js`, then run `node fhir-src/build.js`.

**Check before production use:**

```
java -jar validator_cli.jar fhir/Questionnaire/phq9.json -version 4.0.1 -ig hl7.fhir.uv.sdc#4.0.0 -ig hl7.fhir.au.core#2.0.0
node tests/fhir.test.js fhir/examples/*.json
```

Then load the Questionnaire into Smart Forms (smartforms.csiro.au) and test `$extract` with a test patient.

## Licences

Website code: MIT (see `LICENSE`). The questionnaires are **not** covered by the code licence. Each one stays the property of its copyright holder and is used under the terms shown on its page and on the Sources page. Some instruments (WHO-5, AUDIT, K10, CRT6, SCAT6) allow non-commercial use only, so check them again before any commercial stage.

## Disclaimer

Screening only. Not a diagnosis, not medical advice and not a doctor's recommendation.
