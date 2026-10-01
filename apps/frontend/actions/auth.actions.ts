"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginUser } from "@/services/auth.service";

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
      return {
        error: "A valid token was not received from the server",
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
