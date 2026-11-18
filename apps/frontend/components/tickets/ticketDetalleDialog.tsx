"use client";

import {
  ReceiptIcon,
  BankIcon,
  MoneyIcon,
  CalendarBlankIcon,
  UserIcon,
  PencilSimpleIcon,
  CheckIcon,
  ArrowSquareOutIcon,
  HourglassHighIcon,
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
import type { Ticket } from "@/types/ticket";

interface TicketDetalleDialogProps {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  ticket?: Ticket | null;
  onEditar?: (ticket: Ticket) => void;
  onMarcarComoPagado?: (ticket: Ticket) => void;
}

function formatearMoneda(cantidad: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(cantidad);
}

function formatearFecha(fechaStr: string): string {
  if (!fechaStr) return "-";
  const fecha = new Date(fechaStr + "T00:00:00");
  if (isNaN(fecha.getTime())) return fechaStr;
  return fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TicketDetalleDialog({
  abierto,
  onAbiertoChange,
  ticket,
  onEditar,
  onMarcarComoPagado,
}: TicketDetalleDialogProps) {
  if (!ticket) return null;

  const esTransferencia = ticket.metodoPago === "transferencia";
  const estaPagado = ticket.estadoPago === "pagado";

  return (
    <Dialog open={abierto} onOpenChange={onAbiertoChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-11 shrink-0">
                <AvatarFallback className="bg-primary/20 text-base font-bold text-primary">
                  {ticket.proveedorNombre.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1 overflow-hidden">
                <DialogHeader className="gap-0.5 text-left">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={estaPagado ? "secondary" : "destructive"}
                      className={
                        estaPagado
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 gap-1"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 gap-1"
                      }
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          estaPagado
                            ? "bg-emerald-600"
                            : "bg-amber-600 animate-pulse"
                        }`}
                      />
                      {estaPagado ? "Pagado" : "Pendiente"}
                    </Badge>
                  </div>
                  <DialogTitle className="font-bold text-base leading-snug text-foreground mt-1">
                    {ticket.proveedorNombre}
                  </DialogTitle>
                </DialogHeader>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                Importe Total
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatearMoneda(ticket.importe)}
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 flex-1 overflow-y-auto flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-lg border border-border/70 bg-muted/20 p-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CalendarBlankIcon className="size-3.5" />
                Fecha
              </span>
              <span className="text-xs font-semibold text-foreground">
                {formatearFecha(ticket.fecha)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                {esTransferencia ? (
                  <BankIcon className="size-3.5 text-primary" />
                ) : (
                  <MoneyIcon className="size-3.5 text-emerald-600" />
                )}
                Método
              </span>
              <span className="text-xs font-semibold text-foreground capitalize">
                {ticket.metodoPago}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 sm:col-span-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <UserIcon className="size-3.5" />
                Registrado por
              </span>
              <span className="text-xs font-semibold text-foreground truncate">
                {ticket.registradoPor || "Caja general"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Concepto del Gasto
            </span>
            <p className="text-sm text-foreground bg-muted/10 p-3 rounded-lg border border-border/50">
              {ticket.descripcion}
            </p>
          </div>
          {ticket.observaciones && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observaciones y Notas
              </span>
              <p className="text-xs text-muted-foreground bg-muted/10 p-3 rounded-lg border border-border/50 leading-relaxed italic">
                {ticket.observaciones}
              </p>
            </div>
          )}
          {esTransferencia && !estaPagado && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300 flex items-start gap-2.5">
              <HourglassHighIcon
                className="size-4 shrink-0 text-amber-600 mt-0.5"
                weight="fill"
              />
              <div className="flex flex-col gap-2.5 w-full">
                <p className="leading-relaxed">
                  <strong>Transferencia pendiente:</strong> El dueño del
                  restaurante realiza el pago bancario. Una vez realizada la
                  transferencia y compartido el comprobante con caja, marca el
                  ticket como pagado.
                </p>
                {onMarcarComoPagado && (
                  <Button
                    type="button"
                    size="sm"
                    className="w-fit bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-semibold text-xs"
                    onClick={() => {
                      onAbiertoChange(false);
                      onMarcarComoPagado(ticket);
                    }}
                  >
                    <CheckIcon className="size-3.5" weight="bold" />
                    Marcar como pagado
                  </Button>
                )}
              </div>
            </div>
          )}

          {!esTransferencia && !estaPagado && onMarcarComoPagado && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HourglassHighIcon
                  className="size-4 text-amber-600 shrink-0"
                  weight="fill"
                />
                <span>
                  Pago en efectivo pendiente de liquidación con fondo de caja.
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-semibold text-xs shrink-0"
                onClick={() => {
                  onAbiertoChange(false);
                  onMarcarComoPagado(ticket);
                }}
              >
                <CheckIcon className="size-3.5" weight="bold" />
                Confirmar pago
              </Button>
            </div>
          )}
          <Separator />
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ReceiptIcon className="size-4 text-primary" weight="duotone" />
                Comprobante / fotografía del ticket
              </span>
              {ticket.comprobanteUrl && (
                <a
                  href={ticket.comprobanteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                  <ArrowSquareOutIcon className="size-3.5" />
                  Ver en tamaño completo
                </a>
              )}
            </div>
            {ticket.comprobanteUrl ? (
              <div className="overflow-hidden rounded-lg border border-border/80 bg-muted/30">
                <img
                  src={ticket.comprobanteUrl}
                  alt={`Comprobante de ${ticket.proveedorNombre}`}
                  className="w-full max-h-64 object-contain bg-black/5 dark:bg-black/20"
                />
                <div className="p-2.5 bg-background border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate max-w-[280px]">
                    {ticket.comprobanteNombre || "ticket_comprobante.jpg"}
                  </span>
                  <span className="text-[11px]">Adjunto por caja</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 p-6 text-center bg-muted/10">
                <ReceiptIcon className="size-8 text-muted-foreground/50 mb-1" />
                <span className="text-xs text-muted-foreground">
                  No se adjuntó fotografía para este ticket
                </span>
              </div>
            )}
          </div>
          {esTransferencia && (
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BankIcon
                    className="size-4 text-emerald-600"
                    weight="duotone"
                  />
                  Comprobante de Transferencia SPEI
                </span>

                {ticket.comprobanteTransferenciaUrl && (
                  <a
                    href={ticket.comprobanteTransferenciaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    <ArrowSquareOutIcon className="size-3.5" />
                    Ver comprobante bancario
                  </a>
                )}
              </div>

              {ticket.comprobanteTransferenciaUrl ? (
                <div className="overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50/20 dark:border-emerald-950/40">
                  <img
                    src={ticket.comprobanteTransferenciaUrl}
                    alt="Comprobante de Transferencia SPEI"
                    className="w-full max-h-56 object-contain bg-black/5 dark:bg-black/20"
                  />
                </div>
              ) : estaPagado ? (
                <div className="flex items-center justify-between rounded-lg border border-dashed border-border/80 p-3 bg-muted/10 text-xs text-muted-foreground">
                  <span>
                    Transferencia liquidada sin imagen de ficha SPEI adjunta.
                  </span>
                  {onMarcarComoPagado && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onAbiertoChange(false);
                        onMarcarComoPagado(ticket);
                      }}
                      className="text-xs font-semibold text-emerald-700 border-emerald-300"
                    >
                      Adjuntar ficha
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-border/70 bg-muted/10 p-3 text-xs text-muted-foreground">
                  Aún no se ha registrado la ficha de transferencia porque el
                  ticket está pendiente de pago.
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className="px-6 py-4 bg-muted/30 shrink-0 flex sm:justify-between">
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
              onEditar?.(ticket);
            }}
          >
            <PencilSimpleIcon className="size-4" />
            Editar Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
