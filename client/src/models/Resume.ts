export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  dob: string;
  hobbies: string;
}

export interface SoftSkill {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
  location?: string;
}

export interface Reference {
  id: string;
  name: string;
  contact: string;
  relationship?: string;
}

export interface ResumeData {
  profilePhoto?: string | null;
  personalInfo: PersonalInfo;
  summary: string;
  softSkills: SoftSkill[];
  languages: Language[];
  experience: Experience[];
  education: Education[];
  references: Reference[];
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  templateStyle: "modern" | "classic" | "minimal";
  resumeData: ResumeData;
  latexCode: string;
  pdfUrl?: string;
  source: "upload" | "manual" | "latex";
  originalFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListItem {
  _id: string;
  title: string;
  templateStyle: "modern" | "classic" | "minimal";
  source: "upload" | "manual" | "latex";
  createdAt: string;
  updatedAt: string;
}
