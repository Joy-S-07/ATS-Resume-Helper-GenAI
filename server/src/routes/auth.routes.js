const { Router } = require("express")
const authRouter = Router()
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../../middlewares/auth.middleware")

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login a user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)

/**
 * @route POST/api/auth/logout
 * @description clean token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Get current logged in user
 * @access Private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

/**
 * @route POST /api/auth/forgot-password
 * @description Send password reset email
 * @access Public
 */
authRouter.post("/forgot-password", authController.forgotPasswordController)

/**
 * @route POST /api/auth/reset-password
 * @description Reset password with token
 * @access Public
 */
authRouter.post("/reset-password", authController.resetPasswordController)

module.exports = authRouter