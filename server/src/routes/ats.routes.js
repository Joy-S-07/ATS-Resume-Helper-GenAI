const { Router } = require("express");
const multer = require("multer");
const atsRouter = Router();
const atsController = require("../controllers/ats.controller");
const { authUser } = require("../../middlewares/auth.middleware");

// ─── Multer — memory storage (no disk writes) ─────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"), false);
    }
  },
});

// ─── Multer error handler ─────────────────────────────────────────────────────
function handleMulterError(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5 MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

/**
 * @route  POST /api/ats/analyse
 * @desc   Upload resume + job role → AI analysis → save result
 * @access Private
 */
atsRouter.post(
  "/analyse",
  authUser,
  upload.single("file"),
  handleMulterError,
  atsController.analyseResumeController
);

/**
 * @route  GET /api/ats
 * @desc   Get all ATS results for the current user
 * @access Private
 */
atsRouter.get("/", authUser, atsController.getUserATSResultsController);

/**
 * @route  GET /api/ats/:id
 * @desc   Get a single ATS result by ID
 * @access Private
 */
atsRouter.get("/:id", authUser, atsController.getATSResultByIdController);

/**
 * @route  DELETE /api/ats/:id
 * @desc   Delete an ATS result
 * @access Private
 */
atsRouter.delete("/:id", authUser, atsController.deleteATSResultController);

module.exports = atsRouter;
