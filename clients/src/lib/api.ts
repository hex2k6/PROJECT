
export const API_BASE = "http://localhost:3000"; 
export const USERS_URL = `${API_BASE}/users`;

export async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  // json-server trả về 204 cho DELETE -> không có body
  return (res.status === 204 ? (null as unknown as T) : await res.json());
}
