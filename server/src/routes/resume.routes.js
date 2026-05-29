const { Router } = require("express");
const resumeRouter = Router();
const resumeController = require("../controllers/resume.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const multer = require("multer");

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and DOCX files are allowed."));
    }
  },
});

/**
 * @route POST /api/resume/upload
 * @description Upload resume file (PDF/DOCX) and generate LaTeX
 * @access Private
 */
resumeRouter.post(
  "/upload",
  authMiddleware.authUser,
  upload.single("file"),
  resumeController.uploadResumeController
);

/**
 * @route POST /api/resume/generate
 * @description Generate resume from manual form data
 * @access Private
 */
resumeRouter.post(
  "/generate",
  authMiddleware.authUser,
  resumeController.generateFromFormController
);

/**
 * @route GET /api/resume/list
 * @description Get all resumes for the logged-in user
 * @access Private
 */
resumeRouter.get(
  "/list",
  authMiddleware.authUser,
  resumeController.getUserResumesController
);

/**
 * @route GET /api/resume/:id
 * @description Get a single resume by ID
 * @access Private
 */
resumeRouter.get(
  "/:id",
  authMiddleware.authUser,
  resumeController.getResumeByIdController
);

/**
 * @route PUT /api/resume/:id
 * @description Update resume (LaTeX code, resume data, or template style)
 * @access Private
 */
resumeRouter.put(
  "/:id",
  authMiddleware.authUser,
  resumeController.updateResumeController
);

/**
 * @route DELETE /api/resume/:id
 * @description Delete a resume
 * @access Private
 */
resumeRouter.delete(
  "/:id",
  authMiddleware.authUser,
  resumeController.deleteResumeController
);

/**
 * @route POST /api/resume/compile
 * @description Compile LaTeX to PDF
 * @access Private
 */
resumeRouter.post(
  "/compile",
  authMiddleware.authUser,
  resumeController.compileLatexController
);

module.exports = resumeRouter;
