/*
 * Open Screening Tools – instrument library
 * -----------------------------------------
 * Every instrument below is either in the public domain or released by its
 * copyright holder for free reproduction (see `licence` on each entry).
 * Item wording follows the published source. Do not edit item text or
 * scoring without re-checking the source cited in `refs`.
 *
 * Scoring runs only in the visitor's browser. Nothing is sent anywhere.
 */

const OPTS = {
  phq: [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 }
  ],
  phq15: [
    { label: "Not bothered at all", value: 0 },
    { label: "Bothered a little", value: 1 },
    { label: "Bothered a lot", value: 2 }
  ],
  k10: [
    { label: "None of the time", value: 1 },
    { label: "A little of the time", value: 2 },
    { label: "Some of the time", value: 3 },
    { label: "Most of the time", value: 4 },
    { label: "All of the time", value: 5 }
  ],
  who5: [
    { label: "All of the time", value: 5 },
    { label: "Most of the time", value: 4 },
    { label: "More than half of the time", value: 3 },
    { label: "Less than half of the time", value: 2 },
    { label: "Some of the time", value: 1 },
    { label: "At no time", value: 0 }
  ],
  yesno: [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 }
  ],
  asrs: [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Very often", value: 4 }
  ],
  auditFreq: [
    { label: "Never", value: 0 },
    { label: "Less than monthly", value: 1 },
    { label: "Monthly", value: 2 },
    { label: "Weekly", value: 3 },
    { label: "Daily or almost daily", value: 4 }
  ],
  auditHarm: [
    { label: "No", value: 0 },
    { label: "Yes, but not in the last year", value: 2 },
    { label: "Yes, during the last year", value: 4 }
  ]
};

const AUDIT_Q1 = {
  text: "How often do you have a drink containing alcohol?",
  options: [
    { label: "Never", value: 0 },
    { label: "Monthly or less", value: 1 },
    { label: "2 to 4 times a month", value: 2 },
    { label: "2 to 3 times a week", value: 3 },
    { label: "4 or more times a week", value: 4 }
  ]
};
const AUDIT_Q2 = {
  text: "How many drinks containing alcohol do you have on a typical day when you are drinking?",
  options: [
    { label: "1 or 2", value: 0 },
    { label: "3 or 4", value: 1 },
    { label: "5 or 6", value: 2 },
    { label: "7, 8 or 9", value: 3 },
    { label: "10 or more", value: 4 }
  ]
};
const AUDIT_Q3 = { text: "How often do you have six or more drinks on one occasion?", options: OPTS.auditFreq };

const PHQ_NOTICE =
  "Developed by Drs Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc. No permission required to reproduce, translate, display or distribute.";

const REF = {
  phq9: { text: "Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.", doi: "10.1046/j.1525-1497.2001.016009606.x" },
  phq2: { text: "Kroenke K, Spitzer RL, Williams JBW. The Patient Health Questionnaire-2: validity of a two-item depression screener. Med Care. 2003;41(11):1284-1292.", doi: "10.1097/01.MLR.0000093487.78664.3C" },
  gad7: { text: "Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092-1097.", doi: "10.1001/archinte.166.10.1092" },
  gad2: { text: "Kroenke K, Spitzer RL, Williams JBW, Monahan PO, Löwe B. Anxiety disorders in primary care: prevalence, impairment, comorbidity, and detection. Ann Intern Med. 2007;146(5):317-325.", doi: "10.7326/0003-4819-146-5-200703060-00004" },
  phq15: { text: "Kroenke K, Spitzer RL, Williams JBW. The PHQ-15: validity of a new measure for evaluating the severity of somatic symptoms. Psychosom Med. 2002;64(2):258-266.", doi: "10.1097/00006842-200203000-00008" },
  phqSite: { text: "PHQ Screeners (official instrument site).", url: "https://www.phqscreeners.com" },
  k10: { text: "Kessler RC, Andrews G, Colpe LJ, et al. Short screening scales to monitor population prevalences and trends in non-specific psychological distress. Psychol Med. 2002;32(6):959-976.", doi: "10.1017/S0033291702006074" },
  k10aus: { text: "Andrews G, Slade T. Interpreting scores on the Kessler Psychological Distress Scale (K10). Aust N Z J Public Health. 2001;25(6):494-497.", doi: "10.1111/j.1467-842X.2001.tb00310.x" },
  k10site: { text: "Kessler RC. K10 and K6 Scales (Harvard Medical School).", url: "https://www.hcp.med.harvard.edu/ncs/k6_scales.php" },
  who5: { text: "Topp CW, Østergaard SD, Søndergaard S, Bech P. The WHO-5 Well-Being Index: a systematic review of the literature. Psychother Psychosom. 2015;84(3):167-176.", doi: "10.1159/000376585" },
  who5who: { text: "World Health Organization. The World Health Organization-Five Well-Being Index (WHO-5). Geneva: WHO; 2024. WHO/UCN/MSD/MHE/2024.1. Licence: CC BY-NC-SA 3.0 IGO.", url: "https://cdn.who.int/media/docs/default-source/mental-health/who-5_english-original4da539d6ed4b49389e3afe47cda2326a.pdf" },
  pcptsd5: { text: "Prins A, Bovin MJ, Smolenski DJ, et al. The Primary Care PTSD Screen for DSM-5 (PC-PTSD-5): development and evaluation within a veteran primary care sample. J Gen Intern Med. 2016;31(10):1206-1211.", doi: "10.1007/s11606-016-3703-5" },
  pcptsdSite: { text: "National Center for PTSD. Primary Care PTSD Screen for DSM-5 (PC-PTSD-5).", url: "https://www.ptsd.va.gov/professional/assessment/screens/pc-ptsd.asp" },
  epds: { text: "Cox JL, Holden JM, Sagovsky R. Detection of postnatal depression: development of the 10-item Edinburgh Postnatal Depression Scale. Br J Psychiatry. 1987;150(6):782-786.", doi: "10.1192/bjp.150.6.782" },
  gds: { text: "Sheikh JI, Yesavage JA. Geriatric Depression Scale (GDS): recent evidence and development of a shorter version. Clin Gerontol. 1986;5(1-2):165-173.", doi: "10.1300/J018v05n01_09" },
  gdsSite: { text: "Yesavage JA. Geriatric Depression Scale (Stanford University).", url: "https://web.stanford.edu/~yesavage/GDS.html" },
  asrs: { text: "Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychol Med. 2005;35(2):245-256.", doi: "10.1017/S0033291704002892" },
  asrsSite: { text: "Adult ADHD Self-Report Scales (Harvard Medical School).", url: "https://www.hcp.med.harvard.edu/ncs/asrs.php" },
  audit: { text: "Saunders JB, Aasland OG, Babor TF, de la Fuente JR, Grant M. Development of the Alcohol Use Disorders Identification Test (AUDIT): WHO collaborative project on early detection of persons with harmful alcohol consumption – II. Addiction. 1993;88(6):791-804.", doi: "10.1111/j.1360-0443.1993.tb02093.x" },
  auditManual: { text: "Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. AUDIT: The Alcohol Use Disorders Identification Test. Guidelines for use in primary care. 2nd ed. Geneva: WHO; 2001. WHO/MSD/MSB/01.6a.", url: "https://www.paho.org/sites/default/files/Auditmanual_ENG.pdf" },
  auditc: { text: "Bush K, Kivlahan DR, McDonell MB, Fihn SD, Bradley KA. The AUDIT alcohol consumption questions (AUDIT-C): an effective brief screening test for problem drinking. Arch Intern Med. 1998;158(16):1789-1795.", doi: "10.1001/archinte.158.16.1789" },
  ftnd: { text: "Heatherton TF, Kozlowski LT, Frecker RC, Fagerström KO. The Fagerström Test for Nicotine Dependence: a revision of the Fagerström Tolerance Questionnaire. Br J Addict. 1991;86(9):1119-1127.", doi: "10.1111/j.1360-0443.1991.tb01879.x" },
  ipaq: { text: "Craig CL, Marshall AL, Sjöström M, et al. International Physical Activity Questionnaire: 12-country reliability and validity. Med Sci Sports Exerc. 2003;35(8):1381-1395.", doi: "10.1249/01.MSS.0000078924.61453.FB" },
  ipaqScore: { text: "IPAQ Research Committee. Guidelines for data processing and analysis of the IPAQ – short and long forms (revised November 2005).", url: "https://sites.google.com/view/ipaq/score" },
  bmiAsia: { text: "WHO Expert Consultation. Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies. Lancet. 2004;363(9403):157-163.", doi: "10.1016/S0140-6736(03)15268-3" },
  whtr: { text: "Ashwell M, Gunn P, Gibson S. Waist-to-height ratio is a better screening tool than waist circumference and BMI for adult cardiometabolic risk factors: systematic review and meta-analysis. Obes Rev. 2012;13(3):275-286.", doi: "10.1111/j.1467-789X.2011.00952.x" }
};

/* Helpers -------------------------------------------------------------- */
const sum = (a, keys) => keys.reduce((t, k) => t + (Number(a[k]) || 0), 0);
const band = (score, bands) => bands.find(b => score >= b.min && score <= b.max);
const likert = (prefix, texts, options) =>
  texts.map((t, i) => ({ id: `${prefix}${i + 1}`, text: t, options }));

const PHQ9_TEXTS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];
const GAD7_TEXTS = [
  "Feeling nervous, anxious or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];
const DIFFICULTY_ITEM = {
  id: "difficulty",
  text: "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
  scored: false,
  optional: true,
  options: [
    { label: "Not difficult at all", value: 0 },
    { label: "Somewhat difficult", value: 1 },
    { label: "Very difficult", value: 2 },
    { label: "Extremely difficult", value: 3 }
  ]
};

/* Instrument library --------------------------------------------------- */
const TOOLS = [
  /* ---------------- Mental health & wellbeing ---------------- */
  {
    id: "phq9",
    name: "PHQ-9",
    title: "Patient Health Questionnaire-9 (depression)",
    category: "Mental health & wellbeing",
    summary: "Nine questions about low mood and related symptoms over the last two weeks.",
    audience: "Adults (18+)",
    minutes: 3,
    stem: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    items: [...likert("q", PHQ9_TEXTS, OPTS.phq), DIFFICULTY_ITEM],
    crisis: a => Number(a.q9) > 0,
    score(a) {
      const s = sum(a, ["q1","q2","q3","q4","q5","q6","q7","q8","q9"]);
      const b = band(s, [
        { min: 0, max: 4, label: "Minimal", level: "ok" },
        { min: 5, max: 9, label: "Mild", level: "low" },
        { min: 10, max: 14, label: "Moderate", level: "mid" },
        { min: 15, max: 19, label: "Moderately severe", level: "high" },
        { min: 20, max: 27, label: "Severe", level: "high" }
      ]);
      const notes = ["A score of 10 or more is commonly used to suggest that a fuller assessment with a health professional would be worthwhile."];
      if (Number(a.q9) > 0) notes.unshift("You indicated thoughts of being better off dead or of hurting yourself. Please talk to someone today — see the support contacts below.");
      return { score: s, max: 27, label: b.label + " symptom range", level: b.level, notes };
    },
    licence: PHQ_NOTICE,
    refs: [REF.phq9, REF.phqSite]
  },
  {
    id: "phq2",
    name: "PHQ-2",
    title: "Patient Health Questionnaire-2 (brief depression screen)",
    category: "Mental health & wellbeing",
    summary: "The first two PHQ-9 questions. A quick first check for low mood.",
    audience: "Adults (18+)",
    minutes: 1,
    stem: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    items: likert("q", PHQ9_TEXTS.slice(0, 2), OPTS.phq),
    score(a) {
      const s = sum(a, ["q1", "q2"]);
      return s >= 3
        ? { score: s, max: 6, label: "Positive screen", level: "mid", notes: ["A score of 3 or more suggests completing the full PHQ-9 and talking with a health professional."] }
        : { score: s, max: 6, label: "Negative screen", level: "ok", notes: ["A score below 3 does not rule out low mood. If you are worried, please speak with a health professional."] };
    },
    licence: PHQ_NOTICE,
    refs: [REF.phq2, REF.phqSite]
  },
  {
    id: "gad7",
    name: "GAD-7",
    title: "Generalized Anxiety Disorder-7",
    category: "Mental health & wellbeing",
    summary: "Seven questions about worry and anxiety over the last two weeks.",
    audience: "Adults (18+)",
    minutes: 2,
    stem: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    items: [...likert("q", GAD7_TEXTS, OPTS.phq), DIFFICULTY_ITEM],
    score(a) {
      const s = sum(a, ["q1","q2","q3","q4","q5","q6","q7"]);
      const b = band(s, [
        { min: 0, max: 4, label: "Minimal", level: "ok" },
        { min: 5, max: 9, label: "Mild", level: "low" },
        { min: 10, max: 14, label: "Moderate", level: "mid" },
        { min: 15, max: 21, label: "Severe", level: "high" }
      ]);
      return { score: s, max: 21, label: b.label + " anxiety symptom range", level: b.level,
        notes: ["A score of 10 or more is commonly used to suggest that a fuller assessment would be worthwhile."] };
    },
    licence: PHQ_NOTICE,
    refs: [REF.gad7, REF.phqSite]
  },
  {
    id: "gad2",
    name: "GAD-2",
    title: "Generalized Anxiety Disorder-2 (brief anxiety screen)",
    category: "Mental health & wellbeing",
    summary: "The first two GAD-7 questions. A quick first check for anxiety.",
    audience: "Adults (18+)",
    minutes: 1,
    stem: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    items: likert("q", GAD7_TEXTS.slice(0, 2), OPTS.phq),
    score(a) {
      const s = sum(a, ["q1", "q2"]);
      return s >= 3
        ? { score: s, max: 6, label: "Positive screen", level: "mid", notes: ["A score of 3 or more suggests completing the full GAD-7 and talking with a health professional."] }
        : { score: s, max: 6, label: "Negative screen", level: "ok", notes: ["A score below 3 does not rule out anxiety. If you are worried, please speak with a health professional."] };
    },
    licence: PHQ_NOTICE,
    refs: [REF.gad2, REF.phqSite]
  },
  {
    id: "k10",
    name: "K10",
    title: "Kessler Psychological Distress Scale",
    category: "Mental health & wellbeing",
    summary: "Ten questions about feelings of distress over the past 30 days. Widely used in Australia.",
    audience: "Adults (18+)",
    minutes: 3,
    stem: "These questions concern how you have been feeling over the past 30 days. During the last 30 days, about how often did you feel…",
    items: likert("q", [
      "…tired out for no good reason?",
      "…nervous?",
      "…so nervous that nothing could calm you down?",
      "…hopeless?",
      "…restless or fidgety?",
      "…so restless you could not sit still?",
      "…depressed?",
      "…that everything was an effort?",
      "…so sad that nothing could cheer you up?",
      "…worthless?"
    ], OPTS.k10),
    crisis: a => sum(a, ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10"]) >= 30,
    score(a) {
      const s = sum(a, ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10"]);
      const b = band(s, [
        { min: 10, max: 15, label: "Low", level: "ok" },
        { min: 16, max: 21, label: "Moderate", level: "low" },
        { min: 22, max: 29, label: "High", level: "mid" },
        { min: 30, max: 50, label: "Very high", level: "high" }
      ]);
      return { score: s, max: 50, min: 10, label: b.label + " level of psychological distress", level: b.level,
        notes: ["Score bands follow those used in Australian population surveys (Andrews & Slade, 2001). Scores range from 10 to 50."] };
    },
    licence: "© Ronald C. Kessler, PhD. Use of the K10 is free and does not require formal permission; users are asked to cite the source and include the copyright notice.",
    refs: [REF.k10, REF.k10aus, REF.k10site]
  },
  {
    id: "who5",
    name: "WHO-5",
    title: "WHO-Five Well-Being Index",
    category: "Mental health & wellbeing",
    summary: "Five positively worded questions about your wellbeing over the last two weeks.",
    audience: "Ages 9+ (validated in adolescents and adults)",
    minutes: 1,
    stem: "Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.",
    items: likert("q", [
      "I have felt cheerful and in good spirits",
      "I have felt calm and relaxed",
      "I have felt active and vigorous",
      "I woke up feeling fresh and rested",
      "My daily life has been filled with things that interest me"
    ], OPTS.who5),
    score(a) {
      const raw = sum(a, ["q1","q2","q3","q4","q5"]);
      const pct = raw * 4;
      let label = "Wellbeing within the usual range", level = "ok";
      const notes = [`Raw score ${raw}/25, shown as a percentage (0 = worst, 100 = best possible wellbeing).`];
      if (pct <= 28) { label = "Low wellbeing"; level = "high"; notes.push("A score of 28% or below has been linked with likely depression in research studies. Please consider speaking with a health professional."); }
      else if (pct <= 50) { label = "Reduced wellbeing"; level = "mid"; notes.push("A score of 50% or below is often used as a signal to check for depression (for example with the PHQ-9)."); }
      return { score: pct, max: 100, unit: "%", label, level, notes };
    },
    licence: "© World Health Organization 2024. Licence: CC BY-NC-SA 3.0 IGO. The WHO-5 is free to use without permission for non-commercial purposes.",
    refs: [REF.who5, REF.who5who]
  },
  {
    id: "pcptsd5",
    name: "PC-PTSD-5",
    title: "Primary Care PTSD Screen for DSM-5",
    category: "Mental health & wellbeing",
    summary: "A five-question screen for possible post-traumatic stress, asked only if you have experienced a traumatic event.",
    audience: "Adults (18+)",
    minutes: 2,
    intro: "Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire; a physical or sexual assault or abuse; an earthquake or flood; a war; seeing someone be killed or seriously injured; having a loved one die through homicide or suicide.",
    items: [
      { id: "exposure", text: "Have you ever experienced this kind of event?", options: OPTS.yesno, scored: false },
      ...likert("q", [
        "In the past month, have you had nightmares about the event(s) or thought about the event(s) when you did not want to?",
        "In the past month, have you tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?",
        "In the past month, have you been constantly on guard, watchful, or easily startled?",
        "In the past month, have you felt numb or detached from people, activities, or your surroundings?",
        "In the past month, have you felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?"
      ], OPTS.yesno).map(i => ({ ...i, showIf: a => Number(a.exposure) === 1 }))
    ],
    score(a) {
      if (Number(a.exposure) !== 1) return { score: 0, max: 5, label: "Screen complete (no traumatic event reported)", level: "ok", notes: ["If you have not experienced a traumatic event, the screen ends with a score of 0."] };
      const s = sum(a, ["q1","q2","q3","q4","q5"]);
      return s >= 3
        ? { score: s, max: 5, label: "Positive screen", level: "mid", notes: ["Answering yes to 3 or more questions suggests that a fuller assessment by a mental health professional would be worthwhile. Some services use a cut-point of 4."] }
        : { score: s, max: 5, label: "Negative screen", level: "ok", notes: ["A low score does not rule out the effects of trauma. If you are struggling, support is available."] };
    },
    licence: "Public domain. Developed by the US Department of Veterans Affairs National Center for PTSD (Prins et al.).",
    refs: [REF.pcptsd5, REF.pcptsdSite]
  },
  {
    id: "epds",
    name: "EPDS",
    title: "Edinburgh Postnatal Depression Scale",
    category: "Pregnancy & parenting",
    summary: "Ten questions for people who are pregnant or have had a baby in the last year.",
    audience: "Pregnant and postnatal parents",
    minutes: 3,
    stem: "As you are pregnant or have recently had a baby, we would like to know how you are feeling. Please choose the answer that comes closest to how you have felt IN THE PAST 7 DAYS, not just how you feel today.",
    items: [
      { id: "q1", text: "I have been able to laugh and see the funny side of things", options: [
        { label: "As much as I always could", value: 0 }, { label: "Not quite so much now", value: 1 },
        { label: "Definitely not so much now", value: 2 }, { label: "Not at all", value: 3 }] },
      { id: "q2", text: "I have looked forward with enjoyment to things", options: [
        { label: "As much as I ever did", value: 0 }, { label: "Rather less than I used to", value: 1 },
        { label: "Definitely less than I used to", value: 2 }, { label: "Hardly at all", value: 3 }] },
      { id: "q3", text: "I have blamed myself unnecessarily when things went wrong", options: [
        { label: "Yes, most of the time", value: 3 }, { label: "Yes, some of the time", value: 2 },
        { label: "Not very often", value: 1 }, { label: "No, never", value: 0 }] },
      { id: "q4", text: "I have been anxious or worried for no good reason", options: [
        { label: "No, not at all", value: 0 }, { label: "Hardly ever", value: 1 },
        { label: "Yes, sometimes", value: 2 }, { label: "Yes, very often", value: 3 }] },
      { id: "q5", text: "I have felt scared or panicky for no very good reason", options: [
        { label: "Yes, quite a lot", value: 3 }, { label: "Yes, sometimes", value: 2 },
        { label: "No, not much", value: 1 }, { label: "No, not at all", value: 0 }] },
      { id: "q6", text: "Things have been getting on top of me", options: [
        { label: "Yes, most of the time I haven't been able to cope at all", value: 3 },
        { label: "Yes, sometimes I haven't been coping as well as usual", value: 2 },
        { label: "No, most of the time I have coped quite well", value: 1 },
        { label: "No, I have been coping as well as ever", value: 0 }] },
      { id: "q7", text: "I have been so unhappy that I have had difficulty sleeping", options: [
        { label: "Yes, most of the time", value: 3 }, { label: "Yes, sometimes", value: 2 },
        { label: "Not very often", value: 1 }, { label: "No, not at all", value: 0 }] },
      { id: "q8", text: "I have felt sad or miserable", options: [
        { label: "Yes, most of the time", value: 3 }, { label: "Yes, quite often", value: 2 },
        { label: "Not very often", value: 1 }, { label: "No, not at all", value: 0 }] },
      { id: "q9", text: "I have been so unhappy that I have been crying", options: [
        { label: "Yes, most of the time", value: 3 }, { label: "Yes, quite often", value: 2 },
        { label: "Only occasionally", value: 1 }, { label: "No, never", value: 0 }] },
      { id: "q10", text: "The thought of harming myself has occurred to me", options: [
        { label: "Yes, quite often", value: 3 }, { label: "Sometimes", value: 2 },
        { label: "Hardly ever", value: 1 }, { label: "Never", value: 0 }] }
    ],
    crisis: a => Number(a.q10) > 0,
    score(a) {
      const s = sum(a, ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10"]);
      const notes = ["The EPDS is designed to support, not replace, the judgement of a midwife, child and family health nurse or doctor."];
      if (Number(a.q10) > 0) notes.unshift("You indicated thoughts of harming yourself. Please talk to someone today — see the support contacts below.");
      let label = "Below the usual screening threshold", level = "ok";
      if (s >= 13) { label = "Above the threshold for probable depression"; level = "high"; }
      else if (s >= 10) { label = "Possible depression – worth discussing"; level = "mid"; }
      return { score: s, max: 30, label, level, notes };
    },
    licence: "© 1987 The Royal College of Psychiatrists. Cox JL, Holden JM, Sagovsky R. Detection of postnatal depression: development of the 10-item Edinburgh Postnatal Depression Scale. Br J Psychiatry 1987;150:782-786. Users may reproduce the scale without further permission providing they respect copyright by quoting the names of the authors, the title and the source of the paper in all reproduced copies.",
    refs: [REF.epds],
    extraSupport: "perinatal"
  },
  {
    id: "gds15",
    name: "GDS-15",
    title: "Geriatric Depression Scale – Short Form",
    category: "Healthy ageing",
    summary: "Fifteen yes/no questions about mood, designed for older adults.",
    audience: "Older adults (65+)",
    minutes: 4,
    stem: "Choose the best answer for how you have felt over the past week.",
    items: [
      ["Are you basically satisfied with your life?", 0],
      ["Have you dropped many of your activities and interests?", 1],
      ["Do you feel that your life is empty?", 1],
      ["Do you often get bored?", 1],
      ["Are you in good spirits most of the time?", 0],
      ["Are you afraid that something bad is going to happen to you?", 1],
      ["Do you feel happy most of the time?", 0],
      ["Do you often feel helpless?", 1],
      ["Do you prefer to stay at home, rather than going out and doing new things?", 1],
      ["Do you feel you have more problems with memory than most?", 1],
      ["Do you think it is wonderful to be alive now?", 0],
      ["Do you feel pretty worthless the way you are now?", 1],
      ["Do you feel full of energy?", 0],
      ["Do you feel that your situation is hopeless?", 1],
      ["Do you think that most people are better off than you are?", 1]
    ].map(([t, keyYes], i) => ({
      id: `q${i + 1}`, text: t,
      // A point is given for the answer that points towards depression.
      options: [{ label: "Yes", value: keyYes ? 1 : 0, raw: "yes" }, { label: "No", value: keyYes ? 0 : 1, raw: "no" }]
    })),
    score(a) {
      const s = sum(a, Array.from({ length: 15 }, (_, i) => `q${i + 1}`));
      let label = "Within the usual range", level = "ok";
      if (s >= 10) { label = "Strongly suggests depression"; level = "high"; }
      else if (s > 5) { label = "Suggests depression – worth a follow-up"; level = "mid"; }
      return { score: s, max: 15, label, level, notes: ["A score above 5 suggests a follow-up conversation with a doctor; 10 or more is almost always associated with depression."] };
    },
    licence: "Public domain (developed with US federal support). Sheikh JI, Yesavage JA, 1986.",
    refs: [REF.gds, REF.gdsSite]
  },
  {
    id: "asrs6",
    name: "ASRS-v1.1 Screener",
    title: "Adult ADHD Self-Report Scale – 6-question screener",
    category: "Mental health & wellbeing",
    summary: "Six questions about attention and activity over the past six months.",
    audience: "Adults (18+)",
    minutes: 2,
    stem: "Check the box that best describes how you have felt and conducted yourself over the past 6 months.",
    items: likert("q", [
      "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
      "How often do you have problems remembering appointments or obligations?",
      "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
    ], OPTS.asrs),
    score(a) {
      // Shaded responses: items 1–3 "Sometimes" or more; items 4–6 "Often" or more.
      let n = 0;
      ["q1", "q2", "q3"].forEach(k => { if (Number(a[k]) >= 2) n++; });
      ["q4", "q5", "q6"].forEach(k => { if (Number(a[k]) >= 3) n++; });
      return n >= 4
        ? { score: n, max: 6, label: "Symptoms may be consistent with adult ADHD", level: "mid", notes: ["Four or more answers in the shaded range suggest that a full assessment by a qualified clinician may be worthwhile.", "The score shown is the number of answers in the shaded range, not a sum."] }
        : { score: n, max: 6, label: "Below the screening threshold", level: "ok", notes: ["The score shown is the number of answers in the shaded range, not a sum. A low score does not rule out ADHD."] };
    },
    licence: "© World Health Organization; © New York University and Ronald C. Kessler, PhD. Use of the ASRS v1.1 6-question screener is free and does not require formal permission; users are asked to cite the source and include the copyright notice.",
    refs: [REF.asrs, REF.asrsSite]
  },
  {
    id: "phq15",
    name: "PHQ-15",
    title: "Patient Health Questionnaire-15 (physical symptoms)",
    category: "Mental health & wellbeing",
    summary: "How much common physical symptoms have bothered you over the past four weeks.",
    audience: "Adults (18+)",
    minutes: 3,
    stem: "During the past 4 weeks, how much have you been bothered by any of the following problems?",
    items: [
      ...likert("q", [
        "Stomach pain", "Back pain", "Pain in your arms, legs, or joints (knees, hips, etc.)"
      ], OPTS.phq15),
      { id: "q4", text: "Menstrual cramps or other problems with your periods (women only)", options: [...OPTS.phq15, { label: "Not applicable", value: 0 }] },
      ...[
        "Headaches", "Chest pain", "Dizziness", "Fainting spells", "Feeling your heart pound or race",
        "Shortness of breath", "Pain or problems during sexual intercourse",
        "Constipation, loose bowels, or diarrhea", "Nausea, gas, or indigestion",
        "Feeling tired or having low energy", "Trouble sleeping"
      ].map((t, i) => ({ id: `q${i + 5}`, text: t, options: OPTS.phq15 }))
    ],
    score(a) {
      const s = sum(a, Array.from({ length: 15 }, (_, i) => `q${i + 1}`));
      const b = band(s, [
        { min: 0, max: 4, label: "Minimal", level: "ok" },
        { min: 5, max: 9, label: "Low", level: "low" },
        { min: 10, max: 14, label: "Medium", level: "mid" },
        { min: 15, max: 30, label: "High", level: "high" }
      ]);
      return { score: s, max: 30, label: b.label + " physical symptom burden", level: b.level,
        notes: ["Physical symptoms have many possible causes. New, severe or worsening symptoms — especially chest pain, fainting or shortness of breath — need prompt medical review whatever your score."] };
    },
    licence: PHQ_NOTICE,
    refs: [REF.phq15, REF.phqSite]
  },

  /* ---------------- Alcohol & tobacco ---------------- */
  {
    id: "auditc",
    name: "AUDIT-C",
    title: "AUDIT Alcohol Consumption Questions",
    category: "Alcohol & tobacco",
    summary: "Three questions about how much and how often you drink.",
    audience: "Adults (18+)",
    minutes: 1,
    intro: "One drink here means one standard drink. In Australia a standard drink contains 10 grams of alcohol (for example, 100 mL of wine at 13.5% alcohol, or a 375 mL can of mid-strength beer).",
    items: [
      { id: "sex", text: "Sex used for the score cut-off", scored: false, options: [{ label: "Male", value: 1 }, { label: "Female", value: 0 }] },
      { id: "q1", ...AUDIT_Q1 }, { id: "q2", ...AUDIT_Q2 }, { id: "q3", ...AUDIT_Q3 }
    ],
    score(a) {
      const s = sum(a, ["q1", "q2", "q3"]);
      const cut = Number(a.sex) === 1 ? 4 : 3;
      return s >= cut
        ? { score: s, max: 12, label: "Positive screen for risky drinking", level: "mid", notes: [`A score of ${cut} or more (${Number(a.sex) === 1 ? "men" : "women"}) suggests drinking above lower-risk levels. The full AUDIT gives more detail.`] }
        : { score: s, max: 12, label: "Negative screen", level: "ok", notes: ["Your answers fall below the usual cut-off for risky drinking."] };
    },
    licence: "The AUDIT is © World Health Organization and may be reproduced for non-commercial purposes. AUDIT-C consists of the first three AUDIT questions (Bush et al., 1998).",
    refs: [REF.auditc, REF.auditManual]
  },
  {
    id: "audit",
    name: "AUDIT",
    title: "Alcohol Use Disorders Identification Test",
    category: "Alcohol & tobacco",
    summary: "The full ten-question WHO alcohol screen covering drinking, dependence and harm.",
    audience: "Adults (18+)",
    minutes: 3,
    intro: "Questions refer to the last year. One drink means one standard drink (10 grams of alcohol in Australia).",
    items: [
      { id: "q1", ...AUDIT_Q1 }, { id: "q2", ...AUDIT_Q2 }, { id: "q3", ...AUDIT_Q3 },
      ...[
        "How often during the last year have you found that you were not able to stop drinking once you had started?",
        "How often during the last year have you failed to do what was normally expected from you because of drinking?",
        "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
        "How often during the last year have you had a feeling of guilt or remorse after drinking?",
        "How often during the last year have you been unable to remember what happened the night before because you had been drinking?"
      ].map((t, i) => ({ id: `q${i + 4}`, text: t, options: OPTS.auditFreq })),
      { id: "q9", text: "Have you or someone else been injured as a result of your drinking?", options: OPTS.auditHarm },
      { id: "q10", text: "Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?", options: OPTS.auditHarm }
    ],
    score(a) {
      const s = sum(a, Array.from({ length: 10 }, (_, i) => `q${i + 1}`));
      const b = band(s, [
        { min: 0, max: 7, label: "Zone I – lower risk", level: "ok" },
        { min: 8, max: 15, label: "Zone II – hazardous drinking", level: "low" },
        { min: 16, max: 19, label: "Zone III – harmful drinking", level: "mid" },
        { min: 20, max: 40, label: "Zone IV – possible dependence", level: "high" }
      ]);
      const notes = ["Risk zones follow the WHO AUDIT manual (2001)."];
      if (s >= 20) notes.push("Stopping alcohol suddenly after heavy regular drinking can be dangerous. Please seek medical advice before cutting down.");
      return { score: s, max: 40, label: b.label, level: b.level, notes };
    },
    licence: "© World Health Organization 2001. The AUDIT may be reproduced for non-commercial purposes.",
    refs: [REF.audit, REF.auditManual]
  },
  {
    id: "ftnd",
    name: "FTND",
    title: "Fagerström Test for Nicotine Dependence",
    category: "Alcohol & tobacco",
    summary: "Six questions for people who smoke cigarettes, measuring physical dependence on nicotine.",
    audience: "Adults who smoke",
    minutes: 2,
    items: [
      { id: "q1", text: "How soon after you wake up do you smoke your first cigarette?", options: [
        { label: "Within 5 minutes", value: 3 }, { label: "6–30 minutes", value: 2 },
        { label: "31–60 minutes", value: 1 }, { label: "After 60 minutes", value: 0 }] },
      { id: "q2", text: "Do you find it difficult to refrain from smoking in places where it is forbidden (e.g. in church, at the library, in the cinema)?", options: OPTS.yesno },
      { id: "q3", text: "Which cigarette would you hate most to give up?", options: [
        { label: "The first one in the morning", value: 1 }, { label: "Any other", value: 0 }] },
      { id: "q4", text: "How many cigarettes per day do you smoke?", options: [
        { label: "10 or less", value: 0 }, { label: "11–20", value: 1 },
        { label: "21–30", value: 2 }, { label: "31 or more", value: 3 }] },
      { id: "q5", text: "Do you smoke more frequently during the first hours after waking than during the rest of the day?", options: OPTS.yesno },
      { id: "q6", text: "Do you smoke if you are so ill that you are in bed most of the day?", options: OPTS.yesno }
    ],
    score(a) {
      const s = sum(a, ["q1","q2","q3","q4","q5","q6"]);
      const b = band(s, [
        { min: 0, max: 2, label: "Low dependence", level: "ok" },
        { min: 3, max: 4, label: "Low to moderate dependence", level: "low" },
        { min: 5, max: 7, label: "Moderate dependence", level: "mid" },
        { min: 8, max: 10, label: "High dependence", level: "high" }
      ]);
      return { score: s, max: 10, label: b.label, level: b.level,
        notes: ["Help to quit is free in Australia through Quitline (13 7848). Higher scores usually mean nicotine replacement or other medicines can make quitting easier — ask a pharmacist or doctor."] };
    },
    licence: "© Taylor & Francis Ltd. The FTND may be reproduced without permission, as available from the source reference (Heatherton et al., 1991).",
    refs: [REF.ftnd]
  },

  /* ---------------- Physical health & lifestyle ---------------- */
  {
    id: "bmi",
    name: "BMI",
    title: "Body Mass Index calculator",
    category: "Physical health & lifestyle",
    summary: "Weight relative to height, with WHO categories and the WHO action points for Asian populations.",
    audience: "Adults (18+). Not for children, pregnancy or very muscular people.",
    minutes: 1,
    kind: "calc",
    fields: [
      { id: "h", label: "Height (cm)", min: 100, max: 250, step: 0.1 },
      { id: "w", label: "Weight (kg)", min: 25, max: 350, step: 0.1 },
      { id: "asian", label: "Use cut-offs for people of Asian background", type: "select", options: [{ label: "No (WHO international)", value: 0 }, { label: "Yes (WHO 2004 action points)", value: 1 }] }
    ],
    score(a) {
      const h = Number(a.h) / 100, w = Number(a.w);
      const bmi = Math.round((w / (h * h)) * 10) / 10;
      const asian = Number(a.asian) === 1;
      const bands = asian
        ? [
            { min: 0, max: 18.49, label: "Underweight", level: "mid" },
            { min: 18.5, max: 22.99, label: "Healthy weight range", level: "ok" },
            { min: 23, max: 27.49, label: "Increased risk (overweight action point)", level: "low" },
            { min: 27.5, max: 999, label: "High risk (obesity action point)", level: "high" }
          ]
        : [
            { min: 0, max: 18.49, label: "Underweight", level: "mid" },
            { min: 18.5, max: 24.99, label: "Healthy weight range", level: "ok" },
            { min: 25, max: 29.99, label: "Overweight", level: "low" },
            { min: 30, max: 34.99, label: "Obesity class I", level: "mid" },
            { min: 35, max: 39.99, label: "Obesity class II", level: "high" },
            { min: 40, max: 999, label: "Obesity class III", level: "high" }
          ];
      const b = band(bmi, bands);
      return { score: bmi, unit: " kg/m²", label: b.label, level: b.level,
        notes: [`Calculation: ${w} kg ÷ (${(h).toFixed(2)} m)² = ${bmi}.`, "BMI does not measure body fat directly and can be misleading for athletes, older adults and some ethnic groups. Waist measurement adds useful information."] };
    },
    licence: "BMI is a public-domain calculation. Category cut-offs follow the World Health Organization.",
    refs: [REF.bmiAsia]
  },
  {
    id: "whtr",
    name: "Waist-to-height ratio",
    title: "Waist-to-height ratio",
    category: "Physical health & lifestyle",
    summary: "A simple measure of central body fat. Keep your waist to less than half your height.",
    audience: "Adults (18+)",
    minutes: 1,
    kind: "calc",
    intro: "Measure your waist midway between the bottom of your ribs and the top of your hip bone, after breathing out normally.",
    fields: [
      { id: "waist", label: "Waist (cm)", min: 40, max: 250, step: 0.1 },
      { id: "h", label: "Height (cm)", min: 100, max: 250, step: 0.1 }
    ],
    score(a) {
      const r = Math.round((Number(a.waist) / Number(a.h)) * 100) / 100;
      return r >= 0.5
        ? { score: r, label: "At or above 0.5 – increased cardiometabolic risk", level: "mid", notes: [`Calculation: ${a.waist} ÷ ${a.h} = ${r}.`, "A ratio of 0.5 or more has been linked with higher risk of heart disease and type 2 diabetes in many populations."] }
        : { score: r, label: "Below 0.5", level: "ok", notes: [`Calculation: ${a.waist} ÷ ${a.h} = ${r}.`] };
    },
    licence: "Public-domain calculation. Boundary value from Ashwell et al. (2012).",
    refs: [REF.whtr]
  },
  {
    id: "ipaq",
    name: "IPAQ-SF",
    title: "International Physical Activity Questionnaire – Short Form",
    category: "Physical health & lifestyle",
    summary: "Your physical activity over the last 7 days, scored as MET-minutes per week and an activity level.",
    audience: "Ages 15–69",
    minutes: 3,
    kind: "calc",
    intro: "Think about all the activities you did in the last 7 days — at work, at home, getting from place to place, and in your spare time. Only count activities that lasted at least 10 minutes at a time. Enter 0 if none.",
    fields: [
      { id: "vd", label: "Days with VIGOROUS activity (e.g. heavy lifting, digging, aerobics, fast bicycling)", min: 0, max: 7, step: 1 },
      { id: "vm", label: "Usual minutes of vigorous activity on one of those days", min: 0, max: 960, step: 1 },
      { id: "md", label: "Days with MODERATE activity (e.g. carrying light loads, bicycling at a regular pace, doubles tennis). Do not include walking.", min: 0, max: 7, step: 1 },
      { id: "mm", label: "Usual minutes of moderate activity on one of those days", min: 0, max: 960, step: 1 },
      { id: "wd", label: "Days on which you walked for at least 10 minutes at a time", min: 0, max: 7, step: 1 },
      { id: "wm", label: "Usual minutes of walking on one of those days", min: 0, max: 960, step: 1 },
      { id: "sit", label: "Minutes spent sitting on a typical weekday (optional, not scored)", min: 0, max: 1440, step: 1, optional: true }
    ],
    score(a) {
      // IPAQ data-processing rules: bouts <10 min count as 0; >180 min/day truncated to 180.
      const clean = (d, m) => { d = Number(d) || 0; m = Number(m) || 0; if (m < 10) { m = 0; } if (m > 180) m = 180; if (m === 0) d = 0; return [d, m]; };
      const [vd, vm] = clean(a.vd, a.vm), [md, mm] = clean(a.md, a.mm), [wd, wm] = clean(a.wd, a.wm);
      const vMet = 8.0 * vm * vd, mMet = 4.0 * mm * md, wMet = 3.3 * wm * wd;
      const total = Math.round(vMet + mMet + wMet);
      const days = Math.min(7, vd + md + wd);
      let label = "Low", level = "mid";
      if ((vd >= 3 && total >= 1500) || (days >= 7 && total >= 3000)) { label = "High"; level = "ok"; }
      else if ((vd >= 3 && vm >= 20) || ((mm >= 30 ? md : 0) + (wm >= 30 ? wd : 0) >= 5) || (days >= 5 && total >= 600)) { label = "Moderate"; level = "ok"; }
      return { score: total, unit: " MET-min/week", label: label + " physical activity level", level,
        notes: [`Walking ${Math.round(wMet)} + moderate ${Math.round(mMet)} + vigorous ${Math.round(vMet)} MET-minutes (IPAQ scoring protocol, Nov 2005).`,
                "Australia's guidelines for adults suggest 2½ to 5 hours of moderate or 1¼ to 2½ hours of vigorous activity each week, plus muscle-strengthening activity on at least 2 days."] };
    },
    licence: "The IPAQ is freely available and may be used without permission (IPAQ Research Committee).",
    refs: [REF.ipaq, REF.ipaqScore]
  }
];

/*
 * Tools that are listed but NOT built as interactive versions, with the reason.
 * Visitors are sent to the official source instead.
 */
const LINKED_TOOLS = [
  { name: "CRT6 – Concussion Recognition Tool 6", category: "Sport & concussion",
    why: "For anyone (coaches, parents, players) to recognise a suspected concussion. Digital re-formatting needs written consent from BMJ, so we link to the official version.",
    url: "https://doi.org/10.1136/bjsports-2023-107021", cite: "Echemendia RJ, et al. Br J Sports Med. 2023;57(11):692." },
  { name: "SCAT6 / Child SCAT6 – Sport Concussion Assessment Tool 6", category: "Sport & concussion",
    why: "For health professionals only, in the first days after injury. Digital re-formatting needs written consent from BMJ.",
    url: "https://doi.org/10.1136/bjsports-2023-107036", cite: "Echemendia RJ, et al. Br J Sports Med. 2023;57(11):622." },
  { name: "SCOAT6 – Sport Concussion Office Assessment Tool 6", category: "Sport & concussion",
    why: "For clinicians assessing concussion in the office setting from day 3 onwards. Requires a trained examiner and BMJ consent for digital use.",
    url: "https://doi.org/10.1136/bjsports-2023-106860", cite: "Patricios JS, et al. Introducing the SCOAT6. Br J Sports Med. 2023;57(11):648-650." },
  { name: "IOC SMHAT-1 (including APSQ)", category: "Sport & concussion",
    why: "For sports medicine clinicians working with elite athletes aged 16+. An interactive APSQ is planned once the item text has been checked against the original publication.",
    url: "https://doi.org/10.1136/bjsports-2020-102411", cite: "Gouttebarge V, et al. Br J Sports Med. 2021;55(1):30-37." },
  { name: "LEAF-Q – Low Energy Availability in Females Questionnaire", category: "Sport & concussion",
    why: "For female athletes. Planned; scoring has several sub-scales that need careful checking before release.",
    url: "https://doi.org/10.1136/bjsports-2013-093240", cite: "Melin A, et al. Br J Sports Med. 2014;48(7):540-545." },
  { name: "AUSDRISK – Australian Type 2 Diabetes Risk Assessment Tool", category: "Physical health & lifestyle",
    why: "Owned by the Australian Government, which asks website owners to link to its own interactive version or request permission first.",
    url: "https://www.health.gov.au/resources/apps-and-tools/the-australian-type-2-diabetes-risk-assessment-tool-ausdrisk", cite: "Australian Government Department of Health." },
  { name: "STOP-Bang – sleep apnoea risk", category: "Physical health & lifestyle",
    why: "Owned by Dr Frances Chung and University Health Network, Toronto. Use needs a licence, so we link to the official site.",
    url: "https://www.stopbang.ca", cite: "Chung F, et al. Chest. 2016;149(3):631-638." },
  { name: "SCOFF – eating disorder screen", category: "Mental health & wellbeing",
    why: "Free-use terms are not clearly stated by the authors. Planned once permission is confirmed. If you are worried about eating, contact the Butterfly Foundation (1800 33 4673).",
    url: "https://doi.org/10.1136/bmj.319.7223.1467", cite: "Morgan JF, Reid F, Lacey JH. BMJ. 1999;319(7223):1467-1468." }
];

if (typeof module !== "undefined") module.exports = { TOOLS, LINKED_TOOLS, REF };

/* Plain-language scoring method shown on every tool page (keeps the logic open to the user). */
const METHOD = {
  phq9: "Each of the 9 questions scores 0 (Not at all) to 3 (Nearly every day). Total 0–27. Bands: 0–4 minimal, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe. Any answer above 0 on question 9 is flagged. The difficulty question is not scored.",
  phq2: "Each question scores 0–3. Total 0–6. A total of 3 or more is a positive screen.",
  gad7: "Each of the 7 questions scores 0–3. Total 0–21. Bands: 0–4 minimal, 5–9 mild, 10–14 moderate, 15–21 severe. The difficulty question is not scored.",
  gad2: "Each question scores 0–3. Total 0–6. A total of 3 or more is a positive screen.",
  k10: "Each of the 10 questions scores 1 (None of the time) to 5 (All of the time). Total 10–50. Bands (Andrews & Slade, 2001): 10–15 low, 16–21 moderate, 22–29 high, 30–50 very high.",
  who5: "Each statement scores 0 (At no time) to 5 (All of the time). The raw total (0–25) is multiplied by 4 to give 0–100%. 50% or below suggests checking for depression; 28% or below is linked with likely depression.",
  pcptsd5: "If no traumatic event is reported, the score is 0. Otherwise each 'Yes' to the 5 questions scores 1. Total 0–5. 3 or more is a positive screen.",
  epds: "Each question scores 0–3 (questions 3 and 5–10 are reverse ordered on the form). Total 0–30. 10–12 possible depression; 13 or more probable depression. Any answer above 0 on question 10 is flagged.",
  gds15: "One point for each answer in the direction of depression ('No' to questions 1, 5, 7, 11, 13; 'Yes' to the others). Total 0–15. Above 5 suggests depression; 10 or more almost always indicates depression.",
  asrs6: "Count answers in the shaded range: 'Sometimes' or more for questions 1–3, 'Often' or more for questions 4–6. A count of 4 or more suggests symptoms consistent with adult ADHD.",
  phq15: "Each symptom scores 0 (not bothered), 1 (a little) or 2 (a lot). Total 0–30. Bands: 0–4 minimal, 5–9 low, 10–14 medium, 15–30 high.",
  auditc: "Each question scores 0–4. Total 0–12. Positive screen: 4 or more for men, 3 or more for women.",
  audit: "Questions 1–8 score 0–4; questions 9 and 10 score 0, 2 or 4. Total 0–40. Zones: 0–7 lower risk, 8–15 hazardous, 16–19 harmful, 20+ possible dependence.",
  ftnd: "Questions 1 and 4 score 0–3; the others 0–1. Total 0–10. 0–2 low, 3–4 low to moderate, 5–7 moderate, 8–10 high dependence.",
  bmi: "BMI = weight (kg) ÷ height (m)². WHO categories: under 18.5 underweight, 18.5–24.9 healthy, 25–29.9 overweight, 30+ obesity. WHO action points for Asian populations: 23 and 27.5.",
  whtr: "Waist (cm) ÷ height (cm). A ratio of 0.5 or more indicates increased cardiometabolic risk.",
  ipaq: "MET-minutes/week = 8.0 × vigorous minutes × days + 4.0 × moderate minutes × days + 3.3 × walking minutes × days. Bouts under 10 minutes count as 0 and daily time is capped at 180 minutes per activity type. Levels follow the IPAQ scoring protocol (high, moderate, low)."
};
TOOLS.forEach(t => { t.method = METHOD[t.id]; });
if (typeof module !== "undefined") module.exports.METHOD = METHOD;
