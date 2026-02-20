"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useStore } from "@/store/use-store";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useStore((state) => state.user);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    // Initialize theme
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      const currentTheme = storedTheme || theme;
      document.documentElement.classList.toggle("dark", currentTheme === "dark");
      if (storedTheme && storedTheme !== theme) {
        useStore.getState().setTheme(storedTheme);
      }
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (!storedUser && !user) {
        router.push("/auth/login");
      } else if (storedUser && !user) {
        useStore.getState().setUser(JSON.parse(storedUser));
      }
    }
  }, [user, router]);

  if (!user && pathname?.startsWith("/app")) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
