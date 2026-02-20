import {
  Course,
  Assignment,
  Student,
  Submission,
  Insight,
  User,
  ChatMessage,
} from "./types";

export const mockUser: User = {
  id: "1",
  name: "Доктор Иванов",
  email: "ivanov@university.edu",
  role: "teacher",
};

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Введение в машинное обучение",
    code: "CS401",
    description: "Основы ML и нейронных сетей",
    semester: "Весна",
    year: 2024,
    studentCount: 45,
    assignmentCount: 8,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Алгоритмы и структуры данных",
    code: "CS301",
    description: "Классические алгоритмы и их анализ",
    semester: "Весна",
    year: 2024,
    studentCount: 52,
    assignmentCount: 12,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Веб-разработка",
    code: "CS201",
    description: "React, Next.js, TypeScript",
    semester: "Весна",
    year: 2024,
    studentCount: 38,
    assignmentCount: 6,
    createdAt: "2024-01-20",
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    courseId: "1",
    title: "Лабораторная работа: Линейная регрессия",
    description: "Реализовать алгоритм линейной регрессии с нуля",
    type: "project",
    dueDate: "2024-03-15",
    status: "published",
    totalSubmissions: 42,
    gradedSubmissions: 28,
    createdAt: "2024-02-01",
  },
  {
    id: "2",
    courseId: "1",
    title: "Тест: Основы нейронных сетей",
    description: "Тест на понимание базовых концепций",
    type: "test",
    dueDate: "2024-03-10",
    status: "published",
    totalSubmissions: 45,
    gradedSubmissions: 45,
    createdAt: "2024-02-05",
  },
  {
    id: "3",
    courseId: "2",
    title: "Эссе: Анализ сложности алгоритмов",
    type: "essay",
    dueDate: "2024-03-20",
    status: "published",
    totalSubmissions: 35,
    gradedSubmissions: 12,
    createdAt: "2024-02-10",
  },
];

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Александр Петров",
    email: "petrov@student.edu",
    studentId: "ST001",
    courseId: "1",
  },
  {
    id: "2",
    name: "Мария Сидорова",
    email: "sidorova@student.edu",
    studentId: "ST002",
    courseId: "1",
  },
  {
    id: "3",
    name: "Иван Козлов",
    email: "kozlov@student.edu",
    studentId: "ST003",
    courseId: "1",
  },
  {
    id: "4",
    name: "Анна Волкова",
    email: "volkova@student.edu",
    studentId: "ST004",
    courseId: "1",
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: "1",
    assignmentId: "1",
    studentId: "1",
    student: mockStudents[0],
    status: "graded",
    score: 85,
    maxScore: 100,
    submittedAt: "2024-03-14T10:30:00",
    gradedAt: "2024-03-14T15:20:00",
    content: "Реализовал алгоритм линейной регрессии. Использовал градиентный спуск для оптимизации. Результаты на тестовых данных: R² = 0.92.",
    files: ["regression.py", "report.pdf"],
    feedback: "Отличная работа! Алгоритм реализован корректно. Хорошее понимание математики. Можно улучшить: добавить регуляризацию.",
    rubric: [
      {
        id: "r1",
        criterion: "Корректность реализации",
        description: "Алгоритм работает правильно",
        points: 40,
        earnedPoints: 38,
        feedback: "Почти идеально",
      },
      {
        id: "r2",
        criterion: "Качество кода",
        description: "Читаемость и структура",
        points: 30,
        earnedPoints: 27,
        feedback: "Хорошо структурирован",
      },
      {
        id: "r3",
        criterion: "Анализ результатов",
        description: "Интерпретация и выводы",
        points: 30,
        earnedPoints: 20,
        feedback: "Можно глубже",
      },
    ],
  },
  {
    id: "2",
    assignmentId: "1",
    studentId: "2",
    student: mockStudents[1],
    status: "submitted",
    score: undefined,
    maxScore: 100,
    submittedAt: "2024-03-14T11:15:00",
    content: "Реализовала базовую версию. Есть проблемы с конвергенцией.",
    files: ["regression.py"],
  },
  {
    id: "3",
    assignmentId: "1",
    studentId: "3",
    student: mockStudents[2],
    status: "revision_requested",
    score: 65,
    maxScore: 100,
    submittedAt: "2024-03-13T09:00:00",
    gradedAt: "2024-03-13T14:00:00",
    content: "Попытка реализации, но не все работает.",
    feedback: "Нужно доработать алгоритм. Ошибки в вычислении градиента.",
  },
];

export const mockInsights: Insight[] = [
  {
    id: "1",
    courseId: "1",
    type: "topic_mastery",
    title: "Освоение тем по курсу",
    description: "Анализ понимания студентами ключевых концепций",
    data: {
      topics: [
        { topic: "Линейная регрессия", mastery: 85, studentCount: 42 },
        { topic: "Нейронные сети", mastery: 72, studentCount: 45 },
        { topic: "Градиентный спуск", mastery: 68, studentCount: 40 },
        { topic: "Обратное распространение", mastery: 55, studentCount: 38 },
        { topic: "Регуляризация", mastery: 48, studentCount: 35 },
      ],
    },
    recommendations: [
      "Провести дополнительное занятие по обратному распространению",
      "Добавить практические задания по регуляризации",
    ],
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    courseId: "1",
    type: "at_risk",
    title: "Студенты в зоне риска",
    description: "Студенты с низкой успеваемостью",
    data: {
      atRiskStudents: [
        {
          studentId: "5",
          studentName: "Дмитрий Соколов",
          riskScore: 0.35,
          issues: ["Низкие оценки по тестам", "Пропуски занятий"],
        },
        {
          studentId: "6",
          studentName: "Елена Морозова",
          riskScore: 0.42,
          issues: ["Проблемы с пониманием нейронных сетей"],
        },
      ],
    },
    recommendations: [
      "Назначить индивидуальные консультации",
      "Предложить дополнительные материалы",
    ],
    createdAt: "2024-03-15",
  },
  {
    id: "3",
    courseId: "1",
    type: "gap_analysis",
    title: "Частые пробелы в знаниях",
    description: "Темы, которые вызывают наибольшие трудности",
    data: {
      commonGaps: [
        {
          topic: "Обратное распространение ошибки",
          frequency: 28,
          affectedStudents: 28,
        },
        {
          topic: "Регуляризация L1/L2",
          frequency: 22,
          affectedStudents: 22,
        },
        {
          topic: "Оптимизация гиперпараметров",
          frequency: 18,
          affectedStudents: 18,
        },
      ],
    },
    recommendations: [
      "Создать видео-урок по обратному распространению",
      "Добавить интерактивные примеры регуляризации",
    ],
    createdAt: "2024-03-15",
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Привет! Я AI-ассистент SynapseAI. Помогу с проверкой заданий, созданием фидбека и анализом успеваемости. Чем могу помочь?",
    timestamp: new Date().toISOString(),
  },
];
