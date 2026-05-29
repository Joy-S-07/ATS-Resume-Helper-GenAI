# Resume Builder Backend API Documentation

## Overview

The Resume Builder backend provides a complete API for creating, managing, and generating professional resumes with AI-powered LaTeX generation.

## Features

- ✅ Upload PDF/DOCX resumes and extract structured data
- ✅ Manual resume creation via form data
- ✅ AI-powered LaTeX code generation
- ✅ Multiple template styles (modern, classic, minimal)
- ✅ CRUD operations on saved resumes
- ✅ User-specific resume storage
- ✅ Structured logging with emoji prefixes

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **File Processing**: pdf-parse, mammoth
- **File Upload**: Multer
- **AI**: OpenRouter API with fallback model chain
- **Authentication**: JWT (via authUser middleware)

## API Endpoints

### 1. Upload Resume

**Endpoint**: `POST /api/resume/upload`

**Description**: Upload a PDF or DOCX resume, extract text, structure it with AI, and generate LaTeX code.

**Authentication**: Required (JWT token in cookie)

**Request**:
- Content-Type: `multipart/form-data`
- Body:
  - `file`: PDF or DOCX file (max 10MB)
  - `templateStyle`: (optional) "modern" | "classic" | "minimal" (default: "modern")

**Response** (201):
```json
{
  "message": "Resume uploaded and processed successfully",
  "resume": {
    "_id": "...",
    "title": "John Doe's Resume",
    "templateStyle": "modern",
    "resumeData": { ... },
    "latexCode": "\\documentclass...",
    "source": "upload",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- 400: No file uploaded / Insufficient text extracted / Invalid file type
- 401: Unauthorized
- 502: AI service error
- 500: Server error

---

### 2. Generate Resume from Form

**Endpoint**: `POST /api/resume/generate`

**Description**: Generate a resume from manually entered form data.

**Authentication**: Required

**Request**:
```json
{
  "resumeData": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "title": "Software Engineer"
    },
    "summary": "Experienced developer...",
    "softSkills": [{ "id": "1", "name": "Leadership" }],
    "languages": [{ "id": "1", "name": "English", "proficiency": "Native" }],
    "experience": [...],
    "education": [...],
    "references": [...]
  },
  "templateStyle": "modern"
}
```

**Response** (201):
```json
{
  "message": "Resume generated successfully",
  "resume": { ... }
}
```

**Errors**:
- 400: Missing resume data
- 401: Unauthorized
- 502: AI service error
- 500: Server error

---

### 3. Get All User Resumes

**Endpoint**: `GET /api/resume`

**Description**: Retrieve all resumes belonging to the authenticated user (newest first).

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Resumes fetched successfully",
  "resumes": [
    {
      "_id": "...",
      "title": "John Doe's Resume",
      "templateStyle": "modern",
      "source": "upload",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Resume by ID

**Endpoint**: `GET /api/resume/:id`

**Description**: Retrieve a single resume by ID (ownership enforced).

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Resume fetched successfully",
  "resume": {
    "_id": "...",
    "userId": "...",
    "title": "John Doe's Resume",
    "templateStyle": "modern",
    "resumeData": { ... },
    "latexCode": "\\documentclass...",
    "source": "upload",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**:
- 404: Resume not found
- 401: Unauthorized
- 500: Server error

---

### 5. Update Resume

**Endpoint**: `PATCH /api/resume/:id`

**Description**: Update resume data, LaTeX code, template style, or title.

**Authentication**: Required

**Request** (at least one field required):
```json
{
  "title": "Updated Resume Title",
  "latexCode": "\\documentclass...",
  "resumeData": { ... },
  "templateStyle": "classic"
}
```

**Response** (200):
```json
{
  "message": "Resume updated successfully",
  "resume": { ... }
}
```

**Errors**:
- 400: No update data provided
- 404: Resume not found
- 401: Unauthorized
- 500: Server error

---

### 6. Delete Resume

**Endpoint**: `DELETE /api/resume/:id`

**Description**: Delete a resume (ownership enforced).

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Resume deleted successfully"
}
```

**Errors**:
- 404: Resume not found
- 401: Unauthorized
- 500: Server error

---

### 7. Regenerate LaTeX

**Endpoint**: `POST /api/resume/:id/regenerate-latex`

**Description**: Regenerate LaTeX code for an existing resume using current resume data.

**Authentication**: Required

**Response** (200):
```json
{
  "message": "LaTeX code regenerated successfully",
  "resume": { ... }
}
```

**Errors**:
- 404: Resume not found
- 401: Unauthorized
- 502: AI service error
- 500: Server error

---

## AI Model Fallback Chain

The backend uses OpenRouter API with a fallback chain of free models:

1. `google/gemma-4-31b-it:free`
2. `nvidia/nemotron-3-super-120b-a12b:free`
3. `deepseek/deepseek-v4-flash:free`
4. `openai/gpt-oss-20b:free`

If a model returns a 404 or 429 error, the system automatically tries the next model in the chain.

## Logging

All operations are logged with structured emoji prefixes:

- ℹ️  INFO: General information
- ✅ OK: Successful operations
- ⚠️  WARN: Warnings
- ❌ ERROR: Errors

Example log:
```
ℹ️  [2024-01-01T00:00:00.000Z] [RESUME:REQUEST] POST /api/resume/upload received | user="123" | filename="resume.pdf"
✅ [2024-01-01T00:00:00.000Z] [RESUME:EXTRACT] Text extracted successfully | length=5432
✅ [2024-01-01T00:00:00.000Z] [RESUME:AI] Resume structured successfully | model="google/gemma-4-31b-it:free"
✅ [2024-01-01T00:00:00.000Z] [RESUME:DB] Resume saved | id="abc123"
```

## Database Schema

### Resume Model

```javascript
{
  userId: ObjectId (ref: User, required, indexed),
  title: String (default: "Untitled Resume"),
  templateStyle: String (enum: ["modern", "classic", "minimal"]),
  resumeData: {
    profilePhoto: String,
    personalInfo: {
      name: String (required),
      email: String (required),
      phone: String (required),
      address: String,
      title: String,
      dob: String,
      hobbies: String
    },
    summary: String,
    softSkills: [{ id: String, name: String }],
    languages: [{ id: String, name: String, proficiency: String }],
    experience: [{ id, company, position, duration, description, location }],
    education: [{ id, institution, degree, year, gpa, location }],
    references: [{ id, name, contact, relationship }]
  },
  latexCode: String,
  pdfUrl: String,
  source: String (enum: ["upload", "manual", "latex"]),
  originalFileName: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Next.js API Proxy Routes

The client-side Next.js app includes proxy routes that forward requests to the Express backend:

- `GET /api/resume` → Express `GET /api/resume`
- `POST /api/resume/upload` → Express `POST /api/resume/upload`
- `POST /api/resume/generate` → Express `POST /api/resume/generate`
- `GET /api/resume/:id` → Express `GET /api/resume/:id`
- `PATCH /api/resume/:id` → Express `PATCH /api/resume/:id`
- `DELETE /api/resume/:id` → Express `DELETE /api/resume/:id`
- `POST /api/resume/:id/regenerate-latex` → Express `POST /api/resume/:id/regenerate-latex`

All proxy routes automatically forward cookies for authentication.

## Environment Variables

Required in `server/.env`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5174
```

Required in `client/.env.local`:

```env
NEXT_PUBLIC_EXPRESS_API_URL=http://localhost:3000
```

## Usage Example (Frontend)

```typescript
// Upload resume
const formData = new FormData();
formData.append('file', file);
formData.append('templateStyle', 'modern');

const response = await fetch('/api/resume/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});

const { resume } = await response.json();

// Generate from form
const response = await fetch('/api/resume/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeData, templateStyle: 'modern' }),
  credentials: 'include'
});

// Get all resumes
const response = await fetch('/api/resume', {
  credentials: 'include'
});

// Update resume
const response = await fetch(`/api/resume/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ latexCode: updatedCode }),
  credentials: 'include'
});
```

## Testing

To test the backend:

1. Start the Express server: `cd server && npm run dev`
2. Start the Next.js client: `cd client && npm run dev`
3. Navigate to `/resume-builder` in your browser
4. Upload a resume or fill in the manual form
5. Check the terminal for structured logs

## Error Handling

All controllers include comprehensive error handling:

- File validation (type, size)
- Text extraction errors
- AI service errors (with fallback)
- Database errors
- Authentication errors
- Ownership validation

Errors are logged with context and returned with appropriate HTTP status codes.
