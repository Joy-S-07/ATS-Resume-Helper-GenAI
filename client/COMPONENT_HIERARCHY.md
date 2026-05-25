# Resume Builder - Component Hierarchy

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     Resume Builder Page                          │
│  (src/app/resume-builder/page.tsx)                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         ProceduralGroundBackground                         │ │
│  │  (Animated WebGL Background - Full Screen)                 │ │
│  │  • Topographic lines                                       │ │
│  │  • Sand-ripple animation                                   │ │
│  │  • White/Grey/Black palette                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Page Header                             │ │
│  │  ┌──────┐  AI Resume Builder                              │ │
│  │  │ Icon │  Create professional LaTeX resumes    [AI •]    │ │
│  │  └──────┘                                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              ResumeBuilderContainer                        │ │
│  │  (src/components/resume-builder/ResumeBuilderContainer)   │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Navigation Bar                                       │ │ │
│  │  │  [←] [Upload] [Manual] [LaTeX]        [Export PDF]   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────┬──────────────────────────┐  │ │
│  │  │   Left Panel            │   Right Panel            │  │ │
│  │  │   (Input Area)          │   (PDF Preview)          │  │ │
│  │  │                         │                          │  │ │
│  │  │  ┌──────────────────┐  │  ┌──────────────────┐   │  │ │
│  │  │  │                  │  │  │  [👁 PDF Preview] │   │  │ │
│  │  │  │  Tab Content:    │  │  │                  │   │  │ │
│  │  │  │                  │  │  │  ┌────────────┐  │   │  │ │
│  │  │  │  • Upload Tab    │  │  │  │            │  │   │  │ │
│  │  │  │  • Manual Tab    │  │  │  │   PDF      │  │   │  │ │
│  │  │  │  • LaTeX Tab     │  │  │  │  Preview   │  │   │  │ │
│  │  │  │                  │  │  │  │   Area     │  │   │  │ │
│  │  │  │  (AnimatePresence)│  │  │  │            │  │   │  │ │
│  │  │  │                  │  │  │  └────────────┘  │   │  │ │
│  │  │  └──────────────────┘  │  └──────────────────┘   │  │ │
│  │  └─────────────────────────┴──────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Tab Content Breakdown

### Upload Tab
```
┌─────────────────────────────────────┐
│         Upload Resume Tab           │
│                                     │
│     ┌─────────────────────┐        │
│     │   📤 Upload Icon    │        │
│     └─────────────────────┘        │
│                                     │
│    Upload Your Resume               │
│    Drop your PDF or DOCX here      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  ╔═══════════════════════╗    │ │
│  │  ║                       ║    │ │
│  │  ║   📄 Click to upload  ║    │ │
│  │  ║   or drag and drop    ║    │ │
│  │  ║                       ║    │ │
│  │  ║  PDF, DOCX up to 10MB ║    │ │
│  │  ╚═══════════════════════╝    │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Manual Entry Tab
```
┌─────────────────────────────────────────────┐
│         Build Manually Tab                  │
│                                             │
│  ┌────────────────────────────────────────┐│
│  │ 👤 Personal Information                ││
│  │    Your basic contact details          ││
│  │                                        ││
│  │  [Full Name]        [Title]           ││
│  │  [Email]            [Phone]           ││
│  │  [Location]                           ││
│  └────────────────────────────────────────┘│
│                                             │
│  ┌────────────────────────────────────────┐│
│  │ ✨ Professional Summary                ││
│  │    Brief overview of your experience   ││
│  │                                        ││
│  │  ┌──────────────────────────────────┐ ││
│  │  │                                  │ ││
│  │  │  [Multi-line text area]          │ ││
│  │  │                                  │ ││
│  │  └──────────────────────────────────┘ ││
│  └────────────────────────────────────────┘│
│                                             │
│  ┌────────────────────────────────────────┐│
│  │  [✨ Generate LaTeX Resume]            ││
│  └────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### LaTeX Editor Tab
```
┌─────────────────────────────────────────────┐
│         LaTeX Editor Tab                    │
│                                             │
│  ┌────────────────────────────────────────┐│
│  │ 💻 LaTeX Editor        [👁 Compile]   ││
│  │    Edit your resume code directly      ││
│  └────────────────────────────────────────┘│
│                                             │
│  ┌────────────────────────────────────────┐│
│  │ % LaTeX Code                           ││
│  │ \documentclass[letterpaper]{article}   ││
│  │ \begin{document}                       ││
│  │                                        ││
│  │ \section{Experience}                   ││
│  │ ...                                    ││
│  │                                        ││
│  │ \end{document}                         ││
│  │                                        ││
│  │ [Full-height code editor]              ││
│  └────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

## Component Props & State

### ResumeBuilderContainer
```typescript
// State
const [activeTab, setActiveTab] = useState<"upload" | "manual" | "latex">("upload");
const [latexCode, setLatexCode] = useState("");
const [resumeData, setResumeData] = useState<ResumeData>({
  personalInfo: { name, email, phone, location, title },
  summary: string,
  experience: Array<Experience>,
  education: Array<Education>,
  skills: string[]
});

// Methods
- addExperience()
- removeExperience(id)
- addEducation()
- removeEducation(id)
- generateLatex()
```

### ProceduralGroundBackground
```typescript
// Props: None (self-contained)

// Internal State
- canvasRef: useRef<HTMLCanvasElement>
- WebGL context
- Animation frame ID

// Uniforms
- u_time: float (animation time)
- u_resolution: vec2 (canvas size)
```

## Data Flow

```
┌──────────────┐
│  User Input  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Form State      │ ◄─── Upload File
│  (resumeData)    │ ◄─── Import Profile
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Generate LaTeX   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  LaTeX Editor    │
│  (latexCode)     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Compile PDF     │ (Backend API)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  PDF Preview     │
└──────────────────┘
```

## Styling Architecture

### Glass Card Effect
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: multiple layers;
}
```

### Color System
```
Primary Actions:   bg-white text-black
Upload:           blue-500/20 border-blue-500/30
AI Features:      purple-500/20 border-purple-500/30
Success:          emerald-500/20 border-emerald-500/30
Code:             green-400 on black/40
```

### Responsive Breakpoints
```
Mobile:   < 768px  (1 column)
Tablet:   768px+   (2 columns)
Desktop:  1024px+  (2 columns, wider)
```

## Animation Layers

```
Layer 1: Background (z-index: -10)
  └─ ProceduralGroundBackground (WebGL Canvas)

Layer 2: Content (z-index: 10)
  ├─ Page Header
  └─ ResumeBuilderContainer
      ├─ Navigation (Framer Motion: none)
      ├─ Left Panel
      │   └─ Tab Content (Framer Motion: fade + slide)
      └─ Right Panel
          └─ PDF Preview (static)

Layer 3: Overlays (z-index: 20+)
  └─ Modals, Tooltips (future)
```

## Event Handlers

```
User Actions:
├─ Tab Click → setActiveTab()
├─ Input Change → setResumeData()
├─ Generate Click → generateLatex()
├─ Compile Click → compileLatex() (future)
├─ Upload File → processFile() (future)
├─ Import Profile → importProfile() (future)
└─ Export PDF → downloadPDF() (future)
```

## File Dependencies

```
page.tsx
  ├─ imports: ResumeBuilderContainer
  ├─ imports: ProceduralGroundBackground
  └─ imports: lucide-react icons

ResumeBuilderContainer.tsx
  ├─ imports: lucide-react icons
  ├─ imports: framer-motion
  ├─ imports: ROUTES
  └─ uses: useState, React

ProceduralGroundBackground.tsx
  ├─ imports: React
  └─ uses: useEffect, useRef

globals.css
  ├─ defines: .glass-card
  ├─ defines: .custom-scrollbar
  └─ defines: CSS variables
```

## Future Expansion Points

### 1. Experience Section (Manual Tab)
```
┌────────────────────────────────────────┐
│ 💼 Experience                          │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Company: [________]              │ │
│  │ Position: [________]             │ │
│  │ Duration: [________]             │ │
│  │ Description: [_____________]     │ │
│  │                  [Remove] [Add]  │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### 2. Skills Section (Manual Tab)
```
┌────────────────────────────────────────┐
│ 🏆 Skills                              │
│                                        │
│  [React] [TypeScript] [Node.js] [+]   │
│  [Python] [Docker] [AWS] [+]          │
└────────────────────────────────────────┘
```

### 3. Template Selector (Future)
```
┌────────────────────────────────────────┐
│ 📄 Template                            │
│                                        │
│  [Classic] [Modern] [Minimal] [ATS]   │
└────────────────────────────────────────┘
```

## Performance Optimization

```
Optimization Points:
├─ WebGL Background
│   └─ Reduce complexity on mobile
├─ LaTeX Compilation
│   └─ Debounce (500ms)
├─ Form State
│   └─ Local storage persistence
└─ PDF Preview
    └─ Lazy load iframe
```

---

This hierarchy provides a complete visual and technical overview of the resume builder architecture.
