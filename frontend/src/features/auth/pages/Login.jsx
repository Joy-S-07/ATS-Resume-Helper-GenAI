import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState("");
    const { handleLogin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await handleLogin({ email, password });
        if (result.success) { navigate("/"); }
        else { setError(result.message); }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(5deg)}}
        @keyframes float2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-30px) rotate(-8deg)}}
        @keyframes slide-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
      `}</style>
            <div className="min-h-screen flex items-center justify-center p-6 relative z-10" style={{ background: "#000" }}>
                {/* BG blobs */}
                <div className="fixed inset-0 overflow-hidden z-0" style={{ background: "#000" }}>
                    <div className="absolute rounded-full pointer-events-none"
                        style={{ width: 500, height: 500, background: "rgba(39,243,169,0.08)", top: -80, left: -120, filter: "blur(100px)", animation: "float1 8s ease-in-out infinite" }} />
                    <div className="absolute rounded-full pointer-events-none"
                        style={{ width: 400, height: 400, background: "rgba(15,169,104,0.06)", bottom: -50, right: -100, filter: "blur(100px)", animation: "float2 11s ease-in-out infinite" }} />
                </div>

                <div className="relative z-20 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8"
                    style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)", paddingTop: 60 }}>

                    {/* LEFT PANEL */}
                    <div className="relative rounded-3xl overflow-hidden flex flex-col justify-end p-8 hidden lg:flex" style={{ animation: "slide-up 0.8s ease both", minHeight: "560px" }}>
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80" alt="AI Platform" className="absolute inset-0 w-full h-full object-cover" style={{ transition: "none" }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #27F3A9, #0fa968)" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
                                    </svg>
                                </div>
                                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.5px" }}>ResumeIQ</span>
                            </div>
                            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 34, lineHeight: 1.1, color: "#fff", letterSpacing: "-1px", marginBottom: 12 }}>Land your dream job faster.</h1>
                            <p className="text-base" style={{ color: "rgba(255,255,255,0.65)" }}>AI-powered ATS scoring and resume optimization.</p>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div style={{ animation: "slide-up 0.8s ease 0.15s both" }}>
                        <div className="rounded-3xl" style={{ padding: "32px", background: "rgba(10,10,10,0.7)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)" }}>

                            {/* Tabs */}
                            <div className="flex p-1 rounded-xl mb-7" style={{ background: "rgba(255,255,255,0.04)", padding: "4px" }}>
                                <div className="flex-1 rounded-lg text-sm font-medium text-center" style={{ padding: "10px 0", background: "rgba(39,243,169,0.12)", color: "#27F3A9", fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(39,243,169,0.15)" }}>Sign In</div>
                                <Link to="/register" className="flex-1 rounded-lg text-sm font-medium text-center" style={{ padding: "10px 0", background: "transparent", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Create Account</Link>
                            </div>

                            <div className="mb-6">
                                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4 }}>Welcome back</h2>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Sign in to your ResumeIQ account</p>
                            </div>

                            {/* Social buttons */}
                            <div className="flex gap-2.5 mb-6">
                                {[
                                    { icon: (<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>), label: "Google" },
                                    { icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>), label: "LinkedIn" },
                                ].map(({ icon, label }) => (
                                    <button key={label} className="flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-medium"
                                        style={{ padding: "12px 0", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(39,243,169,0.2)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                                        {icon}{label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>or continue with email</span>
                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2.5 p-3 rounded-xl mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", animation: "shake 0.4s ease" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                    <span className="text-[13px]" style={{ color: "rgba(239,68,68,0.9)" }}>{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
                                <div>
                                    <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>Email Address</label>
                                    <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                                        className="w-full rounded-xl text-[15px] text-white outline-none focus:border-[rgba(39,243,169,0.4)] transition-all"
                                        style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <label className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>Password</label>
                                        <Link to="/forgot-password" className="text-[12px]" style={{ color: "rgba(39,243,169,0.7)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Forgot password?</Link>
                                    </div>
                                    <div className="relative">
                                        <input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                                            className="w-full rounded-xl text-[15px] text-white outline-none focus:border-[rgba(39,243,169,0.4)] transition-all"
                                            style={{ padding: "12px 44px 12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full py-3.5 h-[48px] rounded-xl font-bold text-base relative overflow-hidden mt-2 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(39,243,169,0.25)] hover:-translate-y-0.5 active:translate-y-0"
                                    style={{ fontFamily: "'Syne', sans-serif", background: loading ? "rgba(39,243,169,0.3)" : "linear-gradient(135deg, #27F3A9, #0fa968)", border: "none", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.3px", color: "#000", fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                                    {loading ? "Signing in..." : "Sign In to ResumeIQ →"}
                                </button>
                            </form>

                            <p className="text-center mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                Don't have an account?{" "}
                                <Link to="/register" style={{ color: "rgba(39,243,169,0.8)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Sign up free</Link>
                            </p>
                            <p className="text-center mt-3 text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.15)" }}>By continuing, you agree to our Terms of Service & Privacy Policy</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}