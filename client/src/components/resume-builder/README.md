# Resume Builder Components

## Overview
The Resume Builder is a comprehensive tool for creating professional LaTeX resumes with AI assistance.

## Component Architecture

### Main Component
**`ResumeBuilderContainer.tsx`** - The primary container that manages all resume builder functionality.

### Legacy Components (Deprecated)
The following components are kept for reference but are no longer used:
- `DataExtractionPanel.tsx` - Old upload/import interface
- `LatexEditorPanel.tsx` - Old LaTeX editor
- `PdfPreviewPanel.tsx` - Old PDF preview

These have been consolidated into the main `ResumeBuilderContainer.tsx` for better maintainability.

## Features

### 1. Upload Resume Tab
- Drag-and-drop file upload
- Support for PDF and DOCX files
- AI-powered text extraction (to be implemented)
- Visual feedback during upload

### 2. Build Manually Tab
- **Personal Information Section**
  - Full name
  - Professional title
  - Email address
  - Phone number
  - Location

- **Professional Summary**
  - Multi-line text area for career summary
  - Character count (to be added)

- **Experience Section** (to be expanded)
  - Company name
  - Position title
  - Duration
  - Description
  - Add/remove multiple entries

- **Education Section** (to be expanded)
  - Institution name
  - Degree
  - Year
  - Add/remove multiple entries

- **Skills Section** (to be expanded)
  - Tag-based skill input
  - Categorization

### 3. LaTeX Editor Tab
- Direct code editing
- Syntax highlighting (basic)
- Real-time compilation
- Export to PDF

## State Management

```typescript
interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
}
```

## Styling

The component uses:
- **Glass morphism** for card effects
- **Gradient accents** for visual hierarchy
- **Smooth animations** via Framer Motion
- **Responsive grid layout** for desktop/mobile

### Color Scheme
- **Blue** (`blue-500`): Upload and primary actions
- **Purple** (`purple-500`): AI and smart features
- **Emerald** (`emerald-500`): Success and generation
- **Green** (`green-400`): Code editor theme

## Integration Points

### Backend APIs (To Be Implemented)
1. **File Upload API**
   - `POST /api/resume/upload`
   - Accepts: PDF, DOCX
   - Returns: Extracted text data

2. **LaTeX Compilation API**
   - `POST /api/resume/compile`
   - Accepts: LaTeX source code
   - Returns: PDF blob

3. **Profile Import API**
   - `GET /api/user/profile`
   - Returns: User profile data

### Database Schema (Suggested)
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  latex_source TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Usage Example

```tsx
import ResumeBuilderContainer from '@/components/resume-builder/ResumeBuilderContainer';

export default function ResumeBuilderPage() {
  return (
    <div className="min-h-screen">
      <ResumeBuilderContainer />
    </div>
  );
}
```

## Development Roadmap

### Phase 1: Core Functionality ✅
- [x] UI layout and design
- [x] Tab navigation
- [x] Form inputs for personal info
- [x] LaTeX editor
- [x] PDF preview placeholder

### Phase 2: Data Management (In Progress)
- [ ] Complete form fields (experience, education, skills)
- [ ] Form validation
- [ ] Local storage persistence
- [ ] Undo/redo functionality

### Phase 3: AI Integration
- [ ] File upload with AI extraction
- [ ] Smart content suggestions
- [ ] Grammar and spell checking
- [ ] ATS optimization suggestions

### Phase 4: LaTeX Compilation
- [ ] Backend LaTeX compiler integration
- [ ] Real-time PDF preview
- [ ] Multiple template support
- [ ] Custom styling options

### Phase 5: Advanced Features
- [ ] Version history
- [ ] Multiple resume management
- [ ] Export to multiple formats
- [ ] Collaborative editing
- [ ] Template marketplace

## Testing

### Unit Tests (To Be Added)
```bash
npm test -- ResumeBuilderContainer
```

### E2E Tests (To Be Added)
```bash
npm run e2e -- resume-builder
```

## Performance Considerations

1. **Debounce LaTeX compilation** - Avoid compiling on every keystroke
2. **Lazy load PDF viewer** - Only load when needed
3. **Optimize WebGL background** - Reduce animation complexity on low-end devices
4. **Cache compiled PDFs** - Store recent compilations

## Accessibility

- All form inputs have proper labels
- Keyboard navigation supported
- ARIA labels for icon buttons
- Focus indicators visible
- Color contrast meets WCAG AA standards

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (WebGL may vary)
- Mobile browsers: ✅ Responsive design

## Known Issues

1. PDF preview is currently a placeholder
2. File upload doesn't connect to backend yet
3. LaTeX compilation is mock data
4. Experience/Education sections need full implementation

## Contributing

When adding features:
1. Maintain the existing design system
2. Use TypeScript for type safety
3. Add proper error handling
4. Update this README
5. Write tests for new functionality

## License

Part of the ATS Resume Helper GenAI project.
