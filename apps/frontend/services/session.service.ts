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

  return response.json();
}
