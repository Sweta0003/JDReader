export type PrepPriority = "high" | "medium" | "low";

export type PrepTopic = {
  topic: string;
  reason: string;
  priority: PrepPriority;
  /** Concrete study items under this topic */
  subtopics: string[];
};

export type SuggestionCategory = "keyword" | "bullet" | "skills" | "summary";

export type ResumePatch =
  | {
      type: "insert_after_heading";
      heading: string;
      content: string;
    }
  | {
      type: "append_section";
      section: string;
      content: string;
    }
  | {
      type: "replace_phrase";
      find: string;
      replace: string;
    };

export type ResumeSuggestion = {
  id: string;
  category: SuggestionCategory;
  title: string;
  explanation: string;
  patch: ResumePatch;
};

export type CourseSuggestion = {
  title: string;
  provider: string;
  focus: string;
  url: string;
};

export type ProjectSuggestion = {
  title: string;
  why: string;
  deliverables: string[];
};

export type JobInsights = {
  requirementBullets: number;
  responsibilityBullets: number;
  termsFromJob: string[];
  role: string;
};

export type AnalysisResult = {
  prepTopics: PrepTopic[];
  suggestions: ResumeSuggestion[];
  jobInsights: JobInsights;
  courses: CourseSuggestion[];
  projects: ProjectSuggestion[];
};

export type SuggestionState = "pending" | "accepted" | "skipped";
