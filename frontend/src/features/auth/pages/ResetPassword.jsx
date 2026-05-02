import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { resetPassword } from "../services/auth.api";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
        if (password !== confirmPassword) { setError("Passwords do not match"); return; }
        if (!token) { setError("Invalid reset link. Please request a new one."); return; }

        setLoading(true);
        try {
            await resetPassword({ token, password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to reset password. The link may have expired.");
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

                        {success ? (
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(39,243,169,0.1)", border: "1px solid rgba(39,243,169,0.2)" }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                </div>
                                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 8 }}>Password reset!</h2>
                                <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>Your password has been updated successfully.</p>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Redirecting to sign in...</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(39,243,169,0.08)", border: "1px solid rgba(39,243,169,0.15)" }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                                    </div>
                                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 4 }}>Set new password</h2>
                                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Must be at least 6 characters.</p>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", animation: "shake 0.4s ease" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                        <span className="text-[13px]" style={{ color: "rgba(239,68,68,0.9)" }}>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>New Password</label>
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
                                    <div>
                                        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>Confirm Password</label>
                                        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                                            className="w-full rounded-xl text-[15px] text-white outline-none focus:border-[rgba(39,243,169,0.4)] transition-all"
                                            style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3.5 h-[48px] rounded-xl font-bold text-base relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(39,243,169,0.25)] hover:-translate-y-0.5"
                                        style={{ fontFamily: "'Syne', sans-serif", background: loading ? "rgba(39,243,169,0.3)" : "linear-gradient(135deg, #27F3A9, #0fa968)", border: "none", cursor: loading ? "not-allowed" : "pointer", color: "#000", fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </button>
                                </form>

                                <p className="text-center mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                    <Link to="/login" style={{ color: "rgba(39,243,169,0.8)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>← Back to Sign In</Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
