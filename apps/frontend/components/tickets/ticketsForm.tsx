"use client";

import { useState } from "react";
import {
  ReceiptIcon,
  PencilSimpleIcon,
  CalendarBlankIcon,
  StorefrontIcon,
  CurrencyDollarIcon,
  ChatCenteredTextIcon,
  UploadSimpleIcon,
  XCircleIcon,
  BankIcon,
  MoneyIcon,
  InfoIcon,
  PaperclipIcon,
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
import { PROVEEDORES_DISPONIBLES } from "./mockTickets";
import type {
  Ticket,
  MetodoPago,
  EstadoPago,
  CrearTicketInput,
} from "@/types/ticket";

interface TicketsFormProps {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  ticket?: Ticket | null;
  onGuardar: (datos: CrearTicketInput & { id?: string }) => void;
}

export function TicketsForm({
  abierto,
  onAbiertoChange,
  ticket,
  onGuardar,
}: TicketsFormProps) {
  const esEdicion = Boolean(ticket);

  return (
    <Dialog open={abierto} onOpenChange={onAbiertoChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        {abierto && (
          <TicketsFormContent
            key={ticket?.id ?? "nuevo-ticket"}
            esEdicion={esEdicion}
            ticket={ticket}
            onCerrar={() => onAbiertoChange(false)}
            onGuardar={onGuardar}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TicketsFormContent({
  esEdicion,
  ticket,
  onCerrar,
  onGuardar,
}: {
  esEdicion: boolean;
  ticket?: Ticket | null;
  onCerrar: () => void;
  onGuardar: (datos: CrearTicketInput & { id?: string }) => void;
}) {
  const hoyStr = new Date().toISOString().split("T")[0];

  const [proveedorId, setProveedorId] = useState(
    ticket?.proveedorId ?? PROVEEDORES_DISPONIBLES[0].id,
  );
  const [fecha, setFecha] = useState(ticket?.fecha ?? hoyStr);
  const [descripcion, setDescripcion] = useState(ticket?.descripcion ?? "");
  const [importe, setImporte] = useState(
    ticket?.importe !== undefined ? String(ticket.importe) : "",
  );
  const [metodoPago, setMetodoPago] = useState<MetodoPago>(
    ticket?.metodoPago ?? "efectivo",
  );
  const [estadoPago, setEstadoPago] = useState<EstadoPago>(
    ticket?.estadoPago ??
      (ticket?.metodoPago === "transferencia" ? "pendiente" : "pagado"),
  );
  const [observaciones, setObservaciones] = useState(
    ticket?.observaciones ?? "",
  );
  const [comprobanteUrl, setComprobanteUrl] = useState<string | null>(
    ticket?.comprobanteUrl ?? null,
  );
  const [comprobanteNombre, setComprobanteNombre] = useState<string | null>(
    ticket?.comprobanteNombre ?? null,
  );

  const [speiUrl, setSpeiUrl] = useState<string | null>(
    ticket?.comprobanteTransferenciaUrl ?? null,
  );
  const [speiNombre, setSpeiNombre] = useState<string | null>(
    ticket?.comprobanteTransferenciaNombre ?? null,
  );
  const [mostrarSubidaSpei, setMostrarSubidaSpei] = useState(
    Boolean(ticket?.comprobanteTransferenciaUrl),
  );

  const [error, setError] = useState("");

  const handleMetodoChange = (nuevoMetodo: MetodoPago) => {
    setMetodoPago(nuevoMetodo);
    if (!ticket) {
      if (nuevoMetodo === "transferencia") {
        setEstadoPago("pendiente");
      } else {
        setEstadoPago("pagado");
      }
    }
  };

  const handleTicketArchivoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobanteNombre(file.name);
      const preview = URL.createObjectURL(file);
      setComprobanteUrl(preview);
    }
  };

  const handleQuitarTicketArchivo = () => {
    setComprobanteUrl(null);
    setComprobanteNombre(null);
  };

  const handleSpeiArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSpeiNombre(file.name);
      const preview = URL.createObjectURL(file);
      setSpeiUrl(preview);
    }
  };

  const handleQuitarSpeiArchivo = () => {
    setSpeiUrl(null);
    setSpeiNombre(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!descripcion.trim()) {
      setError("La descripción del gasto es obligatoria.");
      return;
    }

    const importeNum = parseFloat(importe);
    if (isNaN(importeNum) || importeNum <= 0) {
      setError("El importe debe ser un monto numérico mayor a $0.00.");
      return;
    }

    const provObj = PROVEEDORES_DISPONIBLES.find((p) => p.id === proveedorId);
    const proveedorNombre = provObj
      ? provObj.nombre
      : "Proveedor no especificado";

    onGuardar({
      id: ticket?.id,
      proveedorId,
      proveedorNombre,
      fecha,
      descripcion: descripcion.trim(),
      importe: importeNum,
      metodoPago,
      estadoPago,
      observaciones: observaciones.trim() || undefined,
      comprobanteUrl: comprobanteUrl || undefined,
      comprobanteNombre: comprobanteNombre || undefined,
      comprobanteTransferenciaUrl:
        metodoPago === "transferencia" ? speiUrl || undefined : undefined,
      comprobanteTransferenciaNombre:
        metodoPago === "transferencia" ? speiNombre || undefined : undefined,
    });

    onCerrar();
  };

  const esTransferencia = metodoPago === "transferencia";
  const debeMostrarCajaSpei =
    esTransferencia &&
    (estadoPago === "pagado" || mostrarSubidaSpei || Boolean(speiUrl));

  return (
    <>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5 shrink-0">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
            {esEdicion ? (
              <PencilSimpleIcon className="size-5" weight="duotone" />
            ) : (
              <ReceiptIcon className="size-5" weight="duotone" />
            )}
          </div>

          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="font-semibold text-base">
              {esEdicion ? "Editar ticket de gasto" : "Registrar nuevo ticket"}
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              {esEdicion
                ? "Modifica los datos del comprobante, método de pago y archivos adjuntos."
                : "Captura el gasto operativo, selecciona el proveedor y adjunta los comprobantes correspondientes."}
            </DialogDescription>
          </DialogHeader>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="px-6 py-5">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel
                htmlFor="proveedor"
                className="text-xs font-semibold text-foreground"
              >
                Proveedor *
              </FieldLabel>

              <div className="relative">
                <StorefrontIcon
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                  weight="duotone"
                />
                <select
                  id="proveedor"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-input/20 pl-9 pr-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 cursor-pointer"
                  required
                >
                  {PROVEEDORES_DISPONIBLES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="fecha"
                  className="text-xs font-semibold text-foreground"
                >
                  Fecha del gasto *
                </FieldLabel>
                <div className="relative">
                  <CalendarBlankIcon
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                    weight="duotone"
                  />
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="h-10 pl-9 text-sm"
                    required
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="importe"
                  className="text-xs font-semibold text-foreground"
                >
                  Importe total ($ MXN) *
                </FieldLabel>
                <div className="relative">
                  <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                    weight="duotone"
                  />
                  <Input
                    id="importe"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={importe}
                    onChange={(e) => setImporte(e.target.value)}
                    placeholder="0.00"
                    className="h-10 pl-9 text-sm font-semibold"
                    required
                  />
                </div>
              </Field>
            </div>
            <Field>
              <FieldLabel
                htmlFor="descripcion"
                className="text-xs font-semibold text-foreground"
              >
                Descripción del gasto *
              </FieldLabel>
              <Input
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej. Camarón azul 25kg y pulpo cocido para barra de ceviches"
                className="h-10 text-sm"
                maxLength={200}
                required
              />
            </Field>

            <Separator />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Método de pago *
                </FieldLabel>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => handleMetodoChange("efectivo")}
                    className={`flex items-center justify-center gap-2 h-10 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                      metodoPago === "efectivo"
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                        : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <MoneyIcon className="size-4" weight="duotone" />
                    <span>Efectivo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMetodoChange("transferencia")}
                    className={`flex items-center justify-center gap-2 h-10 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                      metodoPago === "transferencia"
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                        : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <BankIcon className="size-4" weight="duotone" />
                    <span>Transferencia</span>
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Estado de pago *
                </FieldLabel>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEstadoPago("pagado")}
                    className={`flex items-center justify-center gap-1.5 h-10 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                      estadoPago === "pagado"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold ring-1 ring-emerald-500/30"
                        : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="size-2 rounded-full bg-emerald-600" />
                    <span>Pagado</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstadoPago("pendiente")}
                    className={`flex items-center justify-center gap-1.5 h-10 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                      estadoPago === "pendiente"
                        ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold ring-1 ring-amber-500/30"
                        : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="size-2 rounded-full bg-amber-600 animate-pulse" />
                    <span>Pendiente</span>
                  </button>
                </div>
              </Field>
            </div>
            {esTransferencia && (
              <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-3 text-xs text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300 flex items-start gap-2.5">
                <InfoIcon
                  className="size-4 shrink-0 text-sky-600 mt-0.5"
                  weight="fill"
                />
                <p className="leading-relaxed">
                  <strong>Flujo operativo:</strong> Los pagos por transferencia
                  los realiza el dueño del restaurante. Caja captura el ticket
                  del proveedor y, una vez recibida la ficha de pago SPEI, se
                  valida y vincula al comprobante.
                </p>
              </div>
            )}
            <Separator />
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ReceiptIcon
                    className="size-4 text-primary"
                    weight="duotone"
                  />
                  Ticket o nota física del proveedor
                </FieldLabel>
              </div>
              {comprobanteUrl ? (
                <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={comprobanteUrl}
                      alt="Vista previa del ticket"
                      className="size-12 rounded-md object-cover border border-border"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-xs font-medium text-foreground">
                        {comprobanteNombre || "ticket_adjunto.jpg"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuitarTicketArchivo}
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline cursor-pointer"
                  >
                    <XCircleIcon className="size-4" weight="fill" />
                    <span>Quitar</span>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/80 p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer text-center">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary mb-1.5">
                    <UploadSimpleIcon className="size-4" weight="bold" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Subir foto o escaneo del ticket del proveedor
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Foto de remisión o factura física (JPG, PNG o PDF)
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleTicketArchivoChange}
                    className="hidden"
                  />
                </label>
              )}
            </Field>
            {esTransferencia && (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <BankIcon
                      className="size-4 text-emerald-600"
                      weight="duotone"
                    />
                    Comprobante de transferencia SPEI
                  </FieldLabel>
                </div>
                {debeMostrarCajaSpei ? (
                  speiUrl ? (
                    <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={speiUrl}
                          alt="Comprobante de transferencia SPEI"
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
                        onClick={handleQuitarSpeiArchivo}
                        className="inline-flex items-center gap-1 text-xs text-destructive hover:underline cursor-pointer"
                      >
                        <XCircleIcon className="size-4" weight="fill" />
                        <span>Quitar</span>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-300/80 bg-emerald-50/15 p-4 hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors cursor-pointer text-center">
                      <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-1.5">
                        <UploadSimpleIcon className="size-4" weight="bold" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        Subir captura o PDF de la transferencia SPEI
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        Comprobante enviado por el dueño del restaurante
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleSpeiArchivoChange}
                        className="hidden"
                      />
                    </label>
                  )
                ) : (
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-foreground">
                        Transferencia bancaria pendiente
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Podrás adjuntar la ficha cuando el dueño realice el
                        pago.
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setMostrarSubidaSpei(true)}
                      className="text-xs font-semibold shrink-0 gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <PaperclipIcon className="size-3.5" />
                      Adjuntar
                    </Button>
                  </div>
                )}
              </Field>
            )}
            <Separator />
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="observaciones"
                  className="text-xs font-semibold text-foreground"
                >
                  Observaciones adicionales
                </FieldLabel>
                <span className="text-[11px] text-muted-foreground">
                  {observaciones.length}/500
                </span>
              </div>
              <div className="relative">
                <ChatCenteredTextIcon
                  className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"
                  weight="duotone"
                />
                <textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles de entrega, turno de caja, notas de crédito o acuerdos..."
                  className="flex min-h-[75px] w-full rounded-md border border-input bg-input/20 pl-9 pr-3 py-2 text-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  maxLength={500}
                />
              </div>
            </Field>
          </FieldGroup>
          {error && (
            <p
              role="alert"
              className="mt-4 text-xs font-semibold text-destructive"
            >
              {error}
            </p>
          )}
        </div>
        <Separator />
        <DialogFooter className="px-6 py-4 bg-muted/30 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onCerrar}
            className="gap-1.5"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="default"
            className="gap-1.5 font-semibold"
          >
            {esEdicion ? "Guardar cambios" : "Registrar ticket"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
