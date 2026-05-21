const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const tokenBlackListModel = require('../models/blacklist.model')


/**
 * @name registerUserController
 * @description Register a new user, expects username, email, password from req.body
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name loginUserController
 * @description Login a user, expects username and password from req.body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description Logout the user, expects token from req.cookie
 * @access Private
 */
async function logoutUserController(req , res) {
    const token = req.cookies.token

    if(token){
        await tokenBlackListModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description Get current logged in user details
 * @access Private
*/
async function getMeController(req , res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        id: user._id,
        username: user.username,
        email: user.email
    })
}


/**
 * Create a Nodemailer transporter using Google OAuth2
 */
function createTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_USER,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: process.env.GMAIL_ACCESS_TOKEN,
        },
    });
}


/**
 * @name forgotPasswordController
 * @description Sends a password reset email with a JWT token link
 * @access Public
 */
async function forgotPasswordController(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        // Don't reveal if user exists or not for security
        return res.status(200).json({
            message: "If an account with that email exists, a reset link has been sent."
        });
    }

    // Generate a short-lived reset token (15 minutes)
    const resetToken = jwt.sign(
        { id: user._id, email: user.email, purpose: "password-reset" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"ResumeIQ" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Reset Your ResumeIQ Password",
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #0a0a0a; border-radius: 16px; color: #e2e8f0; border: 1px solid rgba(39,243,169,0.1);">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #27F3A9; font-size: 24px; margin: 0;">ResumeIQ</h1>
                    </div>
                    <h2 style="font-size: 20px; color: #fff; margin-bottom: 12px;">Password Reset Request</h2>
                    <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #27F3A9, #0fa968); color: #000; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px;">
                            Reset Password
                        </a>
                    </div>
                    <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
                        If you didn't request this, please ignore this email. Your password will remain unchanged.
                    </p>
                    <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
                    <p style="font-size: 11px; color: #475569; text-align: center;">
                        © ResumeIQ — AI-powered ATS Resume Helper
                    </p>
                </div>
            `,
        });

        res.status(200).json({
            message: "If an account with that email exists, a reset link has been sent."
        });
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ message: "Failed to send reset email. Please try again later." });
    }
}


/**
 * @name resetPasswordController
 * @description Resets the user password using a valid JWT reset token
 * @access Public
 */
async function resetPasswordController(req, res) {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.purpose !== "password-reset") {
            return res.status(400).json({ message: "Invalid reset token" });
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hash = await bcrypt.hash(password, 10);
        user.password = hash;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
        }
        return res.status(400).json({ message: "Invalid or expired reset token" });
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController
}
