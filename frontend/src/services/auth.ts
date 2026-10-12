import { api } from "@/lib/api";
import type { AdminUser } from "@/types";

export const authService = {
  login: (email: string, password: string) =>
    api<{ user: AdminUser }>("/auth/login", { method: "POST", json: { email, password } }),
  logout: () => api("/auth/logout", { method: "POST" }),
  changePassword: (current_password: string, new_password: string) =>
    api("/auth/password", { method: "PUT", json: { current_password, new_password } }),
};
