const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL!;
const TOKEN_KEY = "svarog_token";

export interface TokenClaims {
  user_id: number;
  username: string;
  roles: string[];
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${AUTH_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Credenciales inválidas");
  }
  const { token } = await res.json();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getClaims(): TokenClaims | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    // Check expiry
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      logout();
      return null;
    }
    return {
      user_id: decoded.user_id,
      username: decoded.username,
      roles: decoded.roles ?? [],
    };
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getClaims() !== null;
}
