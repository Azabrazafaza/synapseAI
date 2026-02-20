"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInsights, getCourses } from "@/lib/api";
import { Insight, Course } from "@/lib/types";
import { BarChart3, TrendingDown, Users, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setSelectedCourseId(coursesData[0].id);
          const insightsData = await getInsights(coursesData[0].id);
          setInsights(insightsData);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      async function loadInsights() {
        const data = await getInsights(selectedCourseId);
        setInsights(data);
      }
      loadInsights();
    }
  }, [selectedCourseId]);

  const topicMastery = insights.find((i) => i.type === "topic_mastery");
  const atRisk = insights.find((i) => i.type === "at_risk");
  const gaps = insights.find((i) => i.type === "gap_analysis");

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const topicData =
    topicMastery?.data.topics?.map((t) => ({
      topic: t.topic,
      mastery: t.mastery,
      students: t.studentCount,
    })) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Аналитика</h1>
        <p className="text-muted-foreground">
          Анализ пробелов в знаниях и успеваемости студентов
        </p>
      </motion.div>

      {courses.length > 0 && (
        <div className="flex gap-4">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedCourseId === course.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {course.name}
            </button>
          ))}
        </div>
      )}

      {topicData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Освоение тем</CardTitle>
              <CardDescription>
                Процент понимания студентами ключевых концепций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="mastery" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {atRisk && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <CardTitle>Студенты в зоне риска</CardTitle>
                </div>
                <CardDescription>{atRisk.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {atRisk.data.atRiskStudents?.map((student) => (
                  <div key={student.studentId} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{student.studentName}</h4>
                      <Badge variant="destructive">
                        Риск: {Math.round(student.riskScore * 100)}%
                      </Badge>
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {student.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {gaps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <CardTitle>Частые пробелы</CardTitle>
                </div>
                <CardDescription>{gaps.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gaps.data.commonGaps?.map((gap, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{gap.topic}</h4>
                      <Badge variant="secondary">
                        {gap.affectedStudents} студентов
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Встречается в {gap.frequency} работах
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {topicMastery?.recommendations && topicMastery.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Рекомендации</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {topicMastery.recommendations.map((rec, i) => (
                  <li key={i} className="text-muted-foreground">{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
