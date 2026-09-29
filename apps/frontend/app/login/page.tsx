import type { Metadata } from "next";
import LoginForm from "@/components/auth/loginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión | El Cevichazo",
  description:
    "Accede a la plataforma de gestión de El Cevichazo. Ingresa tu correo y contraseña para continuar.",
};

export default function LoginPage() {
  return <LoginForm />;
}
