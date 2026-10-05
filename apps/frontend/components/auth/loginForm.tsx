"use client";

import { useState, useActionState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import loginImage from "../../public/loginImage.jpg";
import logo from "../../public/logoCevi.jpeg";

import { Eye, EyeOff } from "lucide-react";
import { CircleAlert } from "lucide-react";

import { loginAction } from "@/actions/auth.actions";

export default function LoginForm() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="relative hidden flex-[1.1] lg:block">
        <Image
          src={loginImage}
          alt="Apetitoso plato de mariscos - El Cevichazo"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 0px, 55vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,18,42,0.78) 0%, rgba(15,35,80,0.65) 50%, rgba(10,18,42,0.85) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20">
              🦐 El Cevichazo
            </span>
          </div>
          <div className="max-w-sm">
            <h1 className="mb-3 text-4xl font-bold font-outfit leading-tight text-white drop-shadow-lg">
              El sabor del mar,
              <br />
              <span className="text-sky-300 font-outfit">en tu mesa.</span>
            </h1>
            <p className="text-sm leading-relaxed text-white/70">
              Todo el control de los gastos de El Cevichazo, en un solo lugar.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-8 md:p-12">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-4 min-h-[72px]">
                {state?.error && (
                  <Alert variant="destructive" className="bg-destructive/10">
                    <CircleAlert className=" h-4 w-4" />
                    <AlertTitle className="text-sm font-semibold">
                      Error al iniciar sesión
                    </AlertTitle>
                    <AlertDescription className="font-medium">
                      {state.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 lg:hidden">
                🦐 El Cevichazo
              </span>
              <Image
                src={logo}
                alt="El Cevichazo Logo"
                className="h-24 w-auto pt-2"
              />
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground">
                Iniciar sesión
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder a tu cuenta.
              </p>
            </div>
            <form className="flex flex-col gap-5" action={formAction}>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  required
                  className="h-10 w-full border-input px-3 bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Contraseña
                  </Label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="h-10 w-full font-inter border-input bg-background pl-3 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label
                  htmlFor="remember-me"
                  className="cursor-pointer select-none text-sm font-normal text-muted-foreground"
                >
                  Recordarme
                </Label>
              </div>
              <Button
                id="login-submit"
                type="submit"
                disabled={isPending}
                className="mt-1 h-10 w-full bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
              >
                {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <span>
            © 2026 El Cevichazo Cantina y Mariscos. Todos los derechos
            reservados.
          </span>
          <span className="mx-2">•</span>
          <a
            href="/terms"
            className="transition-colors hover:text-foreground hover:underline"
          >
            Términos y condiciones
          </a>
          <span className="mx-2">•</span>
          <a
            href="/privacy"
            className="transition-colors hover:text-foreground hover:underline"
          >
            Políticas de privacidad
          </a>
        </div>
      </div>
    </div>
  );
}
