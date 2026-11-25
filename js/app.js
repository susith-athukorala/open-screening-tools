/* Open Screening Tools – app logic
 * All answers live in memory only (the `state` object). Nothing is written to
 * cookies, localStorage, sessionStorage or IndexedDB, and nothing is sent over
 * the network. Closing or refreshing the page erases everything.
 */
(function () {
  "use strict";

  const SITE_NAME = "Open Screening Tools";
  const app = document.getElementById("app");
  const state = { answers: {}, ack: false, toolId: null };

  /* ---------- tiny DOM helper (no innerHTML with user data) ---------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "text") el.textContent = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === "string" || typeof kid === "number" ? document.createTextNode(String(kid)) : kid);
    }
    return el;
  }
  const ext = (href, text) => h("a", { href, target: "_blank", rel: "noopener noreferrer" }, text);

  /* ---------- shared blocks ---------- */
  function disclaimerBox(compact) {
    return h("div", { class: "notice notice-warn", role: "note" },
      h("strong", null, "Screening only — not a diagnosis. "),
      "This tool gives a score from a published questionnaire. It is not a diagnosis, it is not medical advice, and it does not replace a consultation with a doctor or other qualified health professional. ",
      compact ? null : "Scores can be wrong in either direction. If you are worried about your health, please see a health professional whatever your score. ",
      h("a", { href: "#/disclaimer" }, "Full disclaimer"), ".");
  }

  function privacyLine() {
    return h("p", { class: "privacy-line" },
      "🔒 Your answers stay on this device. They are not saved, collected or sent anywhere. ",
      h("a", { href: "#/privacy" }, "How privacy works here"), ".");
  }

  function supportBox(extra) {
    const box = h("section", { class: "notice notice-crisis", role: "alert", "aria-live": "assertive" },
      h("h3", null, "If you need help now"),
      h("p", null, "If you are in immediate danger or thinking of ending your life, call emergency services now."),
      h("div", { class: "support-grid" },
        h("div", null,
          h("h4", null, "Australia"),
          h("ul", null,
            h("li", null, h("strong", null, "000"), " – emergency"),
            h("li", null, h("strong", null, "13 11 14"), " – Lifeline (24/7)"),
            h("li", null, h("strong", null, "1300 659 467"), " – Suicide Call Back Service"),
            h("li", null, h("strong", null, "1300 22 4636"), " – Beyond Blue"),
            h("li", null, h("strong", null, "13 92 76"), " – 13YARN (Aboriginal & Torres Strait Islander)"),
            extra === "perinatal" ? h("li", null, h("strong", null, "1300 726 306"), " – PANDA perinatal helpline") : null)),
        h("div", null,
          h("h4", null, "Sri Lanka"),
          h("ul", null,
            h("li", null, h("strong", null, "1990"), " – Suwa Seriya ambulance"),
            h("li", null, h("strong", null, "119"), " – police emergency"),
            h("li", null, h("strong", null, "1926"), " – National Mental Health Helpline (24/7)"),
            h("li", null, h("strong", null, "1333"), " – CCCline crisis support"))),
        h("div", null,
          h("h4", null, "Anywhere else"),
          h("p", null, "Find a free, confidential helpline in your country at ", ext("https://findahelpline.com", "findahelpline.com"), "."))));
    return box;
  }

  function refsBlock(tool) {
    return h("section", { class: "sources" },
      h("h3", null, "Source, licence and credit"),
      h("p", { class: "licence" }, tool.licence),
      h("ol", null, tool.refs.map(r => h("li", null, r.text, " ",
        r.doi ? ext("https://doi.org/" + r.doi, "doi:" + r.doi) : ext(r.url, "Link")))));
  }

  /* ---------- home ---------- */
  function renderHome() {
    document.title = SITE_NAME + " – free, private health screening questionnaires";
    const cats = [...new Set(TOOLS.map(t => t.category))];
    let filter = "All", query = "";

    const grid = h("div", { class: "tool-sections" });
    function draw() {
      grid.replaceChildren();
      const q = query.trim().toLowerCase();
      cats.forEach(cat => {
        if (filter !== "All" && filter !== cat) return;
        const list = TOOLS.filter(t => t.category === cat &&
          (!q || (t.name + " " + t.title + " " + t.summary).toLowerCase().includes(q)));
        if (!list.length) return;
        grid.appendChild(h("section", { class: "cat" },
          h("h2", null, cat),
          h("div", { class: "cards" }, list.map(t =>
            h("a", { class: "card", href: "#/tool/" + t.id },
              h("span", { class: "card-tag" }, t.name),
              h("h3", null, t.title),
              h("p", null, t.summary),
              h("span", { class: "card-meta" }, `${t.audience} · about ${t.minutes} min`))))));
      });
      if (!grid.children.length) grid.appendChild(h("p", { class: "empty" }, "No tools match your search."));
    }

    const chips = h("div", { class: "chips", role: "group", "aria-label": "Filter by category" },
      ["All", ...cats].map(c => h("button", { type: "button", class: "chip" + (c === filter ? " on" : ""), "aria-pressed": String(c === filter),
        onclick: e => { filter = c; chips.querySelectorAll(".chip").forEach(b => { b.classList.toggle("on", b === e.currentTarget); b.setAttribute("aria-pressed", String(b === e.currentTarget)); }); draw(); } }, c)));

    app.replaceChildren(
      h("section", { class: "hero" },
        h("h1", null, "Free, private health screening questionnaires"),
        h("p", { class: "lead" }, "Validated questionnaires from published research, scored in your browser. Use them to understand your results and to start a conversation with your doctor."),
        h("ul", { class: "promises" },
          h("li", null, "No sign-up"), h("li", null, "Nothing saved or sent"), h("li", null, "Every source credited"))),
      disclaimerBox(false),
      h("div", { class: "toolbar" },
        h("label", { class: "sr-only", for: "search" }, "Search tools"),
        h("input", { id: "search", type: "search", placeholder: "Search, e.g. anxiety, alcohol, sleep…", autocomplete: "off",
          oninput: e => { query = e.target.value; draw(); } }),
        chips),
      grid,
      h("section", { class: "cat linked" },
        h("h2", null, "Other useful tools (official versions)"),
        h("p", null, "These tools are listed for completeness but are not built here, because their owners require permission for digital versions, they need a trained examiner, or we have not yet finished checking them. The links take you to the official source."),
        h("div", { class: "cards" }, LINKED_TOOLS.map(l =>
          h("a", { class: "card card-link", href: l.url, target: "_blank", rel: "noopener noreferrer" },
            h("span", { class: "card-tag muted" }, l.category),
            h("h3", null, l.name, " ↗"),
            h("p", null, l.why),
            h("span", { class: "card-meta" }, l.cite))))),
      supportBox());
    draw();
  }

  /* ---------- tool page ---------- */
  // state.answers holds the chosen option index; showIf rules use the scored values.
  function currentValues(tool) {
    const v = {};
    (tool.items || []).forEach(i => { if (state.answers[i.id] !== undefined) v[i.id] = i.options[state.answers[i.id]].value; });
    return v;
  }
  function visibleItems(tool) {
    const v = currentValues(tool);
    return tool.items.filter(i => !i.showIf || i.showIf(v));
  }

  function renderTool(id) {
    const tool = TOOLS.find(t => t.id === id);
    if (!tool) return renderNotFound();
    if (state.toolId !== id) { state.answers = {}; state.ack = false; state.toolId = id; }
    document.title = `${tool.name} – ${SITE_NAME}`;

    const form = h("form", { class: "tool-form", novalidate: true, onsubmit: e => { e.preventDefault(); showResult(); } });
    const result = h("div", { id: "result", tabindex: "-1" });
    const progress = h("div", { class: "progress", "aria-hidden": "true" }, h("span"));
    const submit = h("button", { type: "submit", class: "btn btn-primary", disabled: true }, "See my score");

    function complete() {
      if (tool.kind === "calc") return tool.fields.every(f => f.optional || (state.answers[f.id] !== undefined && state.answers[f.id] !== ""));
      return visibleItems(tool).every(i => i.optional || state.answers[i.id] !== undefined);
    }
    function updateProgress() {
      const req = tool.kind === "calc" ? tool.fields.filter(f => !f.optional) : visibleItems(tool).filter(i => !i.optional);
      const done = req.filter(i => state.answers[i.id] !== undefined && state.answers[i.id] !== "").length;
      progress.firstChild.style.width = (req.length ? (done / req.length) * 100 : 0) + "%";
      submit.disabled = !state.ack || !complete();
    }

    function drawItems() {
      form.replaceChildren();
      if (tool.intro) form.appendChild(h("p", { class: "intro" }, tool.intro));
      if (tool.stem) form.appendChild(h("p", { class: "stem" }, tool.stem));

      if (tool.kind === "calc") {
        tool.fields.forEach(f => {
          const fid = "f_" + f.id;
          let input;
          if (f.type === "select") {
            input = h("select", { id: fid, disabled: !state.ack, onchange: e => { state.answers[f.id] = e.target.value; updateProgress(); } },
              f.options.map(o => h("option", { value: o.value }, o.label)));
            if (state.answers[f.id] === undefined) state.answers[f.id] = String(f.options[0].value);
            input.value = state.answers[f.id];
          } else {
            input = h("input", { id: fid, type: "number", inputmode: "decimal", min: f.min, max: f.max, step: f.step, disabled: !state.ack,
              value: state.answers[f.id] ?? "",
              oninput: e => {
                const v = e.target.value;
                const ok = v !== "" && Number(v) >= f.min && Number(v) <= f.max;
                e.target.setAttribute("aria-invalid", String(v !== "" && !ok));
                if (ok) state.answers[f.id] = v; else delete state.answers[f.id];
                updateProgress();
              } });
          }
          form.appendChild(h("div", { class: "field" },
            h("label", { for: fid }, f.label),
            input,
            f.type === "select" ? null : h("span", { class: "hint" }, `Between ${f.min} and ${f.max}`)));
        });
      } else {
        visibleItems(tool).forEach((item, idx) => {
          const name = "i_" + item.id;
          form.appendChild(h("fieldset", { class: "item" + (item.optional ? " optional" : "") },
            h("legend", null, h("span", { class: "num" }, String(idx + 1)), item.text, item.optional ? h("em", null, " (optional, not scored)") : null),
            h("div", { class: "opts" }, item.options.map((o, oi) => {
              const oid = `${name}_${oi}`;
              const checked = state.answers[item.id] !== undefined && state.answers[item.id] === oi;
              return h("label", { class: "opt", for: oid },
                h("input", { type: "radio", id: oid, name, value: oi, checked, disabled: !state.ack,
                  onchange: () => {
                    state.answers[item.id] = oi;
                    // dependent questions may appear or disappear
                    if (tool.items.some(i => i.showIf)) { drawItems(); }
                    updateProgress();
                  } }),
                h("span", null, o.label));
            }))));
        });
      }
      form.appendChild(h("div", { class: "actions" }, submit,
        h("button", { type: "button", class: "btn", onclick: clearAll }, "Clear answers")));
      updateProgress();
    }

    // Convert stored option indexes to the scored values the instrument defines.
    function scoredAnswers() {
      if (tool.kind === "calc") return { ...state.answers };
      const out = {};
      const shown = new Set(visibleItems(tool).map(i => i.id));
      tool.items.filter(i => shown.has(i.id)).forEach(i => { if (state.answers[i.id] !== undefined) out[i.id] = i.options[state.answers[i.id]].value; });
      return out;
    }

    function showResult() {
      if (!complete()) return;
      const a = scoredAnswers();
      const r = tool.score(a);
      const crisis = tool.crisis ? tool.crisis(a) : false;
      result.replaceChildren(
        h("section", { class: "result level-" + (crisis ? "high" : r.level) },
          h("p", { class: "result-kicker" }, `${tool.name} result`),
          h("p", { class: "result-score" },
            h("span", { class: "big" }, String(r.score) + (r.unit || "")),
            r.max != null && !r.unit ? h("span", { class: "of" }, ` / ${r.max}`) : null),
          h("p", { class: "result-label" }, r.label),
          h("ul", { class: "result-notes" }, r.notes.map(n => h("li", null, n))),
          answersTable(),
          h("p", { class: "result-date" }, "Completed " + new Date().toLocaleString()),
          h("div", { class: "notice notice-warn small" },
            h("strong", null, "What this result is not: "),
            "it is not a diagnosis and not a doctor's recommendation. Only a qualified health professional who can talk with you and examine you can make a diagnosis. Consider printing this page or saving it as a PDF to take to your appointment."),
          h("div", { class: "actions no-print" },
            h("button", { type: "button", class: "btn btn-primary", onclick: () => { result.querySelectorAll("details").forEach(d => { d.open = true; }); window.print(); } }, "Print or save as PDF"),
            h("button", { type: "button", class: "btn", onclick: () => downloadFhir(tool, a, r) }, "Download as FHIR JSON"),
            h("button", { type: "button", class: "btn", onclick: clearAll }, "Clear and start again"))),
        crisis ? supportBox(tool.extraSupport) : null);
      result.focus();
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function answersTable() {
      if (tool.kind === "calc") return null;
      const rows = visibleItems(tool).filter(i => state.answers[i.id] !== undefined).map((i, n) => {
        const o = i.options[state.answers[i.id]];
        return h("tr", null, h("td", null, String(n + 1)), h("td", null, i.text), h("td", null, o.label), h("td", { class: "pts" }, i.scored === false ? "–" : String(o.value)));
      });
      return h("details", { class: "answers" }, h("summary", null, "Show my answers and points"),
        h("table", null, h("thead", null, h("tr", null, h("th", null, "#"), h("th", null, "Question"), h("th", null, "Your answer"), h("th", null, "Points"))), h("tbody", null, rows)));
    }

    function clearAll() {
      state.answers = {};
      result.replaceChildren();
      drawItems();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const ackBox = h("label", { class: "ack" },
      h("input", { type: "checkbox", checked: state.ack, onchange: e => { state.ack = e.target.checked; drawItems(); } }),
      h("span", null, "I understand this is a screening questionnaire only. It is not a diagnosis or a doctor's recommendation, and my answers are not saved or sent anywhere."));

    app.replaceChildren(
      h("nav", { class: "crumbs", "aria-label": "Breadcrumb" }, h("a", { href: "#/" }, "All tools"), " / ", tool.category),
      h("header", { class: "tool-head" },
        h("span", { class: "card-tag" }, tool.name),
        h("h1", null, tool.title),
        h("p", { class: "lead" }, tool.summary),
        h("p", { class: "meta" }, `Intended for: ${tool.audience} · About ${tool.minutes} minute${tool.minutes > 1 ? "s" : ""}`)),
      disclaimerBox(false),
      privacyLine(),
      ackBox,
      progress,
      form,
      result,
      h("section", { class: "method" }, h("h3", null, "How the score is worked out"), h("p", null, tool.method)),
      refsBlock(tool),
      tool.crisis || tool.category === "Mental health & wellbeing" || tool.extraSupport ? h("details", { class: "support-details" },
        h("summary", null, "Support contacts"), supportBox(tool.extraSupport)) : null);
    drawItems();
  }

  /* ---------- FHIR export (generated and downloaded locally) ----------
   * PHQ-9 and GAD-7 (pilot) export an SDC QuestionnaireResponse coded with LOINC,
   * pointing at the published Questionnaire under /fhir/Questionnaire/. The receiving
   * system adds QuestionnaireResponse.subject and can run SDC $extract to create an
   * AU Core Diagnostic Result Observation. The website never adds a patient.
   */
  const FHIR_BASE = "https://www.susith.lk/open-screening-tools/fhir"; // keep in step with fhir-src/build.js

  function downloadFhir(tool, scored, r) {
    const codes = (window.FHIR_CODES && window.FHIR_CODES.PILOT[tool.id]) || null;
    const qr = {
      resourceType: "QuestionnaireResponse",
      meta: {
        profile: codes ? ["http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponse"] : undefined,
        tag: [{ system: FHIR_BASE + "/tags", code: "self-screening", display: "Self-completed screening - not a diagnosis" }]
      },
      questionnaire: codes ? `${FHIR_BASE}/Questionnaire/${tool.id}|0.1.0` : undefined,
      status: "completed",
      authored: new Date().toISOString(),
      item: []
    };
    if (tool.kind === "calc") {
      tool.fields.forEach(f => {
        if (state.answers[f.id] === undefined || state.answers[f.id] === "") return;
        qr.item.push({ linkId: f.id, text: f.label, answer: [{ valueDecimal: Number(state.answers[f.id]) }] });
      });
    } else {
      const shown = visibleItems(tool);
      shown.forEach(i => {
        const idx = state.answers[i.id];
        if (idx === undefined) return;
        const o = i.options[idx];
        let coding = { code: String(o.value), display: o.label };
        if (codes) {
          const list = i.id === "difficulty" ? window.FHIR_CODES.DIFFICULTY_ANSWERS : window.FHIR_CODES.FREQ_ANSWERS;
          const hit = list.find(a => a.display === o.label);
          if (hit) coding = { system: window.FHIR_CODES.LOINC, code: hit.code, display: hit.display };
        }
        qr.item.push({ linkId: i.id, text: i.text, answer: [{ valueCoding: coding }] });
      });
    }
    const isInt = Number.isInteger(Number(r.score));
    qr.item.push({ linkId: "total", text: `${tool.name} total score`, answer: [isInt && codes ? { valueInteger: Number(r.score) } : { valueDecimal: Number(r.score) }] });
    qr.item.push({ linkId: "interpretation", text: "Published score band (screening only, not a diagnosis)", answer: [{ valueString: r.label }] });
    const clean = JSON.parse(JSON.stringify(qr)); // drops undefined fields
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/fhir+json" });
    const url = URL.createObjectURL(blob);
    const a = h("a", { href: url, download: `${tool.id}-questionnaire-response.json` });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------- static pages ---------- */
  function page(title, ...body) {
    document.title = `${title} – ${SITE_NAME}`;
    app.replaceChildren(h("nav", { class: "crumbs" }, h("a", { href: "#/" }, "All tools")), h("article", { class: "prose" }, h("h1", null, title), ...body));
  }

  function renderPrivacy() {
    page("Privacy, data and information security",
      h("p", { class: "lead" }, "In short: this website does not collect, store, process or share any personal information or any of your answers."),
      h("h2", null, "What happens to your answers"),
      h("ul", null,
        h("li", null, "Your answers are held only in your browser's working memory while the page is open. Scores are calculated on your own device."),
        h("li", null, "Answers are never sent to us or to anyone else. The site has no server, no database, no forms that submit data and no user accounts."),
        h("li", null, "Answers are not written to cookies, local storage, session storage or any other browser storage. Refreshing or closing the page erases them."),
        h("li", null, "If you choose ", h("em", null, "Print"), " or ", h("em", null, "Download as FHIR JSON"), ", the file is created on your device and saved wherever you choose. Keeping that file safe is up to you.")),
      h("h2", null, "Please do not enter personal details"),
      h("p", null, "None of the tools ask for your name, date of birth, address, Medicare or NIC number, or any other identifying details, and there is nowhere to type them. Please do not add identifying details to any printed or downloaded result you share."),
      h("h2", null, "No tracking"),
      h("ul", null,
        h("li", null, "No cookies, analytics, advertising, tracking pixels, social media widgets or third-party scripts."),
        h("li", null, "No external fonts or content delivery networks. Every file is served from this site."),
        h("li", null, "A Content Security Policy blocks the page from making network connections, so even a faulty script could not send your answers anywhere.")),
      h("h2", null, "What the hosting provider sees"),
      h("p", null, "This site is hosted on GitHub Pages. Like any web host, GitHub may record technical information when your browser requests a page, such as your IP address, browser type and the time of the request, for security and operational purposes. This is handled under ",
        ext("https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement", "GitHub's privacy statement"),
        ". Your questionnaire answers are never part of these requests."),
      h("h2", null, "Using a shared or work device"),
      h("p", null, "Because nothing is stored, there is nothing to clear afterwards. If you printed or downloaded a result on a shared device, remember to delete the file. You can also use a private or incognito window."),
      h("h2", null, "Contact"),
      h("p", null, "Questions about this policy can be raised through the project's GitHub repository."),
      h("p", { class: "muted" }, "Last reviewed: November 2026."));
  }

  function renderDisclaimer() {
    page("Medical disclaimer",
      h("p", { class: "lead" }, "Every tool on this website is a screening or self-assessment questionnaire. None of them is a diagnosis."),
      h("ul", null,
        h("li", null, "Results are not medical advice and are not a doctor's recommendation. They do not replace a consultation, examination or assessment by a registered health professional."),
        h("li", null, "Screening questionnaires can miss real problems (false negatives) and can flag problems that are not there (false positives). A low score does not mean you are well, and a high score does not mean you have a condition."),
        h("li", null, "Score bands are taken from the published research cited on each tool. They were developed in particular populations and may not apply equally to everyone."),
        h("li", null, "Most tools are designed for adults. They have not been checked for use by children unless stated."),
        h("li", null, "Do not start, stop or change any treatment or medicine because of a score on this site."),
        h("li", null, "If you have new, severe or worsening symptoms, or you are worried about your safety, seek medical help straight away.")),
      h("p", null, "The site authors have taken care to reproduce each questionnaire and its scoring faithfully from the cited source, but no guarantee is given that the content is free of errors. Use of this site is at your own risk."),
      h("p", null, "This site is intended to meet the Therapeutic Goods Administration's exclusion for software that digitises published clinical rules and questionnaires, with the logic shown openly to the user. It is not a registered medical device."),
      supportBox());
  }

  function renderSources() {
    page("Sources and credits",
      h("p", { class: "lead" }, "Every questionnaire belongs to its authors and copyright holders. We reproduce them only where the holder allows free use, and we credit each one below."),
      ...TOOLS.map(t => h("section", { class: "src" }, h("h2", null, `${t.name} – ${t.title}`), refsBlock(t))),
      h("h2", null, "Tools linked but not reproduced"),
      h("ul", null, LINKED_TOOLS.map(l => h("li", null, h("strong", null, l.name), ". ", l.cite, " ", ext(l.url, "Official source"), " — ", l.why))),
      h("h2", null, "Website code"),
      h("p", null, "The website code is open source. The questionnaires themselves are not covered by the code licence and remain under their owners' terms."));
  }

  function renderAbout() {
    page("About this project",
      h("p", { class: "lead" }, "Open Screening Tools brings freely available, validated health questionnaires together in one place, so that anyone can complete them privately and take the result to their health professional."),
      h("h2", null, "How tools are chosen"),
      h("ul", null,
        h("li", null, "The questionnaire is published in a peer-reviewed journal or by a recognised health body."),
        h("li", null, "The copyright holder allows free reproduction, or the tool is in the public domain."),
        h("li", null, "A member of the public can complete it alone, without a trained examiner or equipment."),
        h("li", null, "Item wording and scoring are checked against the original source before release.")),
      h("h2", null, "For health professionals and educators"),
      h("p", null, "Each completed questionnaire can be downloaded as an HL7 FHIR R4 QuestionnaireResponse. The file is created on the user's device and is not sent anywhere. It is intended for teaching and for future interoperability work."),
      h("p", null, "PHQ-9 and GAD-7 (pilot) follow the HL7 Structured Data Capture (SDC) specification. Their published Questionnaires use LOINC codes for questions, answers and total scores, and SNOMED CT observable-entity codes for the scores. Each includes an extraction template that produces an Observation shaped for AU Core Diagnostic Result Observation (v2.0.0). The patient is never added by this website; a receiving clinical system adds it before extraction. ",
        h("a", { href: "fhir/index.json" }, "FHIR Questionnaire index"), "."),
      h("p", { class: "muted" }, "LOINC® codes © Regenstrief Institute, Inc., available at no cost under the license at loinc.org/license. SNOMED CT® codes © SNOMED International; use in Australia is licensed through the National Clinical Terminology Service, and use elsewhere depends on the licence in your country."),
      h("p", null, "Corrections are welcome through the project's GitHub repository."));
  }

  function renderNotFound() {
    page("Page not found", h("p", null, h("a", { href: "#/" }, "Go to all tools")));
  }

  /* ---------- router ---------- */
  function route() {
    const parts = (location.hash || "#/").replace(/^#\/?/, "").split("/");
    window.scrollTo(0, 0);
    switch (parts[0]) {
      case "": renderHome(); break;
      case "tool": renderTool(parts[1]); break;
      case "privacy": renderPrivacy(); break;
      case "disclaimer": renderDisclaimer(); break;
      case "sources": renderSources(); break;
      case "about": renderAbout(); break;
      default: renderNotFound();
    }
    document.querySelectorAll(".site-head nav a").forEach(a => {
      const on = a.dataset.route === (parts[0] === "tool" ? "" : parts[0]);
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  route();
})();
