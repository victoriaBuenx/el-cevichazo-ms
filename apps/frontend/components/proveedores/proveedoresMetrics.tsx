"use client";

import {
  StorefrontIcon,
  ReceiptIcon,
  TrendUpIcon,
  WarningCircleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import type { Proveedor } from "@/types/proveedor";

interface ProveedoresMetricsProps {
  proveedores: Proveedor[];
}

function formatearMoneda(cantidad: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(cantidad);
}

export function ProveedoresMetrics({ proveedores }: ProveedoresMetricsProps) {
  const total = proveedores.length;
  const activos = proveedores.filter((p) => p.isActive).length;
  const inactivos = total - activos;

  const totalAdeudo = proveedores.reduce(
    (acc, p) => acc + (p.pendingBalance ?? 0),
    0,
  );
  const proveedoresConAdeudo = proveedores.filter(
    (p) => (p.pendingBalance ?? 0) > 0,
  ).length;

  const totalGastoMes = proveedores.reduce(
    (acc, p) => acc + (p.monthExpense ?? 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card size="sm" className="relative overflow-hidden border-border/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Proveedores Activos
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <StorefrontIcon className="size-5" weight="duotone" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {activos}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              / {total} totales
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircleIcon
              className="size-3.5 text-emerald-600"
              weight="fill"
            />
            <span>
              {inactivos === 0
                ? "100% en catálogo activo"
                : `${inactivos} inactivo${inactivos > 1 ? "s" : ""}`}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card size="sm" className="relative overflow-hidden border-border/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Adeudo Pendiente
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
              <ReceiptIcon className="size-5" weight="duotone" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {formatearMoneda(totalAdeudo)}
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            {proveedoresConAdeudo > 0 ? (
              <>
                <WarningCircleIcon
                  className="size-3.5 text-amber-600"
                  weight="fill"
                />
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  {proveedoresConAdeudo} cuenta
                  {proveedoresConAdeudo > 1 ? "s" : ""} por liquidar
                </span>
              </>
            ) : (
              <>
                <CheckCircleIcon
                  className="size-3.5 text-emerald-600"
                  weight="fill"
                />
                <span className="text-emerald-700 dark:text-emerald-400">
                  Sin adeudos pendientes
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Card
        size="sm"
        className="relative overflow-hidden border-border/60 sm:col-span-2 lg:col-span-1"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Gasto del Mes
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20">
              <TrendUpIcon className="size-5" weight="duotone" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {formatearMoneda(totalGastoMes)}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-sky-500" />
            <span>Facturación de compras en curso</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
