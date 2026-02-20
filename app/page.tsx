"use client";

import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand-logo";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <BrandLogo size="md" variant="icon-text" />
          <Link href="/auth/login">
            <Button variant="outline">Войти</Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              AI Teaching Assistant
              <br />
              <span className="text-primary">для проверки и фидбека</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Экономьте часы на проверке заданий. Получайте консистентные оценки и
              детальный анализ пробелов в знаниях студентов.
            </p>
            <Link href="/app/dashboard">
              <Button size="lg" className="gap-2">
                Открыть Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Clock,
                  title: "Экономьте время",
                  description: "Автоматическая проверка тестов и практических заданий",
                },
                {
                  icon: CheckCircle2,
                  title: "Консистентные оценки",
                  description: "Единые критерии оценки для всех студентов",
                },
                {
                  icon: BarChart3,
                  title: "Анализ пробелов",
                  description: "Выявляйте темы, которые студенты не поняли",
                },
                {
                  icon: MessageSquare,
                  title: "AI Q&A",
                  description: "Ассистент отвечает на вопросы студентов",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <Icon className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
