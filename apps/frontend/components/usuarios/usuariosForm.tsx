"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlusIcon,
  UserIcon,
  EnvelopeSimpleIcon,
  LockIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  crearUsuarioAction,
  actualizarUsuarioAction,
} from "@/actions/usuarios/actions";

import type { Usuario } from "@/types/usuario";

type UsuarioFormProps = {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  usuario?: Usuario | null;
};

export default function UsuariosForm({
  abierto,
  onAbiertoChange,
  usuario,
}: UsuarioFormProps) {
  const router = useRouter();
  const esEdicion = usuario != null;

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    if (abierto) {
      setNombre(usuario?.userName ?? "");
      setCorreo(usuario?.email ?? "");
      setError("");
    }
  }, [abierto, usuario]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    setCargando(true);

    try {
      const resultado =
        esEdicion && usuario
          ? await actualizarUsuarioAction({
              id: usuario.id,
              userName: nombre,
              email: correo,
            })
          : await crearUsuarioAction({
              userName: nombre,
              email: correo,
              password: String(formData.get("password") ?? ""),
              confirmarPassword: String(
                formData.get("confirmar_password") ?? "",
              ),
            });

      if (!resultado.success) {
        setError(resultado.message);
        return;
      }

      onAbiertoChange(false);
      router.refresh();
    } catch {
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={abierto} onOpenChange={onAbiertoChange}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
                {esEdicion ? (
                  <PencilSimpleIcon className="size-5" weight="duotone" />
                ) : (
                  <UserPlusIcon className="size-5" weight="duotone" />
                )}
              </div>

              <DialogHeader className="gap-1.5">
                <DialogTitle className="font-semibold text-base">
                  {esEdicion ? "Editar usuario" : "Nuevo usuario"}
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground">
                  {esEdicion
                    ? "Modifica el nombre y correo electrónico del usuario."
                    : "Ingresa los datos para registrar un nuevo usuario en el sistema."}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5">
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="nombre" className="text-sm font-medium">
                    Nombre de usuario
                  </FieldLabel>

                  <div className="relative">
                    <UserIcon
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                      weight="duotone"
                    />
                    <Input
                      id="nombre"
                      name="nombre"
                      value={nombre}
                      onChange={(event) => setNombre(event.target.value)}
                      placeholder="Ej. Lucía caja"
                      className="h-10 pl-9 text-sm"
                      required
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="correo" className="text-sm font-medium">
                    Correo electrónico
                  </FieldLabel>

                  <div className="relative">
                    <EnvelopeSimpleIcon
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                      weight="duotone"
                    />
                    <Input
                      id="correo"
                      name="correo"
                      type="email"
                      value={correo}
                      onChange={(event) => setCorreo(event.target.value)}
                      placeholder="usuario@elcevichazo.com"
                      className="h-10 pl-9 text-sm"
                      required
                    />
                  </div>
                </Field>

                {!esEdicion && (
                  <>
                    <Separator />

                    <Field>
                      <FieldLabel
                        htmlFor="password"
                        className="text-sm font-medium"
                      >
                        Contraseña
                      </FieldLabel>

                      <div className="relative">
                        <LockIcon
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                          weight="duotone"
                        />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          minLength={8}
                          placeholder="Mínimo 8 caracteres"
                          className="h-10 pl-9 text-sm"
                          required
                        />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel
                        htmlFor="confirmar_password"
                        className="text-sm font-medium"
                      >
                        Confirmar contraseña
                      </FieldLabel>

                      <div className="relative">
                        <LockIcon
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                          weight="duotone"
                        />
                        <Input
                          id="confirmar_password"
                          name="confirmar_password"
                          type="password"
                          minLength={8}
                          placeholder="Repite la contraseña"
                          className="h-10 pl-9 text-sm"
                          required
                        />
                      </div>
                    </Field>
                  </>
                )}
              </FieldGroup>

              {error && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            <Separator />

            <DialogFooter className="px-6 py-4 bg-muted/30">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => onAbiertoChange(false)}
                disabled={cargando}
                className="gap-1.5"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                size="lg"
                className="gap-1.5"
                disabled={cargando}
              >
                {cargando
                  ? "Guardando..."
                  : esEdicion
                    ? "Guardar cambios"
                    : "Crear usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
