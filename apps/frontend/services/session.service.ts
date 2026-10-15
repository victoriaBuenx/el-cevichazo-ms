import { API_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const accessTokenCookie = allCookies.find(
    (cookie) => cookie.name === "access_token",
  );

  if (!accessTokenCookie) {
    return null;
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessTokenCookie.value}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    ...data,
    id: data.userId ?? data.id,
    nombre:
      data.userName || data.nombre || data.email?.split("@")[0] || "Usuario",
    rol: data.role || data.rol || "Usuario",
  };
}
