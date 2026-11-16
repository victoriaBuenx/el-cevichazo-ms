"use client";

import {
  MagnifyingGlassIcon,
  PlusIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MetodoPago, EstadoPago } from "@/types/ticket";

export type FiltroPeriodo = "todos" | "hoy" | "semana" | "mes";
export type FiltroMetodoPago = "todos" | MetodoPago;
export type FiltroEstadoPago = "todos" | EstadoPago;

interface TicketsFiltrosProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  periodo: FiltroPeriodo;
  onPeriodoChange: (periodo: FiltroPeriodo) => void;
  metodoPago: FiltroMetodoPago;
  onMetodoPagoChange: (metodo: FiltroMetodoPago) => void;
  estadoPago: FiltroEstadoPago;
  onEstadoPagoChange: (estado: FiltroEstadoPago) => void;
  onCrearTicket: () => void;
  onLimpiarFiltros: () => void;
  filtrosActivos: boolean;
}

export function TicketsFiltros({
  busqueda,
  onBusquedaChange,
  periodo,
  onPeriodoChange,
  metodoPago,
  onMetodoPagoChange,
  estadoPago,
  onEstadoPagoChange,
  onCrearTicket,
  onLimpiarFiltros,
  filtrosActivos,
}: TicketsFiltrosProps) {
  const periodos: { id: FiltroPeriodo; label: string }[] = [
    { id: "todos", label: "Todo" },
    { id: "hoy", label: "Hoy" },
    { id: "semana", label: "Esta semana" },
    { id: "mes", label: "Este mes" },
  ];

  const metodos: { id: FiltroMetodoPago; label: string }[] = [
    { id: "todos", label: "Todos los métodos" },
    { id: "efectivo", label: "Efectivo" },
    { id: "transferencia", label: "Transferencia" },
  ];

  const estados: { id: FiltroEstadoPago; label: string }[] = [
    { id: "todos", label: "Todos los estados" },
    { id: "pagado", label: "Pagados" },
    { id: "pendiente", label: "Pendientes" },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-xs w-full max-w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            weight="bold"
          />
          <Input
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por proveedor, descripción o folio..."
            className="h-9.5 pl-9 pr-8 text-sm bg-background border-border/70"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => onBusquedaChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <XCircleIcon className="size-4" weight="fill" />
            </button>
          )}
        </div>

        <Button
          type="button"
          onClick={onCrearTicket}
          className="font-semibold gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <PlusIcon className="size-4" weight="bold" />
          Registrar ticket
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <FunnelIcon className="size-3.5" weight="duotone" />
            <span className="font-medium">Filtrar:</span>
          </div>
          <div className="flex items-center rounded-lg bg-muted/50 p-0.5 border border-border/50">
            {periodos.map((p) => {
              const activo = periodo === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPeriodoChange(p.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer",
                    activo
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <select
            value={metodoPago}
            onChange={(e) =>
              onMetodoPagoChange(e.target.value as FiltroMetodoPago)
            }
            className="h-8 rounded-lg border border-border/70 bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          >
            {metodos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={estadoPago}
            onChange={(e) =>
              onEstadoPagoChange(e.target.value as FiltroEstadoPago)
            }
            className="h-8 rounded-lg border border-border/70 bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          >
            {estados.map((est) => (
              <option key={est.id} value={est.id}>
                {est.label}
              </option>
            ))}
          </select>
        </div>
        {filtrosActivos && (
          <button
            type="button"
            onClick={onLimpiarFiltros}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowsClockwiseIcon className="size-3.5" />
            <span>Restablecer filtros</span>
          </button>
        )}
      </div>
    </div>
  );
}
