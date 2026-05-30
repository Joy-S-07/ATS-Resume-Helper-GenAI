const { Router } = require("express");
const router = Router();
const { authUser } = require("../../middlewares/auth.middleware");
const {
  generateQuestionsController,
  generateResponseController,
  textToSpeechController,
  generateFeedbackController,
} = require("../controllers/interview.controller");

// All interview routes require authentication
router.post("/questions", authUser, generateQuestionsController);
router.post("/respond",   authUser, generateResponseController);
router.post("/tts",       authUser, textToSpeechController);
router.post("/feedback",  authUser, generateFeedbackController);

module.exports = router;
