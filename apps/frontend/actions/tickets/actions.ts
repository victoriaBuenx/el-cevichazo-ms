"use server";

import { revalidatePath } from "next/cache";
import {
  createTicket,
  updateTicket,
  deleteTicket,
} from "@/services/tickets.service";
import type { CrearTicketInput, ActualizarTicketInput } from "@/types/ticket";

export async function crearTicketAction(data: CrearTicketInput) {
  if (!data.proveedorId) {
    return {
      success: false,
      message: "Debe seleccionar un proveedor válido.",
    };
  }

  if (!data.descripcion?.trim()) {
    return {
      success: false,
      message: "La descripción del gasto es obligatoria.",
    };
  }

  if (!data.importe || data.importe <= 0) {
    return {
      success: false,
      message: "El importe debe ser mayor a $0.00.",
    };
  }

  try {
    const nuevoTicket = await createTicket({
      ...data,
      descripcion: data.descripcion.trim(),
      observaciones: data.observaciones?.trim() || undefined,
    });

    revalidatePath("/app/gastos/tickets");

    return {
      success: true,
      message: "Ticket registrado correctamente.",
      ticket: nuevoTicket,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al registrar el ticket.",
    };
  }
}

export async function actualizarTicketAction(data: ActualizarTicketInput) {
  if (!data.id) {
    return {
      success: false,
      message: "ID de ticket requerido.",
    };
  }

  if (!data.proveedorId) {
    return {
      success: false,
      message: "Debe seleccionar un proveedor válido.",
    };
  }

  if (!data.descripcion?.trim()) {
    return {
      success: false,
      message: "La descripción del gasto es obligatoria.",
    };
  }

  if (!data.importe || data.importe <= 0) {
    return {
      success: false,
      message: "El importe debe ser mayor a $0.00.",
    };
  }

  try {
    await updateTicket(data.id, {
      ...data,
      descripcion: data.descripcion.trim(),
      observaciones: data.observaciones?.trim() || undefined,
    });

    revalidatePath("/app/gastos/tickets");

    return {
      success: true,
      message: "Ticket actualizado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el ticket.",
    };
  }
}

export async function liquidarTicketAction(data: {
  id: string;
  ticketExistente: ActualizarTicketInput;
  comprobanteTransferenciaUrl?: string;
  comprobanteTransferenciaNombre?: string;
}) {
  if (!data.id) {
    return {
      success: false,
      message: "ID de ticket requerido.",
    };
  }

  try {
    await updateTicket(data.id, {
      ...data.ticketExistente,
      estadoPago: "pagado",
      comprobanteTransferenciaUrl:
        data.comprobanteTransferenciaUrl ??
        data.ticketExistente.comprobanteTransferenciaUrl,
      comprobanteTransferenciaNombre:
        data.comprobanteTransferenciaNombre ??
        data.ticketExistente.comprobanteTransferenciaNombre,
    });

    revalidatePath("/app/gastos/tickets");

    return {
      success: true,
      message: "Ticket liquidado y marcado como pagado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al liquidar el ticket.",
    };
  }
}

export async function eliminarTicketAction(id: string) {
  if (!id) {
    return {
      success: false,
      message: "ID de ticket requerido.",
    };
  }

  try {
    await deleteTicket(id);

    revalidatePath("/app/gastos/tickets");

    return {
      success: true,
      message: "Ticket eliminado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar el ticket.",
    };
  }
}
