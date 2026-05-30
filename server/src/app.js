const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth.routes");
const roadmapRouter = require("./routes/roadmap.routes");
const atsRouter = require("./routes/ats.routes");
const resumeRouter = require("./routes/resume.routes");
const interviewRouter = require("./routes/interview.routes");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    // Allow both the Vite dev server and the Next.js dev server
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
}));

app.use('/api/auth', authRouter);
app.use('/api/roadmap', roadmapRouter);
app.use('/api/ats', atsRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;