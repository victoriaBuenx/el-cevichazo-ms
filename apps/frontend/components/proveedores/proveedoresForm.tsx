"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  StorefrontIcon,
  PencilSimpleIcon,
  PhoneIcon,
  ChatCenteredTextIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  crearProveedorAction,
  actualizarProveedorAction,
} from "@/actions/proveedores/actions";
import type { Proveedor } from "@/types/proveedor";

interface ProveedoresFormProps {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  proveedor?: Proveedor | null;
}

export function ProveedoresForm({
  abierto,
  onAbiertoChange,
  proveedor,
}: ProveedoresFormProps) {
  const esEdicion = Boolean(proveedor);

  return (
    <Dialog open={abierto} onOpenChange={onAbiertoChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {abierto && (
          <ProveedoresFormContent
            key={proveedor?.id ?? "nuevo-proveedor"}
            esEdicion={esEdicion}
            proveedor={proveedor}
            onCerrar={() => onAbiertoChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProveedoresFormContent({
  esEdicion,
  proveedor,
  onCerrar,
}: {
  esEdicion: boolean;
  proveedor?: Proveedor | null;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(proveedor?.name ?? "");
  const [telefono, setTelefono] = useState(proveedor?.phone ?? "");
  const [notas, setNotas] = useState(proveedor?.notes ?? "");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleTelefonoChange = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, "").slice(0, 10);
    setTelefono(soloDigitos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nombreLimpio = nombre.trim();
    const telLimpio = telefono.trim();

    if (!nombreLimpio) {
      setError("El nombre del proveedor es obligatorio.");
      return;
    }

    if (telLimpio.length !== 10) {
      setError("El teléfono debe contener exactamente 10 dígitos numéricos.");
      return;
    }

    setCargando(true);

    try {
      const resultado =
        esEdicion && proveedor
          ? await actualizarProveedorAction({
              id: proveedor.id,
              name: nombreLimpio,
              phone: telLimpio,
              notes: notas.trim() || undefined,
            })
          : await crearProveedorAction({
              name: nombreLimpio,
              phone: telLimpio,
              notes: notas.trim() || undefined,
            });

      if (!resultado.success) {
        setError(resultado.message);
        return;
      }

      onCerrar();
      router.refresh();
    } catch {
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
            {esEdicion ? (
              <PencilSimpleIcon className="size-5" weight="duotone" />
            ) : (
              <StorefrontIcon className="size-5" weight="duotone" />
            )}
          </div>

          <DialogHeader className="gap-1.5">
            <DialogTitle className="font-semibold text-base">
              {esEdicion ? "Editar proveedor" : "Registrar nuevo proveedor"}
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              {esEdicion
                ? "Actualiza la información de contacto y condiciones comerciales del proveedor."
                : "Agrega un nuevo proveedor al catálogo para vincular compras e inventario."}
            </DialogDescription>
          </DialogHeader>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5">
          <FieldGroup className="gap-4">
            {/* Nombre */}
            <Field>
              <FieldLabel htmlFor="nombre" className="text-sm font-medium">
                Nombre de la empresa o proveedor *
              </FieldLabel>

              <div className="relative">
                <StorefrontIcon
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                  weight="duotone"
                />
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Mariscos del Pacífico"
                  className="h-10 pl-9 text-sm"
                  maxLength={100}
                  required
                />
              </div>
            </Field>

            {/* Teléfono */}
            <Field>
              <FieldLabel htmlFor="telefono" className="text-sm font-medium">
                Teléfono (10 dígitos) *
              </FieldLabel>

              <div className="relative">
                <PhoneIcon
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                  weight="duotone"
                />
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => handleTelefonoChange(e.target.value)}
                  placeholder="6671234567"
                  className="h-10 pl-9 text-sm"
                  maxLength={10}
                  required
                />
              </div>
            </Field>

            <Separator />

            {/* Notas / Observaciones */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="notas" className="text-sm font-medium">
                  Notas u observaciones comerciales
                </FieldLabel>
                <span className="text-[11px] text-muted-foreground">
                  {notas.length}/500
                </span>
              </div>

              <div className="relative">
                <ChatCenteredTextIcon
                  className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"
                  weight="duotone"
                />
                <textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Días y horarios de entrega, productos clave, acuerdos de crédito o contacto del repartidor..."
                  className="flex min-h-[90px] w-full rounded-md border border-input bg-input/20 pl-9 pr-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={500}
                />
              </div>
            </Field>
          </FieldGroup>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-destructive">
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
            onClick={onCerrar}
            disabled={cargando}
            className="gap-1.5"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            size="lg"
            className="gap-1.5 font-semibold"
            disabled={cargando}
          >
            {cargando
              ? "Guardando..."
              : esEdicion
                ? "Guardar cambios"
                : "Registrar proveedor"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
