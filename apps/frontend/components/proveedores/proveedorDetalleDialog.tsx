"use client";

import {
  StorefrontIcon,
  PhoneIcon,
  ReceiptIcon,
  TrendUpIcon,
  CalendarBlankIcon,
  ChatCenteredTextIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Proveedor } from "@/types/proveedor";

interface ProveedorDetalleDialogProps {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  proveedor?: Proveedor | null;
  onEditar?: (proveedor: Proveedor) => void;
}

function formatearMoneda(cantidad?: number): string {
  if (cantidad === undefined || cantidad === null) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(cantidad);
}

function formatearTelefono(tel: string): string {
  const limpio = tel.replace(/\D/g, "");
  if (limpio.length === 10) {
    return `(${limpio.slice(0, 3)}) ${limpio.slice(3, 6)}-${limpio.slice(6)}`;
  }
  return tel;
}

function formatearFecha(fechaStr?: string | null): string {
  if (!fechaStr) return "Sin registro";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return fechaStr;
  return fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProveedorDetalleDialog({
  abierto,
  onAbiertoChange,
  proveedor,
  onEditar,
}: ProveedorDetalleDialogProps) {
  if (!proveedor) return null;

  const tieneAdeudo = (proveedor.pendingBalance ?? 0) > 0;

  return (
    <Dialog open={abierto} onOpenChange={onAbiertoChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Cabecera con degradado */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5">
          <div className="flex items-start gap-4">
            <Avatar className="size-12 shrink-0">
              <AvatarFallback className="bg-primary/20 text-base font-bold text-primary">
                {proveedor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 overflow-hidden">
              <DialogHeader className="gap-0.5 text-left">
                <DialogTitle className="font-bold text-base leading-snug">
                  {proveedor.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={proveedor.isActive ? "secondary" : "destructive"}
                    className={
                      proveedor.isActive
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : ""
                    }
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        proveedor.isActive ? "bg-emerald-600" : "bg-current"
                      }`}
                    />
                    {proveedor.isActive ? "Activo" : "Inactivo"}
                  </Badge>

                  <a
                    href={`tel:${proveedor.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <PhoneIcon className="size-3" weight="bold" />
                    {formatearTelefono(proveedor.phone)}
                  </a>
                </div>
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Contenido financiero e informativo */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ReceiptIcon className="size-4 text-amber-500" weight="duotone" />
                <span>Adeudo Actual</span>
              </div>
              <p
                className={`mt-1.5 text-lg font-bold ${
                  tieneAdeudo
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-foreground"
                }`}
              >
                {formatearMoneda(proveedor.pendingBalance)}
              </p>
              <span className="text-[10px] text-muted-foreground">
                {tieneAdeudo ? "Saldo pendiente por pagar" : "Al corriente"}
              </span>
            </div>

            <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendUpIcon className="size-4 text-sky-500" weight="duotone" />
                <span>Gasto del Mes</span>
              </div>
              <p className="mt-1.5 text-lg font-bold text-foreground">
                {formatearMoneda(proveedor.monthExpense)}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Compras de octubre
              </span>
            </div>
          </div>

          <Separator />

          {/* Último movimiento e información de alta */}
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CalendarBlankIcon className="size-4 text-muted-foreground" />
                Fecha de alta:
              </span>
              <span className="font-medium text-foreground">
                {formatearFecha(proveedor.createdAt)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground shrink-0 flex items-center gap-1.5">
                <StorefrontIcon className="size-4 text-muted-foreground" />
                Último movimiento:
              </span>
              <span className="font-medium text-foreground text-right truncate">
                {proveedor.lastMovementConcept ?? "Sin movimientos recientes"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Notas u observaciones */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              <ChatCenteredTextIcon className="size-4 text-primary" weight="duotone" />
              <span>Condiciones y Notas</span>
            </div>
            {proveedor.notes ? (
              <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs leading-relaxed text-foreground">
                {proveedor.notes}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/70 italic">
                No hay notas ni condiciones especiales registradas para este proveedor.
              </p>
            )}
          </div>
        </div>

        <Separator />

        <DialogFooter className="px-6 py-4 bg-muted/30 flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => onAbiertoChange(false)}
          >
            Cerrar
          </Button>

          <Button
            type="button"
            size="default"
            className="gap-1.5 font-semibold"
            onClick={() => {
              onAbiertoChange(false);
              onEditar?.(proveedor);
            }}
          >
            <PencilSimpleIcon className="size-4" />
            Editar Proveedor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
