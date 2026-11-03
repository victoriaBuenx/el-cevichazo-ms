"use server";

import { revalidatePath } from "next/cache";
import {
  createProveedor,
  updateProveedor,
  updateProveedorStatus,
} from "@/services/proveedores.service";

type CrearProveedorData = {
  name: string;
  phone: string;
  notes?: string;
};

type ActualizarProveedorData = {
  id: string;
  name: string;
  phone: string;
  notes?: string;
};

export async function crearProveedorAction(data: CrearProveedorData) {
  const nombreLimpio = data.name.trim();
  const telefonoLimpio = data.phone.trim().replace(/\D/g, "");

  if (!nombreLimpio || !telefonoLimpio) {
    return {
      success: false,
      message: "El nombre y el teléfono son obligatorios.",
    };
  }

  if (telefonoLimpio.length !== 10) {
    return {
      success: false,
      message: "El teléfono debe contener exactamente 10 dígitos numéricos.",
    };
  }

  try {
    await createProveedor({
      name: nombreLimpio,
      phone: telefonoLimpio,
      notes: data.notes?.trim() || undefined,
    });

    revalidatePath("/app/gastos/proveedores");

    return {
      success: true,
      message: "Proveedor registrado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al registrar el proveedor.",
    };
  }
}

export async function actualizarProveedorAction(data: ActualizarProveedorData) {
  const nombreLimpio = data.name.trim();
  const telefonoLimpio = data.phone.trim().replace(/\D/g, "");

  if (!data.id || !nombreLimpio || !telefonoLimpio) {
    return {
      success: false,
      message: "El nombre y el teléfono son obligatorios.",
    };
  }

  if (telefonoLimpio.length !== 10) {
    return {
      success: false,
      message: "El teléfono debe contener exactamente 10 dígitos numéricos.",
    };
  }

  try {
    await updateProveedor(data.id, {
      name: nombreLimpio,
      phone: telefonoLimpio,
      notes: data.notes?.trim() || undefined,
    });

    revalidatePath("/app/gastos/proveedores");

    return {
      success: true,
      message: "Proveedor actualizado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el proveedor.",
    };
  }
}

export async function cambiarEstatusProveedorAction(data: {
  id: string;
  isActive: boolean;
}) {
  if (!data.id) {
    return {
      success: false,
      message: "ID de proveedor requerido.",
    };
  }

  try {
    await updateProveedorStatus(data.id, data.isActive);

    revalidatePath("/app/gastos/proveedores");

    return {
      success: true,
      message: data.isActive
        ? "Proveedor reactivado correctamente."
        : "Proveedor desactivado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cambiar el estatus del proveedor.",
    };
  }
}
