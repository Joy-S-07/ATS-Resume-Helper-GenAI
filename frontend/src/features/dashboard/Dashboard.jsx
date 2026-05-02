import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
    return (
        <div
            className="rounded-2xl p-8 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 h-full relative"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
            }}
        >
            <span className="absolute top-4 right-4 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}20` }}>
                This Month
            </span>
            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-1"
                style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
            >
                {icon}
            </div>
            <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: "#fff", letterSpacing: "-0.5px" }}>{value}</p>
                <p className="text-[14px] mt-1" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
            </div>
        </div>
    );
}

// ─── Quick Action Button ─────────────────────────────────────────────────────
function QuickAction({ icon, title, desc, onClick }) {
    return (
        <button
            onClick={onClick}
            className="rounded-2xl p-8 flex flex-col items-center text-center gap-4 w-full transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(39,243,169,0.2)] group h-full"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
            }}
        >
            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-1"
                style={{ background: "rgba(39,243,169,0.1)", border: "1px solid rgba(39,243,169,0.15)" }}
            >
                {icon}
            </div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{title}</h4>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{desc}</p>
        </button>
    );
}

// ─── Activity Item ───────────────────────────────────────────────────────────
function ActivityItem({ action, detail, time, iconColor }) {
    return (
        <div className="flex flex-col items-center text-center py-5 gap-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="w-2.5 h-2.5 rounded-full mb-1 shadow-[0_0_10px_rgba(39,243,169,0.5)]" style={{ background: iconColor }} />
            <p className="text-[15px] font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{action}</p>
            <p className="text-[13px] px-4" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{detail}</p>
            <span className="text-[11px] mt-1 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)" }}>{time}</span>
        </div>
    );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────
export default function Dashboard() {
    const { user, handleLogout, handleGetMe, loading } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        handleGetMe().then(result => {
            if (!result.success) {
                navigate("/login");
            }
        });
        setTimeout(() => setVisible(true), 100);
    }, []);

    const onLogout = async () => {
        const result = await handleLogout();
        if (result.success) navigate("/");
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(39,243,169,0.3)", borderTopColor: "transparent" }} />
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes slide-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

            <div className="min-h-screen" style={{ background: "#000", paddingTop: 80 }}>
                <div
                    className="w-full mx-auto px-10 pb-16"
                    style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                >
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between mb-10 flex-wrap gap-4" style={{ animation: "slide-up 0.6s ease both" }}>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #27F3A9, #0fa968)", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#000" }}
                            >
                                {getInitials(user?.username)}
                            </div>
                            <div>
                                <p className="text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{greeting()}</p>
                                <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", color: "#fff", letterSpacing: "-0.5px" }}>
                                    {user?.username || "User"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl px-4 py-2" style={{ background: "rgba(39,243,169,0.08)", border: "1px solid rgba(39,243,169,0.15)" }}>
                                <span className="text-[12px] font-medium" style={{ color: "#27F3A9" }}>Free Plan</span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-200 hover:bg-[rgba(255,255,255,0.08)]"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* ── Stats Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10" style={{ animation: "slide-up 0.6s ease 0.1s both" }}>
                        <StatCard
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>}
                            label="Resumes Analyzed"
                            value="0"
                            accent="#27F3A9"
                        />
                        <StatCard
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
                            label="Average ATS Score"
                            value="—"
                            accent="#60A5FA"
                        />
                        <StatCard
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                            label="Resumes Generated"
                            value="0"
                            accent="#FBBF24"
                        />
                        <StatCard
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                            label="Mock Interviews"
                            value="0"
                            accent="#F472B6"
                        />
                    </div>

                    {/* ── Main Content Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

                        {/* ── Quick Actions (spans 2 cols) ── */}
                        <div className="lg:col-span-2" style={{ animation: "slide-up 0.6s ease 0.2s both" }}>
                            <h2 className="mb-6" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: "-0.3px" }}>Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <QuickAction
                                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                                    title="Analyze Resume"
                                    desc="Upload your resume to get an instant ATS compatibility score and improvement suggestions."
                                />
                                <QuickAction
                                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                                    title="Build New Resume"
                                    desc="Create an ATS-optimized resume from scratch using AI, tailored to your target role."
                                />
                                <QuickAction
                                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                                    title="Practice Interview"
                                    desc="Start a mock interview session with AI-generated questions for your target position."
                                />
                                <QuickAction
                                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27F3A9" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
                                    title="Keyword Optimizer"
                                    desc="Paste a job description to find missing keywords and optimize your resume content."
                                />
                            </div>
                        </div>

                        {/* ── Right Sidebar ── */}
                        <div className="flex flex-col gap-6" style={{ animation: "slide-up 0.6s ease 0.3s both" }}>

                            {/* Profile Card */}
                            <div className="rounded-2xl p-8 flex flex-col items-center text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}>
                                <h3 className="mb-6" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>Profile</h3>
                                <div className="flex flex-col items-center text-center gap-4 mb-8">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #27F3A9, #0fa968)", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#000" }}
                                    >
                                        {getInitials(user?.username)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[17px] mb-1" style={{ color: "#fff" }}>{user?.username}</p>
                                        <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>{user?.email}</p>
                                    </div>
                                </div>
                                <div className="rounded-xl p-5 w-full flex flex-col items-center gap-3" style={{ background: "rgba(39,243,169,0.04)", border: "1px solid rgba(39,243,169,0.1)" }}>
                                    <div className="flex flex-col items-center gap-1 w-full">
                                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>Free Plan Usage</span>
                                        <span className="text-[18px] font-bold" style={{ color: "#27F3A9" }}>0 / 5</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-full rounded-full" style={{ width: "0%", background: "linear-gradient(90deg, #27F3A9, #0fa968)", transition: "width 0.5s ease" }} />
                                    </div>
                                    <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>5 analyses remaining this month</p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="rounded-2xl p-8 flex flex-col items-center text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(8px)", flexGrow: 1 }}>
                                <h3 className="mb-6" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>Recent Activity</h3>
                                <div className="flex flex-col w-full">
                                    <ActivityItem
                                        action="Account created"
                                        detail="Welcome to ResumeIQ!"
                                        time="Just now"
                                        iconColor="#27F3A9"
                                    />
                                    <div className="flex items-center justify-center py-8">
                                        <p className="text-[14px] text-center" style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                                            No other activity yet.<br />Start by analyzing a resume!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
