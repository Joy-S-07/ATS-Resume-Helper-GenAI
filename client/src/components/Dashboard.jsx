"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FallingPattern } from "@/components/ui/falling-pattern";
import {
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  FileText,
  Activity,
  Briefcase,
  Eye,
  Settings,
  CheckCircle,
  Loader2,
  Calendar,
  TrendingUp,
  X,
  Plus,
  GraduationCap,
  Globe,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [skills, setSkills] = useState(["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [experiences, setExperiences] = useState([
    { id: 1, title: "Senior Frontend Developer", company: "TechCorp Inc.", duration: "2021 - Present" },
    { id: 2, title: "Frontend Developer", company: "StartupXYZ", duration: "2019 - 2021" },
  ]);
  const [education, setEducation] = useState([
    { id: 1, degree: "B.S. Computer Science", institution: "Stanford University", year: "2019" },
  ]);

  const SKILL_SUGGESTIONS = [
    "ActiveMQ", "Adobe XD", "Airflow", "Alpine.js", "Anchor", "Android",
    "Angular", "Ansible", "Ant Design", "Anthropic API", "Apache", "Appium",
    "ArangoDB", "ArgoCD", "ASP.NET", "Assembly", "AWS", "Axum", "Azure",
    "Babel", "Babylon.js", "Backbone.js", "Bash", "Beego", "BigQuery",
    "Bitcoin", "Bitbucket Pipelines", "Bootstrap", "Bulma", "Bun", "C",
    "C#", "C++", "CakePHP", "Capacitor", "Cassandra", "Chai", "Chakra UI",
    "Chef", "CircleCI", "Clojure", "Cloudflare", "CockroachDB", "CodeIgniter",
    "Consul", "Cordova", "CouchDB", "CSS", "Cypress", "D3.js", "Dart",
    "Databricks", "Datadog", "Deno", "DigitalOcean", "Django", "Docker",
    "Drizzle ORM", "DynamoDB", "Echo", "Elasticsearch", "ELK Stack", "Elixir",
    "Ember.js", "Emotion", "Entity Framework", "Envoy", "Erlang", "ESLint",
    "Ethereum", "Ethers.js", "Event-Driven Architecture", "Express.js", "F#",
    "FastAPI", "Fastai", "Fastify", "Fiber", "Figma", "Firebase", "Flask",
    "Flink", "Flutter", "Foundation", "Framer Motion", "Ganache", "Gatsby",
    "GCP", "Gin", "Git", "GitHub Actions", "GitLab CI", "Go", "Godot",
    "Grafana", "GraphQL", "Groovy", "gRPC", "GSAP", "HAProxy", "Hadoop",
    "Hardhat", "Haskell", "Heroku", "Hibernate", "HTML", "HTMX", "Hugging Face",
    "IPFS", "Ionic", "iOS", "Istio", "JWT", "Jasmine", "Java", "JavaScript",
    "Jenkins", "Jest", "Jetpack Compose", "Julia", "JUnit", "Koa", "Kafka",
    "Karma", "Keras", "Kibana", "Kotlin", "Kubernetes", "LESS", "LangChain",
    "Laravel", "LightGBM", "Linux", "Lit", "LlamaIndex", "Logstash", "Lua",
    "MATLAB", "MQTT", "MariaDB", "Material UI", "Maui", "Memcached",
    "Microservices", "Micronaut", "Midjourney", "Mocha", "MongoDB", "Mongoose",
    "MySQL", "NLTK", "NativeScript", "Neo4j", "NestJS", "Netlify", "New Relic",
    "Next.js", "Nginx", "Nim", "Node.js", "NumPy", "Nuxt.js", "OAuth",
    "Objective-C", "OpenAI API", "OpenCV", "OpenID Connect", "Oracle", "PHP",
    "Pandas", "Parcel", "Perl", "Phaser", "Phoenix", "Playwright", "Polygon",
    "PostgreSQL", "PowerShell", "Preact", "Prettier", "Prisma", "Prometheus",
    "Pulumi", "Puppet", "Puppeteer", "PyTest", "Pygame", "Pyramid", "Python",
    "PyTorch", "Qwik", "Quarkus", "R", "REST API", "RabbitMQ", "React",
    "React Native", "Redis", "Redshift", "Redux", "Remix", "Revel", "Rocket",
    "Rollup", "RSpec", "Ruby", "Ruby on Rails", "Rust", "RxJS", "SAML",
    "SASS", "SQLite", "Scala", "SciPy", "Scikit-learn", "Seaborn", "Selenium",
    "Sequelize", "Serverless", "Shell", "Sinatra", "Sketch", "Smart Contracts",
    "Snowflake", "Solana", "SolidJS", "Solr", "SpaCy", "Spark", "Splunk",
    "Spring Boot", "SQL Server", "SQLAlchemy", "Stable Diffusion", "Storybook",
    "Styled Components", "Stylus", "Supabase", "Svelte", "Swift", "Swift UI",
    "Symfony", "Tailwind CSS", "Tauri", "TensorFlow", "Terraform",
    "Testing Library", "TestNG", "Three.js", "Tornado", "Travis CI", "Truffle",
    "TypeORM", "TypeScript", "Unity", "Unreal Engine", "Vagrant", "Vala",
    "Vault", "Vercel", "Vite", "Vitest", "Vue.js", "Web3.js", "WebGL", "WebGPU",
    "WebRTC", "WebSockets", "Webpack", "XGBoost", "XUnit", "Xamarin", "ZeroMQ",
    "Zig", "Zustand", "jQuery",
  ];

  const filteredSuggestions = newSkill.trim()
    ? SKILL_SUGGESTIONS.filter(
        (s) => s.toLowerCase().includes(newSkill.toLowerCase()) && !skills.includes(s)
      ).slice(0, 6)
    : [];

  const addSkill = (skill) => {
    const toAdd = skill || newSkill.trim();
    if (toAdd && !skills.includes(toAdd)) {
      setSkills([...skills, toAdd]);
      setNewSkill("");
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now(), title: "", company: "", duration: "" }]);
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map((e) => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now(), degree: "", institution: "", year: "" }]);
  };

  const removeEducation = (id) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const updateEducation = (id, field, value) => {
    setEducation(education.map((e) => e.id === id ? { ...e, [field]: value } : e));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-slate-200 overflow-x-hidden pt-16 pb-10">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {isClient && (
          <FallingPattern
            className="h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent,#050505)]"
            color="rgba(255, 255, 255, 0.5)"
            backgroundColor="#050505"
          />
        )}
      </div>

      <div className="w-full mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar / Left Column */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 flex flex-col items-center text-center shadow-lg"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-white/10 flex items-center justify-center mb-4 overflow-hidden relative group">
                <User className="w-12 h-12 text-white/50" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <span className="text-xs font-semibold text-white">Edit</span>
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Alex Carter</h2>
              <p className="text-sm text-primary font-medium mb-4">Senior Frontend Developer</p>

              <div className="w-full space-y-3 text-sm text-slate-400 text-left mt-4 border-t border-white/10 pt-5">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>alex@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 text-slate-500" />
                  <a href="#" className="hover:text-primary transition-colors">github.com/alexcarter</a>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card p-2 flex flex-col gap-1 shadow-lg"
            >
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                  activeTab === "overview"
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Activity className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                  activeTab === "settings"
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6 flex-1"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      icon={<FileText className="w-5 h-5 text-primary" />}
                      label="Resumes Built"
                      value="12"
                      trend="+2 this week"
                    />
                    <StatCard
                      icon={<CheckCircle className="w-5 h-5 text-primary" />}
                      label="ATS Pass Rate"
                      value="94%"
                      trend="+5% improvement"
                    />
                    <StatCard
                      icon={<Eye className="w-5 h-5 text-primary" />}
                      label="Profile Views"
                      value="1,248"
                      trend="+120 this month"
                    />
                    <StatCard
                      icon={<Briefcase className="w-5 h-5 text-primary" />}
                      label="Applications"
                      value="34"
                      trend="4 active processes"
                    />
                  </div>

                  {/* Activity Timeline - Horizontal */}
                  <div className="glass-card p-5 lg:p-6 shadow-lg flex-1 flex flex-col">
                    <h3 className="text-lg font-extrabold text-white mb-5 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Recent Activity
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                      <TimelineItem
                        title="Resume Optimized"
                        date="Today, 10:30 AM"
                        icon={<FileText className="w-3.5 h-3.5" />}
                        status="success"
                      />
                      <TimelineItem
                        title="Mock Interview"
                        date="Yesterday, 2:15 PM"
                        icon={<Activity className="w-3.5 h-3.5" />}
                        status="info"
                      />
                      <TimelineItem
                        title="New Skill Added"
                        date="Oct 24, 2023"
                        icon={<CheckCircle className="w-3.5 h-3.5" />}
                        status="default"
                      />
                      <TimelineItem
                        title="Profile Created"
                        date="Oct 20, 2023"
                        icon={<User className="w-3.5 h-3.5" />}
                        status="default"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  {/* Personal Info */}
                  <div className="glass-card p-5 lg:p-6 shadow-lg">
                    <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Personal Info
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">First Name</label>
                          <input type="text" defaultValue="Alex" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Last Name</label>
                          <input type="text" defaultValue="Carter" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Email Address</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                              <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input type="email" defaultValue="alex@example.com" className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Location</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                              <MapPin className="h-4 w-4 text-slate-400" />
                            </div>
                            <input type="text" defaultValue="San Francisco, CA" className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Professional Role</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                              <Briefcase className="h-4 w-4 text-slate-400" />
                            </div>
                            <input type="text" defaultValue="Senior Frontend Developer" className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Experience Level</label>
                          <select defaultValue="senior" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                            <option className="bg-[#111]" value="junior">Junior (0-2 years)</option>
                            <option className="bg-[#111]" value="mid">Mid-Level (2-5 years)</option>
                            <option className="bg-[#111]" value="senior">Senior (5-8 years)</option>
                            <option className="bg-[#111]" value="lead">Lead / Staff (8+ years)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Bio</label>
                        <textarea rows={2} defaultValue="Passionate frontend developer with 5+ years of experience building highly interactive web applications using React, Next.js, and Three.js." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all resize-none leading-relaxed" />
                      </div>
                    </form>
                  </div>

                  {/* Skills, Experience & Education */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Skills with Autocomplete */}
                    <div className="glass-card p-5 lg:p-6 shadow-lg">
                      <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map((skill) => (
                          <motion.span
                            key={skill}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:border-white/20 transition-colors group"
                          >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3 text-slate-400 hover:text-red-400" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                      <div className="relative">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => { setNewSkill(e.target.value); setShowSuggestions(true); }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                            placeholder="Add a skill..."
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all"
                          />
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addSkill()}
                            className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div className="absolute left-0 right-12 top-full mt-1 bg-[#111] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                            {filteredSuggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                onMouseDown={(e) => { e.preventDefault(); addSkill(suggestion); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="glass-card p-5 lg:p-6 shadow-lg">
                      <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Links
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">GitHub</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><LinkIcon className="h-4 w-4 text-slate-400" /></div>
                            <input type="url" defaultValue="https://github.com/alexcarter" className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">LinkedIn</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><LinkIcon className="h-4 w-4 text-slate-400" /></div>
                            <input type="url" defaultValue="https://linkedin.com/in/alexcarter" className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Portfolio</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><Globe className="h-4 w-4 text-slate-400" /></div>
                            <input type="url" defaultValue="https://alexcarter.dev" className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Education Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Experience */}
                    <div className="glass-card p-5 lg:p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          Experience
                        </h3>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={addExperience}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs text-white hover:bg-white/20 transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </motion.button>
                      </div>
                      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                        {experiences.map((exp) => (
                          <motion.div
                            key={exp.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 group relative"
                          >
                            {experiences.length > 1 && (
                              <button
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                              </button>
                            )}
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                              placeholder="Job Title"
                              className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                placeholder="Company"
                                className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                              />
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                                placeholder="Duration"
                                className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="glass-card p-5 lg:p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          Education
                        </h3>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={addEducation}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs text-white hover:bg-white/20 transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </motion.button>
                      </div>
                      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                        {education.map((edu) => (
                          <motion.div
                            key={edu.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 group relative"
                          >
                            {education.length > 1 && (
                              <button
                                onClick={() => removeEducation(edu.id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                              </button>
                            )}
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              placeholder="Degree"
                              className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                placeholder="Institution"
                                className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                              />
                              <input
                                type="text"
                                value={edu.year}
                                onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                                placeholder="Year"
                                className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="py-2.5 px-8 bg-white/90 text-black font-semibold rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin mr-2 h-4 w-4 text-black" />
                      ) : (
                        "Save Changes"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-6 group flex flex-col gap-4 transition-all hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white tracking-tight mb-1">{value}</p>
        <h4 className="text-sm text-slate-400 font-medium">{label}</h4>
      </div>
      <div className="mt-auto pt-4 border-t border-white/5">
        <p className="text-xs font-medium text-primary/90">{trend}</p>
      </div>
    </motion.div>
  );
}

function TimelineItem({ title, date, icon, status }) {
  const getStatusColor = () => {
    switch (status) {
      case "success": return "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
      case "info": return "bg-blue-500/10 border-blue-500/50 text-blue-400";
      default: return "bg-white/5 border-white/20 text-slate-300";
    }
  };

  return (
    <div className="glass-card p-4 hover:bg-white/10 transition-colors shadow-sm border-white/5 group hover:border-white/10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={cn("w-7 h-7 rounded-full border flex items-center justify-center shrink-0", getStatusColor())}>
          {icon}
        </div>
        <h4 className="font-bold text-white text-sm leading-snug">{title}</h4>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Calendar className="w-3 h-3" />
        <span>{date}</span>
      </div>
    </div>
  );
}
