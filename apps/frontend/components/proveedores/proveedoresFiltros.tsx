"use client";

import {
  MagnifyingGlassIcon,
  PlusIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FiltroEstado = "todos" | "activos" | "inactivos" | "con_adeudo";

interface ProveedoresFiltrosProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  filtroEstado: FiltroEstado;
  onFiltroEstadoChange: (filtro: FiltroEstado) => void;
  onCrearProveedor: () => void;
}

export function ProveedoresFiltros({
  busqueda,
  onBusquedaChange,
  filtroEstado,
  onFiltroEstadoChange,
  onCrearProveedor,
}: ProveedoresFiltrosProps) {
  const filtros: { id: FiltroEstado; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "activos", label: "Activos" },
    { id: "con_adeudo", label: "Con adeudo" },
    { id: "inactivos", label: "Inactivos" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Barra de búsqueda y filtros rápidos */}
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Input de búsqueda */}
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            weight="bold"
          />
          <Input
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="h-9 pl-9 pr-8 text-sm bg-background border-border/70"
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

        {/* Botones de filtro rápido */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filtros.map((f) => {
            const activo = filtroEstado === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFiltroEstadoChange(f.id)}
                className={cn(
                  "inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors cursor-pointer",
                  activo
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón de acción principal */}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          onClick={onCrearProveedor}
          className="font-semibold gap-1.5 shadow-xs"
        >
          <PlusIcon className="size-4" weight="bold" />
          Registrar Proveedor
        </Button>
      </div>
    </div>
  );
}
