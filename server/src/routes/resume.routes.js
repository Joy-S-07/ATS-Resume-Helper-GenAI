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

// Image upload filter (for profile photos)
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

/**
 * @route POST /api/resume/upload
 */
resumeRouter.post(
  "/upload",
  authMiddleware.authUser,
  upload.single("file"),
  resumeController.uploadResumeController
);

/**
 * @route POST /api/resume/upload-photo
 * @description Upload a profile photo, returns base64 data URL
 * @access Private
 */
resumeRouter.post(
  "/upload-photo",
  authMiddleware.authUser,
  imageUpload.single("photo"),
  resumeController.uploadPhotoController
);

/**
 * @route POST /api/resume/compile
 * @description Render resume to A4 PDF via Puppeteer
 * @access Private
 */
resumeRouter.post(
  "/compile",
  authMiddleware.authUser,
  resumeController.compileLatexController
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

module.exports = resumeRouter;
