import { useState, useEffect } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../services/auth.api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await forgotPassword({ email });
            setSent(true);
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
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
                <div className="fixed inset-0 overflow-hidden z-0" style={{ background: "#000" }}>
                    <div className="absolute rounded-full pointer-events-none"
                        style={{ width: 500, height: 500, background: "rgba(39,243,169,0.08)", top: -80, left: -120, filter: "blur(100px)", animation: "float1 8s ease-in-out infinite" }} />
                    <div className="absolute rounded-full pointer-events-none"
                        style={{ width: 400, height: 400, background: "rgba(15,169,104,0.06)", bottom: -50, right: -100, filter: "blur(100px)", animation: "float2 11s ease-in-out infinite" }} />
                </div>

                <div className="relative z-20 w-full max-w-md"
                    style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }}>
                    <div className="rounded-3xl" style={{ padding: "40px 32px", background: "rgba(10,10,10,0.7)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)", animation: "slide-up 0.8s ease both" }}>

                        {/* Logo */}
                        <div className="flex items-center justify-center gap-2.5 mb-8">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #27F3A9, #0fa968)" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.5px" }}>ResumeIQ</span>
                        </div>

                        {sent ? (
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(39,243,169,0.1)", border: "1px solid rgba(39,243,169,0.2)" }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                </div>
                                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 8 }}>Check your email</h2>
                                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                                    If an account with <strong style={{ color: "rgba(255,255,255,0.7)" }}>{email}</strong> exists, we've sent a password reset link.
                                </p>
                                <Link to="/login" className="inline-block text-sm font-medium" style={{ color: "rgba(39,243,169,0.8)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                                    ← Back to Sign In
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(39,243,169,0.08)", border: "1px solid rgba(39,243,169,0.15)" }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    </div>
                                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 4 }}>Forgot your password?</h2>
                                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>No worries, we'll send you a reset link.</p>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", animation: "shake 0.4s ease" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                        <span className="text-[13px]" style={{ color: "rgba(239,68,68,0.9)" }}>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>Email Address</label>
                                        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                                            className="w-full rounded-xl text-[15px] text-white outline-none focus:border-[rgba(39,243,169,0.4)] transition-all"
                                            style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3.5 h-[48px] rounded-xl font-bold text-base relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(39,243,169,0.25)] hover:-translate-y-0.5"
                                        style={{ fontFamily: "'Syne', sans-serif", background: loading ? "rgba(39,243,169,0.3)" : "linear-gradient(135deg, #27F3A9, #0fa968)", border: "none", cursor: loading ? "not-allowed" : "pointer", color: "#000", fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </button>
                                </form>

                                <p className="text-center mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                    Remember your password?{" "}
                                    <Link to="/login" style={{ color: "rgba(39,243,169,0.8)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
