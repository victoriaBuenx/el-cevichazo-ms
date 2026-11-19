"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@phosphor-icons/react";
import { TicketsMetrics } from "./ticketsMetrics";
import {
  TicketsFiltros,
  type FiltroPeriodo,
  type FiltroMetodoPago,
  type FiltroEstadoPago,
} from "./ticketsFiltros";
import { TicketsTable } from "./ticketsTable";
import { TicketsForm } from "./ticketsForm";
import { TicketDetalleDialog } from "./ticketDetalleDialog";
import { TicketPagarDialog } from "./ticketPagarDialog";
import { ConfirmarAcción } from "../shared/confirmarAcción";
import {
  eliminarTicketAction,
  liquidarTicketAction,
} from "@/actions/tickets/actions";
import type { Ticket } from "@/types/ticket";
import type { Proveedor } from "@/types/proveedor";

interface TicketsGridProps {
  initialTickets?: Ticket[];
  proveedores?: Proveedor[];
}

export function TicketsGrid({
  initialTickets = [],
  proveedores = [],
}: TicketsGridProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState("");
  const [periodo, setPeriodo] = useState<FiltroPeriodo>("todos");
  const [metodoPago, setMetodoPago] = useState<FiltroMetodoPago>("todos");
  const [estadoPago, setEstadoPago] = useState<FiltroEstadoPago>("todos");

  // Modales
  const [formAbierto, setFormAbierto] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);

  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [ticketDetalle, setTicketDetalle] = useState<Ticket | null>(null);

  const [ticketParaEliminar, setTicketParaEliminar] = useState<Ticket | null>(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  // Modal para liquidar ticket y adjuntar comprobante SPEI
  const [ticketParaPagar, setTicketParaPagar] = useState<Ticket | null>(null);
  const [pagarAbierto, setPagarAbierto] = useState(false);

  const filtrosActivos =
    busqueda.trim() !== "" ||
    periodo !== "todos" ||
    metodoPago !== "todos" ||
    estadoPago !== "todos";

  const handleLimpiarFiltros = () => {
    setBusqueda("");
    setPeriodo("todos");
    setMetodoPago("todos");
    setEstadoPago("todos");
  };

  // Filtrado de tickets
  const ticketsFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const hoyStr = new Date().toISOString().split("T")[0];
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);
    const mesActualStr = hoyStr.slice(0, 7);

    return tickets.filter((t) => {
      if (q) {
        const coincideProveedor = t.proveedorNombre.toLowerCase().includes(q);
        const coincideDescripcion = t.descripcion.toLowerCase().includes(q);
        const coincideFolio = t.folio.toLowerCase().includes(q);
        const coincideObs = t.observaciones?.toLowerCase().includes(q);
        if (!coincideProveedor && !coincideDescripcion && !coincideFolio && !coincideObs) {
          return false;
        }
      }

      if (metodoPago !== "todos" && t.metodoPago !== metodoPago) {
        return false;
      }

      if (estadoPago !== "todos" && t.estadoPago !== estadoPago) {
        return false;
      }

      if (periodo === "hoy") {
        return t.fecha === hoyStr;
      } else if (periodo === "semana") {
        const fechaTicket = new Date(t.fecha + "T00:00:00");
        return fechaTicket >= sieteDiasAtras;
      } else if (periodo === "mes") {
        return t.fecha.startsWith(mesActualStr);
      }

      return true;
    });
  }, [tickets, busqueda, metodoPago, estadoPago, periodo]);

  // Handlers
  const handleCrear = () => {
    setTicketSeleccionado(null);
    setFormAbierto(true);
  };

  const handleEditar = (ticket: Ticket) => {
    setTicketSeleccionado(ticket);
    setFormAbierto(true);
  };

  const handleVerDetalle = (ticket: Ticket) => {
    setTicketDetalle(ticket);
    setDetalleAbierto(true);
  };

  const handleSolicitarEliminar = (ticket: Ticket) => {
    setTicketParaEliminar(ticket);
    setConfirmarEliminar(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!ticketParaEliminar) return;
    await eliminarTicketAction(ticketParaEliminar.id);
    router.refresh();
    setTicketParaEliminar(null);
  };

  const handleSolicitarMarcarPagado = (ticket: Ticket) => {
    setTicketParaPagar(ticket);
    setPagarAbierto(true);
  };

  const handleConfirmarPago = async (datos: {
    ticketId: string;
    comprobanteTransferenciaUrl?: string;
    comprobanteTransferenciaNombre?: string;
    referencia?: string;
  }) => {
    const t = tickets.find((item) => item.id === datos.ticketId);
    if (!t) return;

    await liquidarTicketAction({
      id: t.id,
      ticketExistente: {
        id: t.id,
        proveedorId: t.proveedorId,
        proveedorNombre: t.proveedorNombre,
        fecha: t.fecha,
        descripcion: t.descripcion,
        importe: t.importe,
        metodoPago: t.metodoPago,
        estadoPago: "pagado",
        observaciones: datos.referencia
          ? `${t.observaciones ? `${t.observaciones} • ` : ""}Ref SPEI: ${datos.referencia}`
          : t.observaciones || undefined,
        comprobanteUrl: t.comprobanteUrl || undefined,
        comprobanteNombre: t.comprobanteNombre || undefined,
        comprobanteTransferenciaUrl: datos.comprobanteTransferenciaUrl,
        comprobanteTransferenciaNombre: datos.comprobanteTransferenciaNombre,
      },
      comprobanteTransferenciaUrl: datos.comprobanteTransferenciaUrl,
      comprobanteTransferenciaNombre: datos.comprobanteTransferenciaNombre,
    });

    router.refresh();
    setTicketParaPagar(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full min-w-0">
      {/* 1. Indicadores (KPIs) */}
      <TicketsMetrics tickets={tickets} />

      {/* 2. Filtros y Búsqueda */}
      <TicketsFiltros
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        periodo={periodo}
        onPeriodoChange={setPeriodo}
        metodoPago={metodoPago}
        onMetodoPagoChange={setMetodoPago}
        estadoPago={estadoPago}
        onEstadoPagoChange={setEstadoPago}
        onCrearTicket={handleCrear}
        onLimpiarFiltros={handleLimpiarFiltros}
        filtrosActivos={filtrosActivos}
      />

      {/* 3. Tabla de Tickets */}
      <TicketsTable
        tickets={ticketsFiltrados}
        onVerDetalle={handleVerDetalle}
        onEditar={handleEditar}
        onEliminar={handleSolicitarEliminar}
        onCambiarEstado={handleSolicitarMarcarPagado}
      />

      {/* 4. Modal para Crear o Editar Ticket */}
      <TicketsForm
        abierto={formAbierto}
        onAbiertoChange={setFormAbierto}
        ticket={ticketSeleccionado}
        proveedores={proveedores}
      />

      {/* 5. Modal de Ficha Técnica / Detalle del Ticket */}
      <TicketDetalleDialog
        abierto={detalleAbierto}
        onAbiertoChange={setDetalleAbierto}
        ticket={ticketDetalle}
        onEditar={(t) => {
          setDetalleAbierto(false);
          handleEditar(t);
        }}
        onMarcarComoPagado={handleSolicitarMarcarPagado}
      />

      {/* 6. Modal para Validar Pago y Adjuntar Ficha SPEI */}
      <TicketPagarDialog
        abierto={pagarAbierto}
        onAbiertoChange={setPagarAbierto}
        ticket={ticketParaPagar}
        onConfirmarPago={handleConfirmarPago}
      />

      {/* 7. Modal de Confirmación para Eliminar */}
      <ConfirmarAcción
        abierto={confirmarEliminar}
        onAbiertoChange={setConfirmarEliminar}
        variante="destructive"
        icono={<TrashIcon weight="duotone" />}
        titulo={`¿Eliminar ticket ${ticketParaEliminar?.folio}?`}
        descripción={`Se eliminará el registro de gasto por $${ticketParaEliminar?.importe.toLocaleString("es-MX")} con proveedor ${ticketParaEliminar?.proveedorNombre}. Esta acción no se puede deshacer.`}
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
        onConfirmar={handleConfirmarEliminar}
      />
    </div>
  );
}
