import "server-only";

import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import type {
  Ticket,
  CrearTicketInput,
  ActualizarTicketInput,
  MetodoPago,
  EstadoPago,
} from "@/types/ticket";

type RawBackendTicket = {
  id: string;
  expenseDate: string;
  description: string;
  amount: number;
  paymentMethod: string | number;
  paymentStatus: string | number;
  notes?: string | null;
  voucherUrl?: string | null;
  voucherOriginalName?: string | null;
  transferVoucherUrl?: string | null;
  transferVoucherOriginalName?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  supplierId: string;
  supplierName: string;
  supplierPhone?: string | null;
  registeredByUserId?: string | null;
  registeredByUserName?: string | null;
};

function mapBackendToTicket(raw: RawBackendTicket): Ticket {
  const isEfectivo =
    raw.paymentMethod === "efectivo" ||
    raw.paymentMethod === "Cash" ||
    raw.paymentMethod === 1;

  const isPagado =
    raw.paymentStatus === "pagado" ||
    raw.paymentStatus === "Paid" ||
    raw.paymentStatus === 2;

  return {
    id: raw.id,
    folio: raw.id.slice(0, 8).toUpperCase(),
    fecha: raw.expenseDate ? raw.expenseDate.split("T")[0] : "",
    proveedorId: raw.supplierId,
    proveedorNombre: raw.supplierName || "Proveedor",
    descripcion: raw.description,
    importe: Number(raw.amount),
    metodoPago: (isEfectivo ? "efectivo" : "transferencia") as MetodoPago,
    estadoPago: (isPagado ? "pagado" : "pendiente") as EstadoPago,
    observaciones: raw.notes ?? null,
    comprobanteUrl: raw.voucherUrl ?? null,
    comprobanteNombre: raw.voucherOriginalName ?? null,
    comprobanteTransferenciaUrl: raw.transferVoucherUrl ?? null,
    comprobanteTransferenciaNombre: raw.transferVoucherOriginalName ?? null,
    registradoPor:
      raw.registeredByUserName ||
      (raw.registeredByUserId ? "Usuario de caja" : "Caja general"),
    createdAt: raw.createdAt,
  };
}

export async function getTickets(): Promise<Ticket[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/tickets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error al consultar tickets: ${response.status}`);
  }

  const data = (await response.json()) as RawBackendTicket[];
  return data.map(mapBackendToTicket);
}

export async function getTicketById(id: string): Promise<Ticket> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/tickets/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("Ticket no encontrado.");
  }

  if (!response.ok) {
    throw new Error(`Error al consultar ticket: ${response.status}`);
  }

  const data = (await response.json()) as RawBackendTicket;
  return mapBackendToTicket(data);
}

export async function createTicket(ticket: CrearTicketInput): Promise<Ticket> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const payload = {
    supplierId: ticket.proveedorId,
    expenseDate: ticket.fecha,
    description: ticket.descripcion,
    amount: ticket.importe,
    paymentMethod: ticket.metodoPago,
    paymentStatus: ticket.estadoPago,
    notes: ticket.observaciones || null,
    voucherUrl: ticket.comprobanteUrl || null,
    voucherOriginalName: ticket.comprobanteNombre || null,
    transferVoucherUrl: ticket.comprobanteTransferenciaUrl || null,
    transferVoucherOriginalName: ticket.comprobanteTransferenciaNombre || null,
  };

  const response = await fetch(`${API_URL}/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (response.status === 404) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "El proveedor asociado no existe.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "No se pudo registrar el ticket.");
  }

  const data = (await response.json()) as RawBackendTicket;
  return mapBackendToTicket(data);
}

export async function updateTicket(
  id: string,
  ticket: ActualizarTicketInput,
): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const payload = {
    supplierId: ticket.proveedorId,
    expenseDate: ticket.fecha,
    description: ticket.descripcion,
    amount: ticket.importe,
    paymentMethod: ticket.metodoPago,
    paymentStatus: ticket.estadoPago,
    notes: ticket.observaciones || null,
    voucherUrl: ticket.comprobanteUrl || null,
    voucherOriginalName: ticket.comprobanteNombre || null,
    transferVoucherUrl: ticket.comprobanteTransferenciaUrl || null,
    transferVoucherOriginalName: ticket.comprobanteTransferenciaNombre || null,
  };

  const response = await fetch(`${API_URL}/api/tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("No se encontró el ticket que intentas editar.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "No se pudo actualizar el ticket.");
  }
}

export async function deleteTicket(id: string): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/tickets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("El ticket no existe o ya fue eliminado.");
  }

  if (!response.ok) {
    throw new Error("No se pudo eliminar el ticket.");
  }
}
