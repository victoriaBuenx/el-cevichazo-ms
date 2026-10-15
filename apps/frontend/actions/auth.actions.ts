"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginUser, logoutUser } from "@/services/auth.service";

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  try {
    const loginResponse = await loginUser({
      email,
      password,
    });

    if (!loginResponse.accessToken) {
      console.error("A valid token was not received from the server");

      return {
        error: "No fue posible completar el inicio de sesión.",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("access_token", loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("refresh_token", loginResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    console.error("Login Action Error:", error);

    return {
      error: error instanceof Error ? error.message : "Could not sign in",
    };
  }
  redirect("/app");
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    await logoutUser(accessToken, refreshToken);

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
  } catch (error) {
    console.error("Logout Action Error:", error);
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
  }

  redirect("/login");
}
