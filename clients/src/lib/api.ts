export const BASE_URL = "http://localhost:3000";
export const USERS_URL  = `${BASE_URL}/users`;
export const ADMINS_URL = `${BASE_URL}/admins`; 
export const SUBJECTS_URL = `${BASE_URL}/subjects`;
export const LESSONS_URL  = `${BASE_URL}/lessons`;


export async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
