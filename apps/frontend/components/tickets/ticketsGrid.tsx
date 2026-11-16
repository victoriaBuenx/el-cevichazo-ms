"use client";

import { useMemo, useState } from "react";
import { TrashIcon, CheckIcon } from "@phosphor-icons/react";
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
import { ConfirmarAcción } from "../shared/confirmarAcción";
import { MOCK_TICKETS } from "./mockTickets";
import type { Ticket, CrearTicketInput } from "@/types/ticket";

interface TicketsGridProps {
  initialTickets?: Ticket[];
}

export function TicketsGrid({
  initialTickets = MOCK_TICKETS,
}: TicketsGridProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const [busqueda, setBusqueda] = useState("");
  const [periodo, setPeriodo] = useState<FiltroPeriodo>("todos");
  const [metodoPago, setMetodoPago] = useState<FiltroMetodoPago>("todos");
  const [estadoPago, setEstadoPago] = useState<FiltroEstadoPago>("todos");

  const [formAbierto, setFormAbierto] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(
    null,
  );

  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [ticketDetalle, setTicketDetalle] = useState<Ticket | null>(null);

  const [ticketParaEliminar, setTicketParaEliminar] = useState<Ticket | null>(
    null,
  );
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  const [ticketParaMarcarPagado, setTicketParaMarcarPagado] =
    useState<Ticket | null>(null);
  const [confirmarMarcarPagado, setConfirmarMarcarPagado] = useState(false);

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
        if (
          !coincideProveedor &&
          !coincideDescripcion &&
          !coincideFolio &&
          !coincideObs
        ) {
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

  const handleConfirmarEliminar = () => {
    if (!ticketParaEliminar) return;
    setTickets((prev) => prev.filter((t) => t.id !== ticketParaEliminar.id));
    setTicketParaEliminar(null);
  };

  const handleSolicitarMarcarPagado = (ticket: Ticket) => {
    setTicketParaMarcarPagado(ticket);
    setConfirmarMarcarPagado(true);
  };

  const handleConfirmarMarcarPagado = () => {
    if (!ticketParaMarcarPagado) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketParaMarcarPagado.id
          ? {
              ...t,
              estadoPago: "pagado",
              observaciones: t.observaciones
                ? `${t.observaciones} • Transferencia confirmada por caja.`
                : "Transferencia bancaria confirmada por caja.",
            }
          : t,
      ),
    );
    setTicketParaMarcarPagado(null);
  };

  const handleGuardarTicket = (datos: CrearTicketInput & { id?: string }) => {
    if (datos.id) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === datos.id
            ? {
                ...t,
                proveedorId: datos.proveedorId,
                proveedorNombre: datos.proveedorNombre,
                fecha: datos.fecha,
                descripcion: datos.descripcion,
                importe: datos.importe,
                metodoPago: datos.metodoPago,
                estadoPago: datos.estadoPago,
                observaciones: datos.observaciones ?? null,
                comprobanteUrl: datos.comprobanteUrl ?? t.comprobanteUrl,
                comprobanteNombre:
                  datos.comprobanteNombre ?? t.comprobanteNombre,
              }
            : t,
        ),
      );
    } else {
      const nuevoFolioNum = tickets.length + 90;
      const nuevo: Ticket = {
        id: `tk-${Date.now()}`,
        folio: `TK-2026-00${nuevoFolioNum}`,
        proveedorId: datos.proveedorId,
        proveedorNombre: datos.proveedorNombre,
        fecha: datos.fecha,
        descripcion: datos.descripcion,
        importe: datos.importe,
        metodoPago: datos.metodoPago,
        estadoPago: datos.estadoPago,
        observaciones: datos.observaciones ?? null,
        comprobanteUrl:
          datos.comprobanteUrl ||
          "https://images.unsplash.com/photo-1554415707-9e4466b88738?auto=format&fit=crop&w=800&q=80",
        comprobanteNombre: datos.comprobanteNombre || "comprobante_caja.jpg",
        registradoPor: "Caja Turno Actual",
        createdAt: new Date().toISOString(),
      };
      setTickets((prev) => [nuevo, ...prev]);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full min-w-0">
      <TicketsMetrics tickets={tickets} />
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
      <TicketsTable
        tickets={ticketsFiltrados}
        onVerDetalle={handleVerDetalle}
        onEditar={handleEditar}
        onEliminar={handleSolicitarEliminar}
        onCambiarEstado={handleSolicitarMarcarPagado}
      />
      <TicketsForm
        abierto={formAbierto}
        onAbiertoChange={setFormAbierto}
        ticket={ticketSeleccionado}
        onGuardar={handleGuardarTicket}
      />
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
      <ConfirmarAcción
        abierto={confirmarMarcarPagado}
        onAbiertoChange={setConfirmarMarcarPagado}
        variante="success"
        icono={<CheckIcon weight="duotone" />}
        titulo={`¿Marcar como pagado el ticket ${ticketParaMarcarPagado?.folio}?`}
        descripción={`Se confirmará la recepción de la transferencia realizada por el dueño por un importe de $${ticketParaMarcarPagado?.importe.toLocaleString("es-MX")}.`}
        textoConfirmar="Sí, confirmar pago"
        textoCancelar="Cancelar"
        onConfirmar={handleConfirmarMarcarPagado}
      />
    </div>
  );
}
