/**
 * Centralized Route Configuration
 * Use these constants instead of hardcoding route strings across the application.
 */

export const ROUTES = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",
  
  // Protected / App Routes
  DASHBOARD: "/dashboard",
  ATS_CHECKER: "/ats-checker",
  RESUMES: "/resumes",
  JOB_TRACKER: "/job-tracker",
};

// Example groups for middleware or layout checking
export const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.LOGIN];
export const PROTECTED_ROUTES = [ROUTES.DASHBOARD];

export default ROUTES;
