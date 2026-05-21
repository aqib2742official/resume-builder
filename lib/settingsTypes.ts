export interface FeatureFlags {
  aiFeatures:      boolean   // AI generate buttons everywhere
  darkMode:        boolean   // dark-mode toggle in navbar
  analytics:       boolean   // /analytics page + nav item
  jobTracker:      boolean   // /job-tracker page + nav item
  coverLetter:     boolean   // /cover-letter page + nav item
  templates:       boolean   // /templates page + nav item
  findJobs:        boolean   // /jobs page + nav item
  resumeCompare:   boolean   // compare mode on resumes page
  versionHistory:  boolean   // version history button on resume cards
  atsChecker:      boolean   // ATS checker panel in editor/analytics
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  aiFeatures:     true,
  darkMode:       true,
  analytics:      true,
  jobTracker:     true,
  coverLetter:    true,
  templates:      true,
  findJobs:       true,
  resumeCompare:  true,
  versionHistory: true,
  atsChecker:     true,
}

export interface SettingsMap {
  maintenanceMode:    boolean
  maxResumesPerUser:  number
  announcement:       string
  features:           FeatureFlags
}

export const DEFAULT_SETTINGS: SettingsMap = {
  maintenanceMode:   false,
  maxResumesPerUser: 20,
  announcement:      '',
  features:          DEFAULT_FEATURE_FLAGS,
}
