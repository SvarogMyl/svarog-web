const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL!;
const TOKEN_KEY = "svarog_token";

export interface TokenClaims {
  user_id: number;
  username: string;
  roles: string[];
  profile_complete: boolean;
}

export async function login(identity: string, password: string): Promise<string> {
  const res = await fetch(`${AUTH_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Credenciales inválidas");
  }
  const { token } = await res.json();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export async function register(username: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Error al crear la cuenta");
  }
}

export async function completeOnboarding(
  token: string,
  name: string,
  phone: string,
  marketingConsent: boolean
): Promise<string> {
  const res = await fetch(`${AUTH_URL}/auth/onboarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ name, phone, marketing_consent: marketingConsent }),
  });
  if (!res.ok) throw new Error("Error al guardar el perfil");
  const { token: newToken } = await res.json();
  localStorage.setItem(TOKEN_KEY, newToken);
  return newToken;
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
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      logout();
      return null;
    }
    return {
      user_id: decoded.user_id,
      username: decoded.username,
      roles: decoded.roles ?? [],
      profile_complete: decoded.profile_complete ?? true,
    };
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getClaims() !== null;
}

export async function verifyCode(email: string, code: string): Promise<string> {
  const res = await fetch(`${AUTH_URL}/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Código inválido o expirado");
  }
  const { token } = await res.json();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export async function resendVerification(email: string): Promise<void> {
  const res = await fetch(`${AUTH_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo reenviar el código");
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await fetch(`${AUTH_URL}/auth/password-reset/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(token: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH_URL}/auth/password-reset/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Token inválido o expirado");
  }
}

export interface UserProfile {
  email: string;
  name: string;
  phone: string;
  plan: string;
  username: string;
}

export async function getProfile(authToken: string): Promise<UserProfile> {
  const res = await fetch(`${AUTH_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error("Error al cargar el perfil");
  return res.json();
}

export async function updateProfile(authToken: string, name: string, phone: string): Promise<void> {
  const res = await fetch(`${AUTH_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ name, phone }),
  });
  if (!res.ok) throw new Error("Error al actualizar el perfil");
  const { token } = await res.json();
  localStorage.setItem(TOKEN_KEY, token);
}
