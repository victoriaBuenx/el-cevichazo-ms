"use client";

import { useState } from "react";
import {
  BankIcon,
  MoneyIcon,
  CheckIcon,
  UploadSimpleIcon,
  XCircleIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmarAcción } from "../shared/confirmarAcción";
import type { Ticket } from "@/types/ticket";

interface TicketPagarDialogProps {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  ticket?: Ticket | null;
  onConfirmarPago: (datos: {
    ticketId: string;
    comprobanteTransferenciaUrl?: string;
    comprobanteTransferenciaNombre?: string;
    referencia?: string;
  }) => void;
}

function formatearMoneda(cantidad: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(cantidad);
}

export function TicketPagarDialog({
  abierto,
  onAbiertoChange,
  ticket,
  onConfirmarPago,
}: TicketPagarDialogProps) {
  if (!ticket) return null;

  return (
    <Dialog open={abierto} onOpenChange={onAbiertoChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        {abierto && (
          <TicketPagarDialogContent
            key={ticket.id}
            ticket={ticket}
            onCerrar={() => onAbiertoChange(false)}
            onConfirmarPago={onConfirmarPago}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TicketPagarDialogContent({
  ticket,
  onCerrar,
  onConfirmarPago,
}: {
  ticket: Ticket;
  onCerrar: () => void;
  onConfirmarPago: (datos: {
    ticketId: string;
    comprobanteTransferenciaUrl?: string;
    comprobanteTransferenciaNombre?: string;
    referencia?: string;
  }) => void;
}) {
  const esTransferencia = ticket.metodoPago === "transferencia";

  const [speiUrl, setSpeiUrl] = useState<string | null>(
    ticket.comprobanteTransferenciaUrl ?? null,
  );
  const [speiNombre, setSpeiNombre] = useState<string | null>(
    ticket.comprobanteTransferenciaNombre ?? null,
  );
  const [referencia, setReferencia] = useState("");
  const [error, setError] = useState("");

  const [confirmarAbierto, setConfirmarAbierto] = useState(false);

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSpeiNombre(file.name);
      const preview = URL.createObjectURL(file);
      setSpeiUrl(preview);
      setError("");
    }
  };

  const handleQuitarArchivo = () => {
    setSpeiUrl(null);
    setSpeiNombre(null);
  };
  const handlePreConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setConfirmarAbierto(true);
  };
  const handleConfirmarFinal = () => {
    const finalUrl =
      speiUrl ||
      (esTransferencia
        ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
        : undefined);
    const finalNombre =
      speiNombre ||
      (esTransferencia ? `spei_${ticket.folio.toLowerCase()}.jpg` : undefined);

    onConfirmarPago({
      ticketId: ticket.id,
      comprobanteTransferenciaUrl: finalUrl,
      comprobanteTransferenciaNombre: finalNombre,
      referencia: referencia.trim() || undefined,
    });

    setConfirmarAbierto(false);
    onCerrar();
  };
  return (
    <>
      <div className="bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent px-6 pt-6 pb-5 shrink-0">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30">
            {esTransferencia ? (
              <BankIcon className="size-6" weight="duotone" />
            ) : (
              <MoneyIcon className="size-6" weight="duotone" />
            )}
          </div>

          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="font-semibold text-base text-foreground">
              {esTransferencia
                ? "Validar transferencia SPEI y liquidar ticket"
                : "Confirmar liquidación en efectivo"}
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              {esTransferencia
                ? "Adjunta la ficha de transferencia compartida por el dueño para respaldar el pago al proveedor."
                : "Confirma el pago en efectivo realizado con fondo de caja."}
            </DialogDescription>
          </DialogHeader>
        </div>
      </div>
      <form onSubmit={handlePreConfirmar} className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5 overflow-hidden pr-3">
              <span className="text-sm font-bold text-foreground truncate">
                {ticket.proveedorNombre}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {ticket.descripcion}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Total a Liquidar
              </span>
              <span className="text-lg font-bold text-foreground">
                {formatearMoneda(ticket.importe)}
              </span>
            </div>
          </div>

          {esTransferencia ? (
            <>
              <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-3 text-xs text-sky-900 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300 flex items-start gap-2.5">
                <InfoIcon
                  className="size-4 shrink-0 text-sky-600 mt-0.5"
                  weight="fill"
                />
                <p className="leading-relaxed">
                  El dueño del restaurante realizó la transferencia bancaria.
                  Sube la captura o PDF de la ficha SPEI para que quede
                  vinculada al ticket y el adeudo quede solventado.
                </p>
              </div>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Comprobante de transferencia SPEI *
                  </FieldLabel>
                </div>
                {speiUrl ? (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={speiUrl}
                        alt="Comprobante de transferencia"
                        className="size-12 rounded-md object-cover border border-emerald-300 dark:border-emerald-800"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-xs font-semibold text-foreground">
                          {speiNombre || "comprobante_spei.jpg"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuitarArchivo}
                      className="inline-flex items-center gap-1 text-xs text-destructive hover:underline cursor-pointer"
                    >
                      <XCircleIcon className="size-4" weight="fill" />
                      <span>Quitar</span>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/80 p-5 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-colors cursor-pointer text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
                      <UploadSimpleIcon className="size-5" weight="bold" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      Subir comprobante de transferencia SPEI
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      Captura de pantalla, foto o PDF del banco (BBVA, Banorte,
                      etc.)
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleArchivoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </Field>
            </>
          ) : (
            <div className="rounded-lg border border-border/80 bg-muted/10 p-4 text-xs leading-relaxed text-muted-foreground">
              Al confirmar, el estado del ticket cambiará a{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                Pagado
              </strong>{" "}
              y se registrará como liquidado en efectivo con fondo de caja
              chica.
            </div>
          )}
          {error && (
            <p role="alert" className="text-xs font-semibold text-destructive">
              {error}
            </p>
          )}
        </div>
        <Separator />
        <DialogFooter className="px-6 py-4 bg-muted/30 shrink-0 flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onCerrar}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="default"
            className="gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <CheckIcon className="size-4" weight="bold" />
            {esTransferencia
              ? "Confirmar pago y adjuntar SPEI"
              : "Confirmar pago en efectivo"}
          </Button>
        </DialogFooter>
      </form>
      <ConfirmarAcción
        abierto={confirmarAbierto}
        onAbiertoChange={setConfirmarAbierto}
        variante="success"
        icono={<CheckIcon weight="duotone" />}
        titulo={`¿Marcar como pagado el ticket ${ticket.folio}?`}
        descripción={
          esTransferencia
            ? `Se confirmará la recepción de la transferencia realizada por el dueño por un importe de ${formatearMoneda(ticket.importe)}${speiNombre ? ` y se vinculará la ficha ${speiNombre}` : ""}.`
            : `Se registrará como liquidado el importe de ${formatearMoneda(ticket.importe)} a ${ticket.proveedorNombre} en efectivo con fondo de caja chica.`
        }
        textoConfirmar="Sí, confirmar pago"
        textoCancelar="Cancelar"
        onConfirmar={handleConfirmarFinal}
      />
    </>
  );
}
