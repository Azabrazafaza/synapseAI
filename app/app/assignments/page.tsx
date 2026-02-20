"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAssignments } from "@/lib/api";
import { Assignment } from "@/lib/types";
import { Search, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await getAssignments();
        setAssignments(data);
        setFilteredAssignments(data);
      } finally {
        setLoading(false);
      }
    }
    loadAssignments();
  }, []);

  useEffect(() => {
    let filtered = assignments;

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredAssignments(filtered);
  }, [search, statusFilter, assignments]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Задания</h1>
        <p className="text-muted-foreground">
          Все ваши задания
        </p>
      </motion.div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск заданий..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="draft">Черновик</SelectItem>
            <SelectItem value="published">Опубликовано</SelectItem>
            <SelectItem value="closed">Закрыто</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Задания не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/app/assignments/${assignment.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <Badge variant="secondary">{assignment.type}</Badge>
                          <Badge
                            variant={
                              assignment.status === "published"
                                ? "default"
                                : assignment.status === "closed"
                                ? "outline"
                                : "outline"
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {assignment.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Срок: {formatDate(assignment.dueDate)}</span>
                          <span>
                            Проверено: {assignment.gradedSubmissions}/{assignment.totalSubmissions}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
