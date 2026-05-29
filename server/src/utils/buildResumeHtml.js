/**
 * buildResumeHtml.js
 *
 * Generates a clean, ATS-friendly A4 HTML resume that mirrors the
 * Joy Sengupta template style:
 *   - Single column, white background
 *   - Name large at top, contact row below
 *   - Thin horizontal rule separating sections
 *   - Section headers in small-caps with a bottom border
 *   - Bullet points for experience / projects
 *   - Skills as inline comma-separated lists per category
 *   - No images, no tables, no columns — pure text for ATS
 */

function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildResumeHtml(resumeData, targetRole = "") {
  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    softSkills = [],
    languages = [],
    references = [],
  } = resumeData;

  const { name = "", email = "", phone = "", address = "", title = "" } = personalInfo;

  // ── Contact row ──────────────────────────────────────────────────────────
  const contactParts = [email, phone, address].filter(Boolean).map(esc);
  const contactRow = contactParts.join(" &nbsp;|&nbsp; ");

  // ── Section helper ───────────────────────────────────────────────────────
  const section = (heading, content) =>
    content
      ? `<div class="section">
           <h2>${esc(heading)}</h2>
           ${content}
         </div>`
      : "";

  // ── Summary ──────────────────────────────────────────────────────────────
  const summaryHtml = summary
    ? section("Professional Summary", `<p class="summary">${esc(summary)}</p>`)
    : "";

  // ── Experience ───────────────────────────────────────────────────────────
  const expHtml = experience.length
    ? section(
        "Experience",
        experience
          .map((e) => {
            const bullets = (e.description || "")
              .split(/\n|•|–/)
              .map((b) => b.trim())
              .filter(Boolean);
            const bulletHtml = bullets.length
              ? `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
              : "";
            return `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${esc(e.position || "")}</span>
                  <span class="entry-date">${esc(e.duration || "")}</span>
                </div>
                <div class="entry-sub">${esc(e.company || "")}${e.location ? " &mdash; " + esc(e.location) : ""}</div>
                ${bulletHtml}
              </div>`;
          })
          .join("")
      )
    : "";

  // ── Education ────────────────────────────────────────────────────────────
  const eduHtml = education.length
    ? section(
        "Education",
        education
          .map(
            (e) => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${esc(e.degree || "")}</span>
                  <span class="entry-date">${esc(e.year || "")}</span>
                </div>
                <div class="entry-sub">${esc(e.institution || "")}</div>
              </div>`
          )
          .join("")
      )
    : "";

  // ── Skills ───────────────────────────────────────────────────────────────
  const skillNames = softSkills.map((s) => esc(s.name || s)).filter(Boolean);
  const skillsHtml = skillNames.length
    ? section(
        "Skills",
        `<p class="skills-line">${skillNames.join(" &nbsp;&bull;&nbsp; ")}</p>`
      )
    : "";

  // ── Languages ────────────────────────────────────────────────────────────
  const langHtml = languages.length
    ? section(
        "Languages",
        `<p class="skills-line">${languages
          .map((l) => {
            const prof = l.proficiency ? ` (${esc(l.proficiency)})` : "";
            return `${esc(l.name || l)}${prof}`;
          })
          .join(" &nbsp;&bull;&nbsp; ")}</p>`
      )
    : "";

  // ── References ───────────────────────────────────────────────────────────
  const refHtml = references.length
    ? section(
        "References",
        references
          .map(
            (r) =>
              `<div class="entry"><span class="entry-title">${esc(r.name)}</span> &mdash; ${esc(r.contact)}</div>`
          )
          .join("")
      )
    : "";

  // ── Target role note (hidden from print, for context only) ───────────────
  const roleNote = targetRole
    ? `<!-- Tailored for: ${esc(targetRole)} -->`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(name)} – Resume</title>
<style>
  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  html, body {
    width: 210mm;
    background: #fff;
    color: #111;
    font-family: "Calibri", "Segoe UI", Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 14mm 16mm 14mm 16mm;
  }

  /* ── Header ── */
  .header { text-align: center; margin-bottom: 6px; }
  .header h1 {
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #1a1a1a;
  }
  .header .job-title {
    font-size: 10pt;
    color: #555;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
  .header .contact {
    font-size: 9pt;
    color: #444;
    margin-top: 4px;
  }
  .header .contact a { color: #444; text-decoration: none; }

  /* ── Divider ── */
  hr { border: none; border-top: 1.5px solid #222; margin: 7px 0; }

  /* ── Sections ── */
  .section { margin-bottom: 10px; }
  .section h2 {
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #1a1a1a;
    border-bottom: 1px solid #aaa;
    padding-bottom: 2px;
    margin-bottom: 5px;
  }

  /* ── Entries ── */
  .entry { margin-bottom: 6px; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .entry-title { font-weight: 700; font-size: 10pt; }
  .entry-date  { font-size: 9pt; color: #555; white-space: nowrap; margin-left: 8px; }
  .entry-sub   { font-size: 9.5pt; color: #444; font-style: italic; margin-bottom: 2px; }

  /* ── Bullets ── */
  ul { margin: 3px 0 0 16px; padding: 0; }
  li { margin-bottom: 2px; font-size: 9.5pt; }

  /* ── Summary ── */
  .summary { font-size: 9.5pt; color: #333; }

  /* ── Skills ── */
  .skills-line { font-size: 9.5pt; color: #333; }

  /* ── Print ── */
  @media print {
    html, body { width: 210mm; }
    .page { padding: 12mm 14mm; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
${roleNote}
<div class="page">

  <!-- Header -->
  <div class="header">
    <h1>${esc(name)}</h1>
    ${title ? `<div class="job-title">${esc(title)}</div>` : ""}
    ${contactRow ? `<div class="contact">${contactRow}</div>` : ""}
  </div>

  <hr/>

  ${summaryHtml}
  ${expHtml}
  ${eduHtml}
  ${skillsHtml}
  ${langHtml}
  ${refHtml}

</div>
</body>
</html>`;
}

module.exports = { buildResumeHtml };
