const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

/**
 * Extracts plain text from a PDF or DOCX buffer.
 * @param {Buffer} buffer   - Raw file bytes
 * @param {string} filename - Original filename (used to detect type)
 * @returns {Promise<string>} Extracted plain text
 */
async function extractText(buffer, filename) {
  const ext = path.extname(filename).toLowerCase();

  if (ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text || "";
  }

  if (ext === ".doc" || ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  throw new Error(`Unsupported file type: ${ext}. Please upload a PDF or DOCX.`);
}

module.exports = { extractText };
