/**
 * Centralized Route Configuration
 * Use these constants instead of hardcoding route strings across the application.
 */

export const ROUTES = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Protected / App Routes
  DASHBOARD: "/dashboard",
  ATS_CHECKER: "/ats-checker",
  RESUME_BUILDER: "/resume-builder",
  INTERVIEW: "/interview",
  ROADMAPS: "/roadmaps",

  // Legacy / Alias
  RESUMES: "/resumes",
  JOB_TRACKER: "/job-tracker",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

// Route groups for middleware or layout checking
export const AUTH_ROUTES: AppRoute[] = [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD];
export const PUBLIC_ROUTES: AppRoute[] = [ROUTES.HOME, ...AUTH_ROUTES];
export const PROTECTED_ROUTES: AppRoute[] = [
  ROUTES.DASHBOARD,
  ROUTES.ATS_CHECKER,
  ROUTES.RESUME_BUILDER,
  ROUTES.INTERVIEW,
  ROUTES.ROADMAPS,
];

export default ROUTES;
