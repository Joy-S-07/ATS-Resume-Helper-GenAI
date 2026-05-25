"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FallingPattern } from "@/components/ui/falling-pattern";
import FloatingActionMenu from "@/components/ui/floating-action-menu";
import ATSScoreChecker from "@/components/ats-checker/ats-score-checker";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText, Briefcase, User, Bot } from "lucide-react";

import SidebarProfile from "./sidebar-profile";
import SidebarNav from "./sidebar-nav";
import OverviewTab from "./overview-tab";
import MyInfoTab from "./my-info-tab";
import ResumesTab from "./resumes-tab";
import JobTrackerTab from "./job-tracker-tab";
import ROUTES from "@/routes";

export default function Dashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Profile State
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Carter",
    email: "alex@example.com",
    role: "Senior Frontend Developer",
    location: "San Francisco, CA",
    experienceLevel: "senior",
    bio: "Passionate frontend developer with 5+ years of experience building highly interactive web applications using React, Next.js, and Three.js."
  });
  
  // Form State
  const [formData, setFormData] = useState({ ...profile });

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

  const [links, setLinks] = useState([
    { id: 1, name: "GitHub", url: "https://github.com/alexcarter", iconType: "github" },
    { id: 2, name: "LinkedIn", url: "https://linkedin.com/in/alexcarter", iconType: "linkedin" },
    { id: 3, name: "Portfolio", url: "https://alexcarter.dev", iconType: "portfolio" },
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

  const addSkill = (skill?: string) => {
    const toAdd = skill || newSkill.trim();
    if (toAdd && !skills.includes(toAdd)) {
      setSkills([...skills, toAdd]);
      setNewSkill("");
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now(), title: "", company: "", duration: "" }]);
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const updateExperience = (id: number, field: string, value: string) => {
    setExperiences(experiences.map((e) => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now(), degree: "", institution: "", year: "" }]);
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(education.map((e) => e.id === id ? { ...e, [field]: value } : e));
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now(), name: "", url: "", iconType: "link" }]);
  };

  const removeLink = (id: number) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const updateLink = (id: number, field: string, value: string) => {
    setLinks(links.map((l) => l.id === id ? { ...l, [field]: value } : l));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setProfile({ ...formData });
      setIsSaving(false);
    }, 1000);
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
            <SidebarProfile profile={profile} links={links} />
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && <OverviewTab />}

              {activeTab === "settings" && (
                <MyInfoTab
                  formData={formData}
                  setFormData={setFormData}
                  handleSave={handleSave}
                  isSaving={isSaving}
                  skills={skills}
                  newSkill={newSkill}
                  setNewSkill={setNewSkill}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  filteredSuggestions={filteredSuggestions}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                  experiences={experiences}
                  addExperience={addExperience}
                  removeExperience={removeExperience}
                  updateExperience={updateExperience}
                  education={education}
                  addEducation={addEducation}
                  removeEducation={removeEducation}
                  updateEducation={updateEducation}
                  links={links}
                  addLink={addLink}
                  removeLink={removeLink}
                  updateLink={updateLink}
                />
              )}

              {activeTab === "resumes" && <ResumesTab />}

              {activeTab === "jobs" && <JobTrackerTab />}

              {activeTab === "ats-score" && (
                <motion.div
                  key="ats-score"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <ATSScoreChecker />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      <FloatingActionMenu
        options={[
          {
            label: "Check ATS Score",
            Icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
            onClick: () => setActiveTab("ats-score"),
          },
          {
            label: "Create Resume",
            Icon: <FileText className="w-4 h-4 text-blue-400" />,
            onClick: () => router.push(ROUTES.RESUME_BUILDER),
          },
          {
            label: "Add Job",
            Icon: <Briefcase className="w-4 h-4 text-purple-400" />,
            onClick: () => setActiveTab("jobs"),
          },
          {
            label: "My Info",
            Icon: <User className="w-4 h-4 text-slate-300" />,
            onClick: () => setActiveTab("settings"),
          },
          {
            label: "AI Interview",
            Icon: <Bot className="w-4 h-4 text-blue-400" />,
            onClick: () => router.push(ROUTES.INTERVIEW),
          }
        ]}
      />
    </div>
  );
}
