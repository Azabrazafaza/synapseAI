"use client";

import { Search, Bell, Moon, Sun, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useStore } from "@/store/use-store";
import { useRouter } from "next/navigation";

export function Topbar() {
  const { user, theme, toggleTheme } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    useStore.getState().setUser(null);
    router.push("/auth/login");
  };

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск курсов, заданий..."
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-accent"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
        <button className="relative rounded-lg p-2 hover:bg-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
