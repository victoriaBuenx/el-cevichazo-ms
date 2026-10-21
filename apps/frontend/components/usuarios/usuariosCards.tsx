"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  PencilSimpleIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UserMinusIcon,
  CashRegisterIcon,
} from "@phosphor-icons/react";
import { ConfirmarAcción } from "../shared/confirmarAcción";
import { useState } from "react";

export function UsuariosCard({
  id,
  nombre,
  correo,
  activo = true,
  rol = "Operador",
  fechaAlta,
  onEditar,
  onCambiarEstatus,
}: {
  id?: string;
  nombre: string;
  correo?: string;
  activo?: boolean;
  rol?: string;
  fechaAlta: string;
  onEditar?: () => void;
  onCambiarEstatus?: (activo: boolean) => void;
}) {
  const esAdmin = rol === "Admin";
  const [confirmarDesactivar, setConfirmarDesactivar] = useState(false);
  const [confirmarReactivar, setConfirmarReactivar] = useState(false);

  return (
    <>
      <Card size="sm" className="relative">
        <CardHeader className="flex flex-col gap-2 p-4">
          <Badge
            variant={activo ? "secondary" : "destructive"}
            className={`absolute right-4 top-4 ${
              activo
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : ""
            }`}
          >
            <span
              className={`size-1 rounded-full ${
                activo ? "bg-emerald-600" : "bg-current"
              }`}
            />
            {activo ? "Activo" : "Inactivo"}
          </Badge>
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                {nombre.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <CardTitle>{nombre}</CardTitle>
              <CardDescription>{correo}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant={esAdmin ? "default" : "secondary"}
              className="gap-1.5 p-3 text-xs font-medium [&>svg]:size-4!"
            >
              {esAdmin ? (
                <ShieldCheckIcon className="!size-4" />
              ) : (
                <CashRegisterIcon className="!size-4" />
              )}
              {esAdmin ? "Administrador" : "Operador/Cajera"}
            </Badge>
            <span className="ml-auto text-right text-xs text-muted-foreground">
              Fecha de alta: {fechaAlta}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            size="lg"
            className="min-w-0 flex-1 [&>svg]:size-4!"
            onClick={onEditar}
          >
            <PencilSimpleIcon />
            Editar
          </Button>
          {activo ? (
            <Button
              variant="outline"
              size="lg"
              className="shrink-0 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmarDesactivar(true)}
            >
              <UserMinusIcon className="size-4" />
              Desactivar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="shrink-0 px-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              onClick={() => setConfirmarReactivar(true)}
            >
              <UserCheckIcon className="size-4" />
              Reactivar
            </Button>
          )}
        </CardFooter>
      </Card>
      <ConfirmarAcción
        abierto={confirmarDesactivar}
        onAbiertoChange={setConfirmarDesactivar}
        variante="destructive"
        icono={<UserMinusIcon weight="duotone" />}
        titulo={`¿Desactivar a ${nombre.split(" ")[0]}?`}
        descripción={`El usuario perderá el acceso al sistema. Podrás reactivarlo en cualquier momento.`}
        textoConfirmar="Sí, desactivar"
        textoCancelar="No, mantener activo"
        onConfirmar={() => onCambiarEstatus?.(false)}
      />
      <ConfirmarAcción
        abierto={confirmarReactivar}
        onAbiertoChange={setConfirmarReactivar}
        variante="success"
        icono={<UserCheckIcon weight="duotone" />}
        titulo={`¿Reactivar a ${nombre.split(" ")[0]}?`}
        descripción={`El usuario recuperará el acceso al sistema y conservará los permisos que tenía anteriormente.`}
        textoConfirmar="Sí, reactivar"
        textoCancelar="No, mantener inactivo"
        onConfirmar={() => onCambiarEstatus?.(true)}
      />
    </>
  );
}
