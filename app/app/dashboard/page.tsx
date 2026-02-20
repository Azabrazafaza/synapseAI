"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourses, getAssignments } from "@/lib/api";
import { Course, Assignment } from "@/lib/types";
import { BookOpen, FileText, Users, TrendingUp, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesData, assignmentsData] = await Promise.all([
          getCourses(),
          getAssignments(),
        ]);
        setCourses(coursesData);
        setAssignments(assignmentsData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingGrading = assignments.filter(
    (a) => a.gradedSubmissions < a.totalSubmissions
  ).length;

  const totalStudents = courses.reduce((sum, c) => sum + c.studentCount, 0);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Обзор ваших курсов и заданий
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Курсы</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                Активных курсов
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Задания</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
              <p className="text-xs text-muted-foreground">
                Всего заданий
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Студенты</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Всего студентов
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">На проверке</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingGrading}</div>
              <p className="text-xs text-muted-foreground">
                Требуют проверки
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Недавние курсы</CardTitle>
              <CardDescription>Ваши активные курсы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <Link
                  key={course.id}
                  href={`/app/courses/${course.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors">
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.code} • {course.studentCount} студентов
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Задания на проверке</CardTitle>
              <CardDescription>Требуют вашего внимания</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments
                .filter((a) => a.gradedSubmissions < a.totalSubmissions)
                .slice(0, 3)
                .map((assignment) => (
                  <Link
                    key={assignment.id}
                    href={`/app/assignments/${assignment.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors">
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.totalSubmissions - assignment.gradedSubmissions} на проверке
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {assignment.type}
                      </Badge>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
