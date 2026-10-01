import { API_URL } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginRequest) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "No se pudo iniciar sesión");
  }

  return response.json();
}
