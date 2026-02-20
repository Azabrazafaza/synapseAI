"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/store/use-store";
import { Moon, Sun, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, theme, toggleTheme } = useStore();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Настройки</h1>
        <p className="text-muted-foreground">
          Управление профилем и настройками приложения
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <CardTitle>Профиль</CardTitle>
              </div>
              <CardDescription>Информация о вашем аккаунте</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Имя</label>
                  <Input defaultValue={user?.name} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" defaultValue={user?.email} disabled />
                </div>
                <Button>Сохранить изменения</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <CardTitle>Уведомления</CardTitle>
              </div>
              <CardDescription>Настройки уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email уведомления</p>
                  <p className="text-sm text-muted-foreground">
                    Получать уведомления на email
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Новые задания</p>
                  <p className="text-sm text-muted-foreground">
                    Уведомления о новых заданиях
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Проверка работ</p>
                  <p className="text-sm text-muted-foreground">
                    Уведомления о новых работах на проверку
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <CardTitle>Внешний вид</CardTitle>
              </div>
              <CardDescription>Настройки темы и отображения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Темная тема</p>
                  <p className="text-sm text-muted-foreground">
                    Переключить между светлой и темной темой
                  </p>
                </div>
                <Button variant="outline" onClick={toggleTheme}>
                  {theme === "light" ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Темная
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Светлая
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
