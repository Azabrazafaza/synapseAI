export interface User {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "admin";
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  semester: string;
  year: number;
  studentCount: number;
  assignmentCount: number;
  createdAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: "test" | "essay" | "project" | "homework";
  dueDate: string;
  status: "draft" | "published" | "closed";
  totalSubmissions: number;
  gradedSubmissions: number;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  courseId: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  student: Student;
  status: "submitted" | "graded" | "revision_requested" | "approved";
  score?: number;
  maxScore: number;
  submittedAt: string;
  gradedAt?: string;
  content?: string;
  files?: string[];
  feedback?: string;
  rubric?: RubricItem[];
}

export interface RubricItem {
  id: string;
  criterion: string;
  description: string;
  points: number;
  earnedPoints?: number;
  feedback?: string;
}

export interface Insight {
  id: string;
  courseId: string;
  type: "gap_analysis" | "at_risk" | "topic_mastery";
  title: string;
  description: string;
  data: InsightData;
  recommendations?: string[];
  createdAt: string;
}

export interface InsightData {
  topics?: TopicMastery[];
  atRiskStudents?: AtRiskStudent[];
  commonGaps?: CommonGap[];
}

export interface TopicMastery {
  topic: string;
  mastery: number;
  studentCount: number;
}

export interface AtRiskStudent {
  studentId: string;
  studentName: string;
  riskScore: number;
  issues: string[];
}

export interface CommonGap {
  topic: string;
  frequency: number;
  affectedStudents: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
