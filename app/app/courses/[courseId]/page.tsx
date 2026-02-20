"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getCourse, getAssignments, getStudents, getInsights } from "@/lib/api";
import { Course, Assignment, Student, Insight } from "@/lib/types";
import { Users, FileText, BarChart3, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseData, assignmentsData, studentsData, insightsData] = await Promise.all([
          getCourse(courseId),
          getAssignments(courseId),
          getStudents(courseId),
          getInsights(courseId),
        ]);
        setCourse(courseData);
        setAssignments(assignmentsData);
        setStudents(studentsData);
        setInsights(insightsData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Курс не найден</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
        <p className="text-muted-foreground">
          {course.code} • {course.semester} {course.year}
        </p>
      </motion.div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">
            <FileText className="mr-2 h-4 w-4" />
            Задания
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Студенты
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart3 className="mr-2 h-4 w-4" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Нет заданий</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Link key={assignment.id} href={`/app/assignments/${assignment.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignment.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{assignment.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Срок: {formatDate(assignment.dueDate)}</span>
                        <span>
                          Проверено: {assignment.gradedSubmissions}/{assignment.totalSubmissions}
                        </span>
                        <Badge
                          variant={
                            assignment.status === "published" ? "default" : "outline"
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {students.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Нет студентов</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{student.studentId}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Нет данных аналитики</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <CardTitle>{insight.title}</CardTitle>
                    <CardDescription>{insight.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {insight.recommendations && insight.recommendations.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">Рекомендации:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {insight.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Настройки курса</CardTitle>
              <CardDescription>Управление параметрами курса</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Настройки будут доступны позже</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
