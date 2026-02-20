"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAssignment, getSubmissions, generateFeedback, approveSubmission, requestRevision } from "@/lib/api";
import { Assignment, Submission } from "@/lib/types";
import { CheckCircle2, XCircle, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

export default function AssignmentReviewPage() {
  const params = useParams();
  const assignmentId = params.assignmentId as string;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [assignmentData, submissionsData] = await Promise.all([
          getAssignment(assignmentId),
          getSubmissions(assignmentId),
        ]);
        setAssignment(assignmentData);
        setSubmissions(submissionsData);
        if (submissionsData.length > 0) {
          setSelectedSubmission(submissionsData[0]);
          setFeedbackText(submissionsData[0].feedback || "");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [assignmentId]);

  const handleGenerateFeedback = async () => {
    if (!selectedSubmission) return;
    setGeneratingFeedback(true);
    try {
      const feedback = await generateFeedback(selectedSubmission.id);
      setFeedbackText(feedback);
      toast.success("Фидбек сгенерирован");
    } catch (error) {
      toast.error("Ошибка при генерации фидбека");
    } finally {
      setGeneratingFeedback(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;
    try {
      await approveSubmission(selectedSubmission.id);
      toast.success("Работа одобрена");
      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id ? { ...s, status: "approved" } : s
        )
      );
    } catch (error) {
      toast.error("Ошибка");
    }
  };

  const handleRequestRevision = async () => {
    if (!selectedSubmission || !feedbackText) return;
    try {
      await requestRevision(selectedSubmission.id, feedbackText);
      toast.success("Запрошена доработка");
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id
            ? { ...s, status: "revision_requested", feedback: feedbackText }
            : s
        )
      );
    } catch (error) {
      toast.error("Ошибка");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Задание не найдено</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Students List */}
      <div className="w-64 border-r bg-card overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-2">Студенты</h2>
          <p className="text-sm text-muted-foreground">
            {submissions.length} работ
          </p>
        </div>
        <div className="p-2 space-y-2">
          {submissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => {
                setSelectedSubmission(submission);
                setFeedbackText(submission.feedback || "");
              }}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedSubmission?.id === submission.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {submission.student.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">
                  {submission.student.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {submission.score !== undefined && (
                  <Badge
                    variant={
                      selectedSubmission?.id === submission.id
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {submission.score}/{submission.maxScore}
                  </Badge>
                )}
                <Badge
                  variant={
                    submission.status === "graded" || submission.status === "approved"
                      ? "success"
                      : submission.status === "revision_requested"
                      ? "warning"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {submission.status}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
            <p className="text-muted-foreground">{assignment.description}</p>
          </div>

          {selectedSubmission ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedSubmission.student.name}</CardTitle>
                      <CardDescription>
                        {selectedSubmission.student.email} • {selectedSubmission.student.studentId}
                      </CardDescription>
                    </div>
                    {selectedSubmission.score !== undefined && (
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {selectedSubmission.score}/{selectedSubmission.maxScore}
                        </div>
                        <Badge variant="secondary" className="mt-1">
                          {Math.round((selectedSubmission.score / selectedSubmission.maxScore) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Ответ студента</h3>
                    <div className="rounded-lg border p-4 bg-muted/50">
                      <p className="whitespace-pre-wrap">{selectedSubmission.content}</p>
                    </div>
                  </div>

                  {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Файлы</h3>
                      <div className="space-y-2">
                        {selectedSubmission.files.map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 rounded border bg-background"
                          >
                            <span className="text-sm">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.rubric && selectedSubmission.rubric.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Критерии оценки</h3>
                      <div className="space-y-3">
                        {selectedSubmission.rubric.map((item) => (
                          <div key={item.id} className="rounded-lg border p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{item.criterion}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  {item.earnedPoints ?? 0}/{item.points}
                                </div>
                              </div>
                            </div>
                            {item.feedback && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {item.feedback}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Отправлено: {formatDateTime(selectedSubmission.submittedAt)}
                    {selectedSubmission.gradedAt && (
                      <> • Проверено: {formatDateTime(selectedSubmission.gradedAt)}</>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Выберите студента для проверки</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Sidebar */}
      <div className="w-80 border-l bg-card overflow-y-auto p-6">
        <h2 className="font-semibold mb-4">Фидбек</h2>
        <div className="space-y-4">
          <Button
            onClick={handleGenerateFeedback}
            disabled={!selectedSubmission || generatingFeedback}
            className="w-full"
            variant="outline"
          >
            {generatingFeedback ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Сгенерировать фидбек (AI)
              </>
            )}
          </Button>

          <Textarea
            placeholder="Введите фидбек для студента..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="min-h-[200px]"
          />

          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={!selectedSubmission}
              className="flex-1"
              variant="default"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Одобрить
            </Button>
            <Button
              onClick={handleRequestRevision}
              disabled={!selectedSubmission || !feedbackText}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Доработать
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Быстрые шаблоны:</p>
            <div className="flex flex-wrap gap-2">
              {["Хорошая работа", "Нужна доработка", "Следующие шаги"].map((label) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFeedbackText((prev) => prev + (prev ? "\n\n" : "") + label + ": ")}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
