"use client";

import { useState } from "react";
import {
  StorefrontIcon,
  PencilSimpleIcon,
  PhoneIcon,
  ChatCenteredTextIcon,
  CurrencyDollarIcon,
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
import type { Proveedor } from "@/types/proveedor";

interface ProveedoresFormProps {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  proveedor?: Proveedor | null;
  onGuardar: (datos: {
    id?: string;
    name: string;
    phone: string;
    notes?: string;
    pendingBalance?: number;
  }) => void;
}

export function ProveedoresForm({
  abierto,
  onAbiertoChange,
  proveedor,
  onGuardar,
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
            onGuardar={onGuardar}
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
  onGuardar,
}: {
  esEdicion: boolean;
  proveedor?: Proveedor | null;
  onCerrar: () => void;
  onGuardar: (datos: {
    id?: string;
    name: string;
    phone: string;
    notes?: string;
    pendingBalance?: number;
  }) => void;
}) {
  const [nombre, setNombre] = useState(proveedor?.name ?? "");
  const [telefono, setTelefono] = useState(proveedor?.phone ?? "");
  const [adeudo, setAdeudo] = useState(
    proveedor?.pendingBalance !== undefined
      ? String(proveedor.pendingBalance)
      : "0",
  );
  const [notas, setNotas] = useState(proveedor?.notes ?? "");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleTelefonoChange = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, "").slice(0, 10);
    setTelefono(soloDigitos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre del proveedor es obligatorio.");
      return;
    }

    if (telefono.length !== 10) {
      setError("El teléfono debe contener exactamente 10 dígitos numéricos.");
      return;
    }

    const adeudoNum = parseFloat(adeudo);
    if (isNaN(adeudoNum) || adeudoNum < 0) {
      setError(
        "El saldo de adeudo debe ser un monto válido mayor o igual a 0.",
      );
      return;
    }

    setGuardando(true);

    try {
      onGuardar({
        id: proveedor?.id,
        name: nombre.trim(),
        phone: telefono.trim(),
        notes: notas.trim() || undefined,
        pendingBalance: adeudoNum,
      });
      onCerrar();
    } catch {
      setError("Ocurrió un error al procesar la información del proveedor.");
    } finally {
      setGuardando(false);
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    value={telefono}
                    onChange={(e) => handleTelefonoChange(e.target.value)}
                    placeholder="6671234567"
                    className="h-10 pl-9 text-sm"
                    maxLength={10}
                    required
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="adeudo" className="text-sm font-medium">
                  Adeudo inicial ($ MXN)
                </FieldLabel>
                <div className="relative">
                  <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                    weight="duotone"
                  />
                  <Input
                    id="adeudo"
                    type="number"
                    step="0.01"
                    min="0"
                    value={adeudo}
                    onChange={(e) => setAdeudo(e.target.value)}
                    placeholder="0.00"
                    className="h-10 pl-9 text-sm"
                  />
                </div>
              </Field>
            </div>

            <Separator />
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
            <p
              role="alert"
              className="mt-4 text-sm font-medium text-destructive"
            >
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
            disabled={guardando}
            className="gap-1.5"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            className="gap-1.5 font-semibold"
            disabled={guardando}
          >
            {guardando
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
