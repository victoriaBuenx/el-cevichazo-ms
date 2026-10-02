import { API_URL } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginRequest) {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.error("Login connection error:", error);

    throw new Error(
      "No fue posible conectar con el servicio. Inténtalo nuevamente más tarde.",
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "No se pudo iniciar sesión");
  }

  return response.json();
}
