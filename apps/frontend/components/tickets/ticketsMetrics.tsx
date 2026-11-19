"use client";

import {
  CurrencyDollarIcon,
  ReceiptIcon,
  HourglassHighIcon,
  CheckCircleIcon,
  BankIcon,
  CalendarBlankIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";

interface TicketsMetricsProps {
  tickets: Ticket[];
}

function formatearMoneda(cantidad: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(cantidad);
}

export function TicketsMetrics({ tickets }: TicketsMetricsProps) {
  const totalTickets = tickets.length;
  const totalGasto = tickets.reduce((acc, t) => acc + (t.importe ?? 0), 0);

  const ticketsPagados = tickets.filter((t) => t.estadoPago === "pagado");
  const ticketsPendientes = tickets.filter((t) => t.estadoPago === "pendiente");

  const importePagado = ticketsPagados.reduce(
    (acc, t) => acc + (t.importe ?? 0),
    0,
  );
  const importePendiente = ticketsPendientes.reduce(
    (acc, t) => acc + (t.importe ?? 0),
    0,
  );

  // Gasto del mes actual (independiente del filtro activo)
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();
  const hoyStr = hoy.toISOString().split("T")[0];

  const gastoMes = tickets
    .filter((t) => {
      const d = new Date(t.fecha + "T12:00:00");
      return d.getMonth() === mesActual && d.getFullYear() === añoActual;
    })
    .reduce((acc, t) => acc + (t.importe ?? 0), 0);

  const gastoHoy = tickets
    .filter((t) => t.fecha === hoyStr)
    .reduce((acc, t) => acc + (t.importe ?? 0), 0);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 w-full max-w-full">
      {/* Gasto del Mes */}
      <Card size="sm" className="relative overflow-hidden border-border/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Gasto del Mes
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
              <CalendarBlankIcon className="size-5" weight="duotone" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {formatearMoneda(gastoMes)}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowDownIcon className="size-3.5 text-emerald-600" weight="fill" />
            <span>{formatearMoneda(gastoHoy)} registrado hoy</span>
          </div>
        </CardContent>
      </Card>

      {/* Total de Gastos */}
      <Card size="sm" className="relative overflow-hidden border-border/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total de Gastos
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <CurrencyDollarIcon className="size-5" weight="duotone" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {formatearMoneda(totalGasto)}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircleIcon
              className="size-3.5 text-emerald-600"
              weight="fill"
            />
            <span>{formatearMoneda(importePagado)} ya liquidado</span>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Registrados */}
      <Card size="sm" className="relative overflow-hidden border-border/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tickets Registrados
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20">
              <ReceiptIcon className="size-5" weight="duotone" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {totalTickets}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              comprobantes
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            <span>
              {ticketsPagados.length} pagados · {ticketsPendientes.length}{" "}
              pendientes
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pendientes de Pago */}
      <Card size="sm" className="relative overflow-hidden border-border/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pendientes de Pago
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
              <HourglassHighIcon className="size-5" weight="duotone" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {formatearMoneda(importePendiente)}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              ({ticketsPendientes.length} ticket
              {ticketsPendientes.length !== 1 ? "s" : ""})
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <BankIcon className="size-3.5 text-amber-600" weight="duotone" />
            <span className="truncate">
              {ticketsPendientes.length > 0
                ? "En espera de transferencia bancaria"
                : "Al corriente, sin transferencias pendientes"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
