import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

// ── Animated background ──────────────────────────────────────────────────────
function AnimatedBg() {
    return (
        <div className="fixed inset-0 overflow-hidden z-0 bg-[#0a0a0f]">
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 600, height: 600,
                    background: "rgba(108,99,255,0.15)",
                    top: -100, left: -150,
                    filter: "blur(80px)",
                    animation: "float1 8s ease-in-out infinite",
                }}
            />
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 400, height: 400,
                    background: "rgba(168,85,247,0.12)",
                    bottom: 0, right: -80,
                    filter: "blur(80px)",
                    animation: "float2 11s ease-in-out infinite",
                }}
            />
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 300, height: 300,
                    background: "rgba(236,72,153,0.1)",
                    top: "40%", left: "60%",
                    filter: "blur(80px)",
                    animation: "float3 9s ease-in-out infinite",
                }}
            />
            {/* Grid overlay */}
            <svg
                className="absolute inset-0 w-full h-full opacity-[0.03]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
}

// ── Main Register Page ──────────────────────────────────────────────────────────
export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: wire up your auth here
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <>
            {/* Keyframes injected once */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes float1  { 0%,100%{transform:translateY(0) rotate(0deg);}  50%{transform:translateY(-20px) rotate(5deg);} }
        @keyframes float2  { 0%,100%{transform:translateY(0) rotate(0deg);}  50%{transform:translateY(-30px) rotate(-8deg);} }
        @keyframes float3  { 0%,100%{transform:translateY(0);}              50%{transform:translateY(-15px);} }
        @keyframes scan    { 0%{top:0%;}  100%{top:100%;} }
        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1;} 100%{transform:scale(2.5);opacity:0;} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
        @keyframes shimmer { 0%{left:-100%;} 100%{left:200%;} }
        @keyframes slide-up { from{opacity:0;transform:translateY(32px);} to{opacity:1;transform:translateY(0);} }
        .btn-primary { animation: gradient-shift 3s ease infinite; }
        .btn-primary::after {
          content:''; position:absolute; top:0; left:-100%;
          width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
          animation: shimmer 2.5s infinite;
        }
      `}</style>

            <div className="min-h-screen flex items-center justify-center p-6 relative z-10 bg-[#0a0a0f]">
                <AnimatedBg />

                <div
                    className="relative z-20 w-full max-w-5xl grid grid-cols-2 gap-8"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(24px)",
                        transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
                    }}
                >
                    {/* ── LEFT PANEL (IMAGE) ── */}
                    <div
                        className="relative rounded-3xl overflow-hidden flex flex-col justify-end p-8"
                        style={{ animation: "slide-up 0.8s ease both", minHeight: "600px" }}
                    >
                        {/* 👇👇👇 USER: ADD YOUR CUSTOM IMAGE URL HERE 👇👇👇 */}
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                            alt="AI Platform"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ transition: "none" }} // Prevents any zooming or changing
                        />
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6c63ff,#a855f7)" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                </div>
                                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.5px" }}>
                                    ResumeIQ
                                </span>
                            </div>
                            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: "#fff", letterSpacing: "-1px", marginBottom: 12 }}>
                                Land your dream job faster.
                            </h1>
                            <p className="text-base justify-between" style={{ color: "rgba(255,255,255,0.7)" }}>
                                AI-powered ATS scoring and resume optimization.
                            </p>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL (FORM) ── */}
                    <div style={{ animation: "slide-up 0.8s ease 0.15s both" }}>
                        <div
                            className="rounded-3xl"
                            style={{
                                padding: "32px",
                                background: "rgba(20, 20, 25, 0.6)", // Darker box for clarity
                                backdropFilter: "blur(40px)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                marginTop: "1rem",
                                marginBottom: "1rem"
                            }}
                        >
                            {/* Tabs */}
                            <div className="flex p-1 rounded-xl mb-7" style={{ background: "rgba(255,255,255,0.05)", padding: "4px" }}>
                                <Link
                                    to="/login"
                                    className="flex-1 rounded-lg text-sm font-medium transition-all duration-200 text-center"
                                    style={{
                                        padding: "10px 0",
                                        background: "transparent",
                                        color: "rgba(255,255,255,0.5)",
                                        border: "none",
                                        cursor: "pointer",
                                        fontFamily: "'DM Sans', sans-serif",
                                        textDecoration: "none",
                                    }}
                                >
                                    Sign In
                                </Link>
                                <div
                                    className="flex-1 rounded-lg text-sm font-medium transition-all duration-200 text-center"
                                    style={{
                                        padding: "10px 0",
                                        background: "rgba(108,99,255,0.25)",
                                        color: "#fff",
                                        border: "none",
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    Create Account
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="mb-6">
                                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4 }}>
                                    Get started free
                                </h2>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                                    Join 50,000+ job seekers using AI
                                </p>
                            </div>

                            {/* Social buttons */}
                            <div className="flex gap-2.5 mb-6">
                                {[
                                    {
                                        icon: (
                                            <svg width="18" height="18" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        ), label: "Google"
                                    },
                                    {
                                        icon: (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                                                <circle cx="4" cy="4" r="2" />
                                            </svg>
                                        ), label: "LinkedIn"
                                    },
                                ].map(({ icon, label }) => (
                                    <button
                                        key={label}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200"
                                        style={{ padding: "12px 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                                    >
                                        {icon}{label}
                                    </button>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>or continue with email</span>
                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-2">
                                <div>
                                    <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>Full Name</label>
                                    <input
                                        type="text" placeholder="Alex Johnson" value={name}
                                        onChange={e => setName(e.target.value)} required
                                        className="w-full rounded-xl text-[15px] text-white outline-none transition-all"
                                        style={{ padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>Email Address</label>
                                    <input
                                        type="email" placeholder="you@example.com" value={email}
                                        onChange={e => setEmail(e.target.value)} required
                                        className="w-full rounded-xl text-[15px] text-white outline-none transition-all"
                                        style={{ padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <label className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Password</label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPass ? "text" : "password"} placeholder="••••••••" value={password}
                                            onChange={e => setPassword(e.target.value)} required
                                            className="w-full rounded-xl text-[15px] text-white outline-none transition-all"
                                            style={{ padding: "12px 44px 12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                                        />
                                        <button
                                            type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center"
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                {showPass
                                                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                                                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                                }
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 p-3 rounded-xl" style={{ background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                                        Free plan includes 5 resume analyses/month & 1 AI-generated resume.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full py-3.5 h-[45px] rounded-xl font-bold text-base text-white relative overflow-hidden mt-3"
                                    style={{
                                        fontFamily: "'Syne', sans-serif",
                                        background: "linear-gradient(135deg,#6c63ff,#a855f7,#ec4899)",
                                        backgroundSize: "200% 200%",
                                        border: "none",
                                        cursor: "pointer",
                                        letterSpacing: "0.5px",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(108,99,255,0.5)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                                >
                                    {loading ? "Authenticating..." : "Create Free Account →"}
                                </button>
                            </form>

                            <p className="text-center mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    style={{ background: "none", border: "none", color: "rgba(108,99,255,0.9)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none" }}
                                >
                                    Sign in
                                </Link>
                            </p>

                            <p className="text-center mt-3.5 text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>
                                By continuing, you agree to our Terms of Service & Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
