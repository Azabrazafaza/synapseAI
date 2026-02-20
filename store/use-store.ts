import { create } from "zustand";
import { User, Course } from "@/lib/types";

interface AppState {
  user: User | null;
  currentCourse: Course | null;
  theme: "light" | "dark";
  setUser: (user: User | null) => void;
  setCurrentCourse: (course: Course | null) => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  currentCourse: null,
  theme: "light",
  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  },
  setCurrentCourse: (course) => set({ currentCourse: course }),
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
      }
      return { theme: newTheme };
    }),
}));

// Theme initialization will be handled in app layout
