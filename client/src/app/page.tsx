"use client";

import { Hero } from "@/components/ui/animated-hero";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MessageSquare,
  Map,
  Search,
  Activity,
  LayoutGrid,
  MoveRight,
  CheckCircle,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

/* ─── Feature Card ──────────────────────────────────────────────────────── */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-8 md:py-12 flex flex-col items-center text-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg h-full w-full">
      <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-card-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Stat Block ────────────────────────────────────────────────────────── */
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-6 py-2">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary">
        {value}
      </div>
      <p className="text-muted-foreground text-xs mt-2 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

/* ─── Step Item ─────────────────────────────────────────────────────────── */
function StepItem({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center font-extrabold text-primary">
        {num}
      </div>
      <h4 className="text-lg font-bold text-foreground">{title}</h4>
      <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

/* ─── Landing Page ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="w-full">
      {/* ── Hero Section with GooeyText animation ── */}
      <Hero />

      {/* ── Features Section ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-primary">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Everything you need to land the job
            </h2>
            <p className="mt-5 text-muted-foreground max-w-2xl mx-auto text-lg">
              From resume analysis to interview prep — one AI-powered platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-primary" />}
              title="ATS Score Analysis"
              desc="Upload your resume and get an instant ATS compatibility score with detailed keyword gap analysis and formatting feedback."
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-primary" />}
              title="Interview Preparation"
              desc="Practice with AI-generated interview questions based on your target role. Get real-time feedback on your answers."
            />
            <FeatureCard
              icon={<Map className="w-6 h-6 text-primary" />}
              title="Career Roadmaps"
              desc="Get personalized career progression maps with skill requirements, milestones, and actionable next steps."
            />
            <FeatureCard
              icon={<Search className="w-6 h-6 text-primary" />}
              title="Keyword Optimization"
              desc="Identify missing keywords from any job posting and seamlessly integrate them into your resume."
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-primary" />}
              title="Skill Gap Detection"
              desc="Compare your skills against industry requirements and get personalized recommendations to bridge the gaps."
            />
            <FeatureCard
              icon={<LayoutGrid className="w-6 h-6 text-primary" />}
              title="Multiple Templates"
              desc="Choose from professionally designed resume templates optimized for different industries and experience levels."
            />
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-12 md:py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 py-10 px-8">
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
      <section id="interview" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-primary">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Three steps to your dream job
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <StepItem
              num="1"
              title="Upload Your Resume"
              desc="Drop your existing resume or paste a job description. Our AI instantly analyzes your document against real ATS systems."
            />
            <StepItem
              num="2"
              title="Get AI-Powered Insights"
              desc="Receive a detailed ATS score, keyword analysis, formatting suggestions, and a side-by-side comparison with the target job."
            />
            <StepItem
              num="3"
              title="Generate & Apply"
              desc="Let AI rebuild your resume with optimized content, proper formatting, and targeted keywords. Download and apply with confidence."
            />
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        id="roadmaps"
        className="py-20 md:py-28 border-t border-border"
      >
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Ready to beat the ATS?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Join thousands of job seekers who&apos;ve improved their resume
            scores and landed more interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-3" asChild>
              <Link href="/register">
                Get Started Free <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-3" asChild>
              <Link href="#ats">
                Try ATS Checker <CheckCircle className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex items-center justify-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm text-foreground">CareerAI</span>
          </div>
          <span className="text-border">•</span>
          <p className="text-muted-foreground text-xs">
            © 2026 CareerAI. AI-powered ATS Resume Helper.
          </p>
        </div>
      </footer>
    </div>
  );
}
