"use client";

import {
  EyeIcon,
  PencilSimpleIcon,
  BankIcon,
  MoneyIcon,
  PaperclipIcon,
  ReceiptIcon,
  CheckIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Ticket } from "@/types/ticket";

interface TicketsTableProps {
  tickets: Ticket[];
  onVerDetalle: (ticket: Ticket) => void;
  onEditar: (ticket: Ticket) => void;
  onEliminar: (ticket: Ticket) => void;
  onCambiarEstado: (ticket: Ticket) => void;
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
    day: "2-digit",
    month: "short",
  });
}

export function TicketsTable({
  tickets,
  onVerDetalle,
  onEditar,
  onEliminar,
  onCambiarEstado,
}: TicketsTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-12 text-center bg-card/50">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          <ReceiptIcon className="size-7" weight="duotone" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No se encontraron tickets
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Intenta ajustar los filtros de búsqueda, fecha o estado, o registra un
          nuevo ticket de gasto operativo.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs w-full max-w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[105px] px-3">Fecha / Folio</TableHead>
            <TableHead className="w-[170px] px-3">Proveedor</TableHead>
            <TableHead className="min-w-0 px-3">Descripción</TableHead>
            <TableHead className="w-[105px] px-3">Importe</TableHead>
            <TableHead className="w-[110px] px-3">Método</TableHead>
            <TableHead className="w-[95px] px-3">Estado</TableHead>
            <TableHead className="w-[90px] px-3">Comprobante</TableHead>
            <TableHead className="w-[100px] px-3 text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tickets.map((t) => {
            const esTransferencia = t.metodoPago === "transferencia";
            const estaPagado = t.estadoPago === "pagado";
            const tieneComprobante = Boolean(t.comprobanteUrl);

            return (
              <TableRow key={t.id} className="group">
                <TableCell className="px-3 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground">
                      {formatearFecha(t.fecha)}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-3 py-2.5">
                  <div className="flex items-center gap-2 max-w-[170px]">
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                        {t.proveedorNombre.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onVerDetalle(t)}
                        className="truncate text-left text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                        title={t.proveedorNombre}
                      >
                        {t.proveedorNombre}
                      </button>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {t.registradoPor || "Caja general"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-3 py-2.5 whitespace-normal">
                  <div className="flex flex-col gap-0.5 min-w-0 max-w-[280px]">
                    <span
                      className="text-xs font-medium text-foreground line-clamp-1"
                      title={t.descripcion}
                    >
                      {t.descripcion}
                    </span>
                    {t.observaciones && (
                      <span
                        className="text-[10px] text-muted-foreground line-clamp-1 italic"
                        title={t.observaciones}
                      >
                        {t.observaciones}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-3 py-2.5">
                  <span className="text-xs font-bold tracking-tight text-foreground whitespace-nowrap">
                    {formatearMoneda(t.importe)}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-2.5">
                  <Badge
                    variant="outline"
                    className="gap-1 py-0.5 px-2 text-[11px] font-medium border-border/80"
                  >
                    {esTransferencia ? (
                      <>
                        <BankIcon
                          className="size-3 text-primary shrink-0"
                          weight="duotone"
                        />
                        <span>Transf.</span>
                      </>
                    ) : (
                      <>
                        <MoneyIcon
                          className="size-3 text-emerald-600 shrink-0"
                          weight="duotone"
                        />
                        <span>Efectivo</span>
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="px-3 py-2.5">
                  <Badge
                    variant={estaPagado ? "secondary" : "destructive"}
                    className={
                      estaPagado
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 gap-1 py-0.5 px-2 text-[11px]"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 gap-1 py-0.5 px-2 text-[11px]"
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
                </TableCell>
                <TableCell className="px-3 py-2.5">
                  {tieneComprobante ? (
                    <button
                      type="button"
                      onClick={() => onVerDetalle(t)}
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium cursor-pointer"
                      title={t.comprobanteNombre || "Ver archivo adjunto"}
                    >
                      <PaperclipIcon
                        className="size-3 shrink-0"
                        weight="bold"
                      />
                      <span className="truncate max-w-[70px]">Ver foto</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/60 italic">
                      Sin archivo
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-3 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                      onClick={() => onVerDetalle(t)}
                      title="Consultar detalles y comprobante"
                      aria-label="Consultar detalles"
                    >
                      <EyeIcon className="size-3.5" />
                    </Button>
                    {!estaPagado && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-7 p-0 text-amber-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => onCambiarEstado(t)}
                        title="Marcar como pagado (validar comprobante de dueño)"
                        aria-label="Marcar como pagado"
                      >
                        <CheckIcon className="size-3.5" weight="bold" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => onEditar(t)}
                      title="Editar ticket"
                      aria-label="Editar ticket"
                    >
                      <PencilSimpleIcon className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onEliminar(t)}
                      title="Eliminar ticket"
                      aria-label="Eliminar ticket"
                    >
                      <TrashIcon className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
