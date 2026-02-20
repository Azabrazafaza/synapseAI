import {
  Course,
  Assignment,
  Student,
  Submission,
  Insight,
  User,
  ChatMessage,
} from "./types";
import {
  mockCourses,
  mockAssignments,
  mockStudents,
  mockSubmissions,
  mockInsights,
  mockUser,
  mockChatMessages,
} from "./mock-data";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(Math.random() * 500 + 200);

// Auth
export async function login(email: string, password: string): Promise<User> {
  await randomDelay();
  if (email && password) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(mockUser));
    }
    return mockUser;
  }
  throw new Error("Invalid credentials");
}

export async function getCurrentUser(): Promise<User | null> {
  await randomDelay();
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

// Courses
export async function getCourses(): Promise<Course[]> {
  await randomDelay();
  return mockCourses;
}

export async function getCourse(id: string): Promise<Course | null> {
  await randomDelay();
  return mockCourses.find((c) => c.id === id) || null;
}

// Assignments
export async function getAssignments(courseId?: string): Promise<Assignment[]> {
  await randomDelay();
  if (courseId) {
    return mockAssignments.filter((a) => a.courseId === courseId);
  }
  return mockAssignments;
}

export async function getAssignment(id: string): Promise<Assignment | null> {
  await randomDelay();
  return mockAssignments.find((a) => a.id === id) || null;
}

// Students
export async function getStudents(courseId: string): Promise<Student[]> {
  await randomDelay();
  return mockStudents.filter((s) => s.courseId === courseId);
}

// Submissions
export async function getSubmissions(
  assignmentId: string
): Promise<Submission[]> {
  await randomDelay();
  return mockSubmissions.filter((s) => s.assignmentId === assignmentId);
}

export async function getSubmission(id: string): Promise<Submission | null> {
  await randomDelay();
  return mockSubmissions.find((s) => s.id === id) || null;
}

// AI Features
export async function generateFeedback(
  submissionId: string
): Promise<string> {
  await delay(1500); // Simulate AI processing
  const submission = mockSubmissions.find((s) => s.id === submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }
  return `Отличная работа, ${submission.student.name}! Вы продемонстрировали хорошее понимание материала. Основные сильные стороны: корректная реализация алгоритма, аккуратный код. Рекомендации для улучшения: добавить обработку краевых случаев, улучшить документацию. Оценка: ${submission.score || 85}/100.`;
}

export async function approveSubmission(submissionId: string): Promise<void> {
  await randomDelay();
  // In real app, this would update the submission status
}

export async function requestRevision(
  submissionId: string,
  feedback: string
): Promise<void> {
  await randomDelay();
  // In real app, this would update the submission status
}

// Insights
export async function getInsights(courseId: string): Promise<Insight[]> {
  await randomDelay();
  return mockInsights.filter((i) => i.courseId === courseId);
}

// Chat
export async function sendChatMessage(
  message: string
): Promise<ChatMessage> {
  await delay(800);
  const responses: Record<string, string> = {
    "объясни критерии оценки": "Критерии оценки включают: корректность реализации (40%), качество кода (30%), анализ результатов (30%). Каждый критерий оценивается по шкале от 0 до максимального балла.",
    "создай вопросы для теста": "Вот несколько вопросов для теста по машинному обучению:\n1. Что такое градиентный спуск?\n2. В чем разница между L1 и L2 регуляризацией?\n3. Объясните концепцию переобучения.\n4. Как работает обратное распространение ошибки?",
    "суммируй частые ошибки": "Наиболее частые ошибки студентов:\n1. Неправильная инициализация весов в нейронных сетях\n2. Отсутствие нормализации данных\n3. Неправильный выбор функции активации\n4. Проблемы с вычислением градиента",
  };

  const lowerMessage = message.toLowerCase();
  let response = "Понял ваш запрос. Вот информация по теме: " + message;

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      response = value;
      break;
    }
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content: response,
    timestamp: new Date().toISOString(),
  };
}
