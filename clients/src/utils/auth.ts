import type { Role } from "../type/type";

type AuthPayload = { userId: number; email: string; fullName: string; role: Role };

const KEY = "auth";

export function setAuth(data: AuthPayload) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getAuth(): AuthPayload | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthPayload) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export const isLoggedIn = () => !!getAuth();
export const isAdmin    = () => getAuth()?.role === "admin";
