"use client";

import {
  PencilSimpleIcon,
  PhoneIcon,
  ProhibitIcon,
  CheckIcon,
  FileTextIcon,
  StorefrontIcon,
  CalendarBlankIcon,
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
import type { Proveedor } from "@/types/proveedor";

interface ProveedoresTableProps {
  proveedores: Proveedor[];
  onEditar: (proveedor: Proveedor) => void;
  onCambiarEstado: (proveedor: Proveedor) => void;
  onVerDetalle: (proveedor: Proveedor) => void;
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
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ProveedoresTable({
  proveedores,
  onEditar,
  onCambiarEstado,
  onVerDetalle,
}: ProveedoresTableProps) {
  if (proveedores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-12 text-center bg-card/50">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          <StorefrontIcon className="size-7" weight="duotone" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No se encontraron proveedores
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Intenta ajustar los términos de búsqueda o cambiar los filtros
          seleccionados para visualizar resultados.
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nombre</TableHead>
            <TableHead className="w-[170px]">Teléfono</TableHead>
            <TableHead className="w-[120px]">Estado</TableHead>
            <TableHead className="w-[160px]">Adeudo</TableHead>
            <TableHead className="w-[240px]">Último Movimiento</TableHead>
            <TableHead className="w-[140px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {proveedores.map((p) => {
            const tieneAdeudo = (p.pendingBalance ?? 0) > 0;
            return (
              <TableRow key={p.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {p.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onVerDetalle(p)}
                        className="truncate text-left text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                        title={p.name}
                      >
                        {p.name}
                      </button>
                      {p.notes ? (
                        <p
                          className="line-clamp-1 text-xs text-muted-foreground max-w-[240px]"
                          title={p.notes}
                        >
                          {p.notes}
                        </p>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/60 italic">
                          Sin notas adicionales
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${p.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <PhoneIcon
                      className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                      weight="duotone"
                    />
                    <span>{formatearTelefono(p.phone)}</span>
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={p.isActive ? "secondary" : "destructive"}
                    className={
                      p.isActive
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : ""
                    }
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        p.isActive ? "bg-emerald-600" : "bg-current"
                      }`}
                    />
                    {p.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-sm font-semibold ${
                        tieneAdeudo
                          ? "text-red-600 dark:text-red-400"
                          : "text-foreground"
                      }`}
                    >
                      {formatearMoneda(p.pendingBalance)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 max-w-[220px]">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <CalendarBlankIcon
                        className="size-3.5 text-muted-foreground"
                        weight="duotone"
                      />
                      <span>
                        {formatearFecha(p.lastMovementDate ?? p.createdAt)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                      onClick={() => onVerDetalle(p)}
                      title="Ver ficha técnica"
                      aria-label="Ver ficha técnica"
                    >
                      <FileTextIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => onEditar(p)}
                      title="Editar proveedor"
                      aria-label="Editar proveedor"
                    >
                      <PencilSimpleIcon className="size-4" />
                    </Button>
                    {p.isActive ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onCambiarEstado(p)}
                        title="Desactivar proveedor"
                        aria-label="Desactivar proveedor"
                      >
                        <ProhibitIcon className="size-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                        onClick={() => onCambiarEstado(p)}
                        title="Reactivar proveedor"
                        aria-label="Reactivar proveedor"
                      >
                        <CheckIcon className="size-4" />
                      </Button>
                    )}
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
