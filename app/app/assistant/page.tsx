"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sendChatMessage } from "@/lib/api";
import { ChatMessage } from "@/lib/types";
import { Send, Sparkles, FileText, HelpCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/utils";
import { mockChatMessages } from "@/lib/mock-data";

const quickPrompts = [
  { icon: FileText, label: "Объясни критерии оценки", prompt: "объясни критерии оценки" },
  { icon: BookOpen, label: "Создай вопросы для теста", prompt: "создай вопросы для теста" },
  { icon: HelpCircle, label: "Суть частых ошибок", prompt: "суммируй частые ошибки" },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(input);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-4rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">AI Ассистент</h1>
        </div>
        <p className="text-muted-foreground">
          Задавайте вопросы о проверке заданий, создании фидбека и анализе успеваемости
        </p>
      </motion.div>

      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="border-b">
            <CardTitle>Чат с ассистентом</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatDateTime(message.timestamp)}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl p-4">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {quickPrompts.map((prompt) => {
              const Icon = prompt.icon;
              return (
                <Button
                  key={prompt.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {prompt.label}
                </Button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Задайте вопрос ассистенту..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} disabled={!input.trim() || loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
