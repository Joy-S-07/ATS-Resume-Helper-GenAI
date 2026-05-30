/**
 * buildResumeHtml.js — ATS-friendly A4 HTML resume (Joy Sengupta template style)
 *
 * Layout:
 *   - Single column, white background, A4 size
 *   - Optional circular profile photo — top-right, absolutely positioned
 *   - Name large + uppercase at top, job title + contact row below a rule
 *   - Section headers: uppercase, letter-spaced, bottom border
 *   - Experience bullets, education entries, skills/languages as inline lists
 *   - Pure text — no tables, no flex columns — fully ATS-safe
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
    profilePhoto = null,
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    softSkills = [],
    languages = [],
    references = [],
  } = resumeData || {};

  const {
    name = "",
    email = "",
    phone = "",
    address = "",
    title = "",
  } = personalInfo || {};

  // ── Contact row ──────────────────────────────────────────────────────────
  const contactParts = [email, phone, address].filter(Boolean).map(esc);
  const contactRow = contactParts.join(" &nbsp;|&nbsp; ");

  // ── Profile photo ────────────────────────────────────────────────────────
  // Accept base64 data URLs (from upload-photo) or https URLs
  const hasPhoto =
    profilePhoto &&
    typeof profilePhoto === "string" &&
    (profilePhoto.startsWith("data:image") || profilePhoto.startsWith("https://"));

  const photoHtml = hasPhoto
    ? `<img class="profile-photo" src="${profilePhoto}" alt="Profile" />`
    : "";

  // Header padding-right only when photo is present
  const headerPaddingRight = hasPhoto ? "padding-right: 30mm;" : "";

  // ── Section helper ───────────────────────────────────────────────────────
  const section = (heading, content) =>
    content
      ? `<div class="section"><h2>${esc(heading)}</h2>${content}</div>`
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
            return `<div class="entry">
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
            (e) => `<div class="entry">
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
  const skillNames = (softSkills || []).map((s) => esc(s.name || s)).filter(Boolean);
  const skillsHtml = skillNames.length
    ? section("Skills", `<p class="skills-line">${skillNames.join(" &nbsp;&bull;&nbsp; ")}</p>`)
    : "";

  // ── Languages ────────────────────────────────────────────────────────────
  const langHtml = (languages || []).length
    ? section(
        "Languages",
        `<p class="skills-line">${(languages || [])
          .map((l) => {
            const prof = l.proficiency ? ` (${esc(l.proficiency)})` : "";
            return `${esc(l.name || l)}${prof}`;
          })
          .join(" &nbsp;&bull;&nbsp; ")}</p>`
      )
    : "";

  // ── References ───────────────────────────────────────────────────────────
  const refHtml = (references || []).length
    ? section(
        "References",
        (references || [])
          .map(
            (r) =>
              `<div class="entry"><span class="entry-title">${esc(r.name)}</span> &mdash; ${esc(r.contact)}</div>`
          )
          .join("")
      )
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${esc(name)} Resume</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: 210mm;
    background: #fff;
    color: #111;
    font-family: Arial, "Helvetica Neue", sans-serif;
    font-size: 10pt;
    line-height: 1.5;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 15mm 18mm;
    position: relative;
  }

  /* Profile photo — circular, top-right */
  .profile-photo {
    position: absolute;
    top: 15mm;
    right: 18mm;
    width: 24mm;
    height: 24mm;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid #ccc;
  }

  /* Header */
  .header { margin-bottom: 8px; }
  .header h1 {
    font-size: 20pt;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #1a1a1a;
    line-height: 1.1;
  }
  .header .job-title { font-size: 10pt; color: #555; margin-top: 2px; }
  .header .contact   { font-size: 8.5pt; color: #444; margin-top: 5px; }

  /* Divider */
  hr { border: none; border-top: 1.5px solid #222; margin: 8px 0; }

  /* Sections */
  .section { margin-bottom: 11px; }
  .section h2 {
    font-size: 9.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #1a1a1a;
    border-bottom: 1px solid #bbb;
    padding-bottom: 2px;
    margin-bottom: 6px;
  }

  /* Entries */
  .entry { margin-bottom: 7px; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }
  .entry-title { font-weight: 700; font-size: 9.5pt; }
  .entry-date  { font-size: 8.5pt; color: #555; white-space: nowrap; flex-shrink: 0; }
  .entry-sub   { font-size: 9pt; color: #555; font-style: italic; margin: 1px 0 3px; }

  /* Bullets */
  ul { margin: 3px 0 0 15px; padding: 0; }
  li { margin-bottom: 2px; font-size: 9pt; }

  .summary    { font-size: 9pt; color: #333; }
  .skills-line { font-size: 9pt; color: #333; }

  @media print {
    @page { size: A4; margin: 0; }
    html, body { width: 210mm; }
    .page { padding: 15mm 18mm; }
  }
</style>
</head>
<body>
<div class="page">

  ${photoHtml}

  <div class="header" style="${headerPaddingRight}">
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
