import HeroSection from "../../components/HeroSection";

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc }) {
    return (
        <div
            className="rounded-2xl p-8 md:py-12 flex flex-col items-center text-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(39,243,169,0.2)] h-full w-full"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
            }}
        >
            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-2"
                style={{ background: "rgba(39,243,169,0.1)", border: "1px solid rgba(39,243,169,0.15)" }}
            >
                {icon}
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", letterSpacing: "-0.3px" }}>{title}</h3>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.8 }}>{desc}</p>
        </div>
    );
}

// ─── Stat Block ──────────────────────────────────────────────────────────────
function StatBlock({ value, label }) {
    return (
        <div className="text-center px-6 py-2">
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-1px" }}>
                <span style={{ color: "#27F3A9" }}>{value}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
        </div>
    );
}

// ─── Step Item (centered) ────────────────────────────────────────────────────
function StepItem({ num, title, desc }) {
    return (
        <div className="flex flex-col items-center text-center gap-3">
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(39,243,169,0.15)", border: "1px solid rgba(39,243,169,0.25)", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#27F3A9" }}
            >
                {num}
            </div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{title}</h4>
            <p className="max-w-sm" style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
        </div>
    );
}

// ─── Landing Page ────────────────────────────────────────────────────────────
export default function LandingPage() {
    return (
        <main style={{ background: "#000" }}>
            {/* ── Hero ── */}
            <HeroSection />

            {/* ── Features Section ── */}
            <section id="features" style={{ background: "#000", padding: "120px 24px 100px" }}>
                <div className="w-full mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#27F3A9" }}>Features</p>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
                            Everything you need to land the job
                        </h2>
                        <p className="mt-5 w-full mx-auto m-10" style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.6 }}>
                            From resume analysis to interview prep — one AI-powered platform.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
                        <FeatureCard
                            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                            title="ATS Score Analysis"
                            desc="Upload your resume and get an instant ATS compatibility score with detailed keyword gap analysis and formatting feedback."
                        />
                        <FeatureCard
                            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                            title="AI Resume Builder"
                            desc="Generate ATS-optimized resumes tailored to specific job descriptions. Our AI crafts content that hiring managers and bots both love."
                        />
                        <FeatureCard
                            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                            title="Interview Preparation"
                            desc="Practice with AI-generated interview questions based on your target role. Get real-time feedback on your answers and delivery."
                        />
                        <FeatureCard
                            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
                            title="Keyword Optimization"
                            desc="Identify missing keywords from any job posting and seamlessly integrate them into your resume to pass ATS filters."
                        />
                        <FeatureCard
                            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
                            title="Skill Gap Detection"
                            desc="Compare your skills against industry requirements and get personalized recommendations to bridge the gaps."
                        />
                        <FeatureCard
                            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>}
                            title="Multiple Templates"
                            desc="Choose from professionally designed resume templates optimized for different industries and experience levels."
                        />
                    </div>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section style={{ background: "#000", padding: "40px 24px 80px" }}>
                <div className="w-full mx-auto">
                    <div
                        className="rounded-2xl py-10 px-8"
                        style={{
                            background: "rgba(39,243,169,0.03)",
                            border: "1px solid rgba(39,243,169,0.1)",
                        }}
                    >
                        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                            <StatBlock value="50K+" label="Resumes Analyzed" />
                            <StatBlock value="93%" label="ATS Pass Rate" />
                            <StatBlock value="4.9★" label="User Rating" />
                            <StatBlock value="2x" label="More Interviews" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" style={{ background: "#000", padding: "80px 24px 120px" }}>
                <div className="w-full mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#27F3A9" }}>How It Works</p>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#fff", letterSpacing: "-0.5px" }}>
                            Three steps to your dream job
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        <StepItem num="1" title="Upload Your Resume" desc="Drop your existing resume or paste a job description. Our AI instantly analyzes your document against real ATS systems." />
                        <StepItem num="2" title="Get AI-Powered Insights" desc="Receive a detailed ATS score, keyword analysis, formatting suggestions, and a side-by-side comparison with the target job." />
                        <StepItem num="3" title="Generate & Apply" desc="Let AI rebuild your resume with optimized content, proper formatting, and targeted keywords. Download and apply with confidence." />
                    </div>
                </div>
            </section>

            {/* ── CTA Footer ── */}
            <section style={{ background: "#000", padding: "60px 24px 100px" }}>
                <div className="max-w-2xl mx-auto text-center">
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 16 }}>
                        Ready to beat the ATS?
                    </h2>
                    <p className="mb-8" style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.6 }}>
                        Join thousands of job seekers who've improved their resume scores and landed more interviews.
                    </p>
                    <a
                        href="/register"
                        className="inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0px_6px_32px_8px_rgba(39,243,169,0.25)] active:scale-[0.98]"
                        style={{
                            padding: "14px 36px",
                            background: "linear-gradient(135deg, #27F3A9, #0fa968)",
                            borderRadius: 10,
                            border: "none",
                            cursor: "pointer",
                            textDecoration: "none",
                            boxShadow: "0 8px 30px rgba(39,243,169,0.2)",
                        }}
                    >
                        <span style={{ color: "#000", fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                            Start Free — No Credit Card
                        </span>
                    </a>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px" }}>
                <div className="max-w-6xl mx-auto flex items-center justify-center flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #27F3A9, #0fa968)" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                        </div>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "#fff" }}>ResumeIQ</span>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.1)" }}>•</span>
                    <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2026 ResumeIQ. AI-powered ATS Resume Helper.</p>
                </div>
            </footer>
        </main>
    );
}
