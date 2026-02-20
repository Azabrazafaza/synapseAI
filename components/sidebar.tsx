"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/courses", label: "Курсы", icon: BookOpen },
  { href: "/app/assignments", label: "Задания", icon: FileText },
  { href: "/app/insights", label: "Аналитика", icon: BarChart3 },
  { href: "/app/assistant", label: "AI Ассистент", icon: MessageSquare },
  { href: "/app/settings", label: "Настройки", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <BrandLogo size="sm" variant="icon-text" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
