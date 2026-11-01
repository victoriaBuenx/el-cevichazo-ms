"use client";

import { useMemo, useState } from "react";
import { ProhibitIcon, CheckIcon } from "@phosphor-icons/react";
import { ProveedoresMetrics } from "./proveedoresMetrics";
import { ProveedoresFiltros, type FiltroEstado } from "./proveedoresFiltros";
import { ProveedoresTable } from "./proveedoresTable";
import { ProveedoresForm } from "./proveedoresForm";
import { ProveedorDetalleDialog } from "./proveedorDetalleDialog";
import { ConfirmarAcción } from "../shared/confirmarAcción";
import { PROVEEDORES_EJEMPLO } from "./mockData";
import type { Proveedor } from "@/types/proveedor";

interface ProveedoresGridProps {
  initialProveedores?: Proveedor[];
}

export function ProveedoresGrid({
  initialProveedores = PROVEEDORES_EJEMPLO,
}: ProveedoresGridProps) {
  const [proveedores, setProveedores] =
    useState<Proveedor[]>(initialProveedores);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");

  const [formAbierto, setFormAbierto] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState<Proveedor | null>(null);

  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [proveedorDetalle, setProveedorDetalle] = useState<Proveedor | null>(
    null,
  );

  const [proveedorParaEstado, setProveedorParaEstado] =
    useState<Proveedor | null>(null);
  const [confirmarDesactivar, setConfirmarDesactivar] = useState(false);
  const [confirmarReactivar, setConfirmarReactivar] = useState(false);

  const proveedoresFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return proveedores.filter((p) => {
      const coincideBusqueda =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q));

      if (!coincideBusqueda) return false;
      if (filtroEstado === "activos") return p.isActive;
      if (filtroEstado === "inactivos") return !p.isActive;
      if (filtroEstado === "con_adeudo") return (p.pendingBalance ?? 0) > 0;

      return true;
    });
  }, [proveedores, busqueda, filtroEstado]);

  const handleCrear = () => {
    setProveedorSeleccionado(null);
    setFormAbierto(true);
  };

  const handleEditar = (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor);
    setFormAbierto(true);
  };

  const handleVerDetalle = (proveedor: Proveedor) => {
    setProveedorDetalle(proveedor);
    setDetalleAbierto(true);
  };
  const handleGuardar = (datos: {
    id?: string;
    name: string;
    phone: string;
    notes?: string;
    pendingBalance?: number;
  }) => {
    if (datos.id) {
      setProveedores((prev) =>
        prev.map((item) =>
          item.id === datos.id
            ? {
                ...item,
                name: datos.name,
                phone: datos.phone,
                notes: datos.notes ?? null,
                pendingBalance: datos.pendingBalance ?? item.pendingBalance,
              }
            : item,
        ),
      );
    } else {
      const nuevo: Proveedor = {
        id: crypto.randomUUID(),
        name: datos.name,
        phone: datos.phone,
        notes: datos.notes ?? null,
        isActive: true,
        createdAt: new Date().toISOString(),
        pendingBalance: datos.pendingBalance ?? 0,
        monthExpense: 0,
        lastMovementDate: new Date().toISOString(),
        lastMovementConcept: "Alta de proveedor",
      };
      setProveedores((prev) => [nuevo, ...prev]);
    }
  };
  const handleSolicitarCambioEstado = (proveedor: Proveedor) => {
    setProveedorParaEstado(proveedor);
    if (proveedor.isActive) {
      setConfirmarDesactivar(true);
    } else {
      setConfirmarReactivar(true);
    }
  };
  const handleConfirmarCambioEstado = (nuevoEstado: boolean) => {
    if (!proveedorParaEstado) return;
    setProveedores((prev) =>
      prev.map((item) =>
        item.id === proveedorParaEstado.id
          ? { ...item, isActive: nuevoEstado }
          : item,
      ),
    );
    setProveedorParaEstado(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <ProveedoresMetrics proveedores={proveedores} />
      <ProveedoresFiltros
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        onCrearProveedor={handleCrear}
        conteoFiltrado={proveedoresFiltrados.length}
        totalProveedores={proveedores.length}
      />
      <ProveedoresTable
        proveedores={proveedoresFiltrados}
        onEditar={handleEditar}
        onCambiarEstado={handleSolicitarCambioEstado}
        onVerDetalle={handleVerDetalle}
      />
      <ProveedoresForm
        abierto={formAbierto}
        onAbiertoChange={setFormAbierto}
        proveedor={proveedorSeleccionado}
        onGuardar={handleGuardar}
      />
      <ProveedorDetalleDialog
        abierto={detalleAbierto}
        onAbiertoChange={setDetalleAbierto}
        proveedor={proveedorDetalle}
        onEditar={(p) => {
          setDetalleAbierto(false);
          handleEditar(p);
        }}
      />
      <ConfirmarAcción
        abierto={confirmarDesactivar}
        onAbiertoChange={setConfirmarDesactivar}
        variante="destructive"
        icono={<ProhibitIcon weight="duotone" />}
        titulo={`¿Desactivar a ${proveedorParaEstado?.name}?`}
        descripción="El proveedor se marcará como inactivo en el catálogo y no se sugerirá para nuevos registros. Podrás reactivarlo en cualquier momento."
        textoConfirmar="Sí, desactivar"
        textoCancelar="No, mantener activo"
        onConfirmar={() => handleConfirmarCambioEstado(false)}
      />
      <ConfirmarAcción
        abierto={confirmarReactivar}
        onAbiertoChange={setConfirmarReactivar}
        variante="success"
        icono={<CheckIcon weight="duotone" />}
        titulo={`¿Reactivar a ${proveedorParaEstado?.name}?`}
        descripción="El proveedor volverá a estar activo y disponible para el registro de compras y control de adeudos."
        textoConfirmar="Sí, reactivar"
        textoCancelar="No, mantener inactivo"
        onConfirmar={() => handleConfirmarCambioEstado(true)}
      />
    </div>
  );
}
