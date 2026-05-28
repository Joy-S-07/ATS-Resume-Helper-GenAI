const { Router } = require("express");
const roadmapRouter = Router();
const roadmapController = require("../controllers/roadmap.controller");
const { authUser } = require("../../middlewares/auth.middleware");

// All roadmap routes are protected — user must be logged in

/**
 * @route  POST /api/roadmap/generate
 * @desc   Generate a new AI roadmap and save it for the current user
 * @access Private
 * @body   { role: string }
 */
roadmapRouter.post("/generate", authUser, roadmapController.generateRoadmapController);

/**
 * @route  GET /api/roadmap
 * @desc   Get all roadmaps belonging to the current user
 * @access Private
 */
roadmapRouter.get("/", authUser, roadmapController.getUserRoadmapsController);

/**
 * @route  GET /api/roadmap/:id
 * @desc   Get a single roadmap by ID (ownership enforced)
 * @access Private
 */
roadmapRouter.get("/:id", authUser, roadmapController.getRoadmapByIdController);

/**
 * @route  PATCH /api/roadmap/:id
 * @desc   Update task statuses in a roadmap (ownership enforced)
 * @access Private
 * @body   { tasks: Task[] }
 */
roadmapRouter.patch("/:id", authUser, roadmapController.updateRoadmapController);

/**
 * @route  DELETE /api/roadmap/:id
 * @desc   Delete a roadmap (ownership enforced)
 * @access Private
 */
roadmapRouter.delete("/:id", authUser, roadmapController.deleteRoadmapController);

module.exports = roadmapRouter;
