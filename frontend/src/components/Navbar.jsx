import { Link, useLocation } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Navbar() {
    const location = useLocation();
    const isLanding = location.pathname === "/";
    const { user } = useAuth();

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full"
            style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div className="w-full mx-auto flex items-center justify-between" style={{ padding: "14px 24px" }}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #27F3A9, #0fa968)" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                        </svg>
                    </div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.5px" }}>
                        ResumeIQ
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6">
                    {isLanding && (
                        <>
                            <a href="#features" className="text-sm transition-colors duration-200" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                                Features
                            </a>
                            <a href="#how-it-works" className="text-sm transition-colors duration-200" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                                How It Works
                            </a>
                        </>
                    )}

                    {user ? (
                        /* ── Logged-in state ── */
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                            style={{
                                padding: "7px 16px 7px 8px",
                                background: "rgba(39,243,169,0.08)",
                                border: "1px solid rgba(39,243,169,0.15)",
                                borderRadius: 10,
                                textDecoration: "none",
                            }}
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #27F3A9, #0fa968)", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, color: "#000" }}
                            >
                                {user.username ? user.username.slice(0, 2).toUpperCase() : "?"}
                            </div>
                            <span className="text-[13px] font-medium" style={{ color: "#27F3A9", fontFamily: "'DM Sans', sans-serif" }}>
                                Dashboard
                            </span>
                        </Link>
                    ) : (
                        /* ── Logged-out state ── */
                        <>
                            <Link
                                to="/login"
                                className="text-sm transition-colors duration-200"
                                style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                                style={{
                                    padding: "8px 18px",
                                    background: "linear-gradient(135deg, #27F3A9, #0fa968)",
                                    borderRadius: 8,
                                    color: "#000",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: 13,
                                    letterSpacing: "0.3px",
                                }}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
