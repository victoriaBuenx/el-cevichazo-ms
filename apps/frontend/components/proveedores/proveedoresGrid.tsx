"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProhibitIcon, CheckIcon } from "@phosphor-icons/react";
import { ProveedoresMetrics } from "./proveedoresMetrics";
import { ProveedoresFiltros, type FiltroEstado } from "./proveedoresFiltros";
import { ProveedoresTable } from "./proveedoresTable";
import { ProveedoresForm } from "./proveedoresForm";
import { ProveedorDetalleDialog } from "./proveedorDetalleDialog";
import { ConfirmarAcción } from "../shared/confirmarAcción";
import { cambiarEstatusProveedorAction } from "@/actions/proveedores/actions";
import type { Proveedor } from "@/types/proveedor";

interface ProveedoresGridProps {
  proveedores: Proveedor[];
}

export function ProveedoresGrid({ proveedores = [] }: ProveedoresGridProps) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");

  // Modales
  const [formAbierto, setFormAbierto] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState<Proveedor | null>(null);

  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [proveedorDetalle, setProveedorDetalle] =
    useState<Proveedor | null>(null);

  const [proveedorParaEstado, setProveedorParaEstado] =
    useState<Proveedor | null>(null);
  const [confirmarDesactivar, setConfirmarDesactivar] = useState(false);
  const [confirmarReactivar, setConfirmarReactivar] = useState(false);

  // Filtrado reactivo en cliente sobre la data del servidor
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

  const handleSolicitarCambioEstado = (proveedor: Proveedor) => {
    setProveedorParaEstado(proveedor);
    if (proveedor.isActive) {
      setConfirmarDesactivar(true);
    } else {
      setConfirmarReactivar(true);
    }
  };

  const handleConfirmarCambioEstado = async (nuevoEstado: boolean) => {
    if (!proveedorParaEstado) return;

    await cambiarEstatusProveedorAction({
      id: proveedorParaEstado.id,
      isActive: nuevoEstado,
    });
    router.refresh();
    setProveedorParaEstado(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Indicadores Financieros (KPIs) */}
      <ProveedoresMetrics proveedores={proveedores} />

      {/* 2. Barra de Búsqueda, Filtros y Botón de Acción */}
      <ProveedoresFiltros
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        onCrearProveedor={handleCrear}
      />

      {/* 3. Tabla de Proveedores */}
      <ProveedoresTable
        proveedores={proveedoresFiltrados}
        onEditar={handleEditar}
        onCambiarEstado={handleSolicitarCambioEstado}
        onVerDetalle={handleVerDetalle}
      />

      {/* 4. Modal para Crear o Editar Proveedor */}
      <ProveedoresForm
        abierto={formAbierto}
        onAbiertoChange={setFormAbierto}
        proveedor={proveedorSeleccionado}
      />

      {/* 5. Modal de Ficha Técnica / Detalle del Proveedor */}
      <ProveedorDetalleDialog
        abierto={detalleAbierto}
        onAbiertoChange={setDetalleAbierto}
        proveedor={proveedorDetalle}
        onEditar={(p) => {
          setDetalleAbierto(false);
          handleEditar(p);
        }}
      />

      {/* 6. Modal de Confirmación para Desactivar */}
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

      {/* 7. Modal de Confirmación para Reactivar */}
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
