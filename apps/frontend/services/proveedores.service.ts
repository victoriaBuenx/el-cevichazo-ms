import "server-only";

import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import type { Proveedor } from "@/types/proveedor";
import type { CrearProveedorRequest } from "@/types/createProveedor";
import type { ActualizarProveedorRequest } from "@/types/updateProveedor";

export async function getProveedores(): Promise<Proveedor[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/suppliers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error al consultar proveedores: ${response.status}`);
  }

  return (await response.json()) as Proveedor[];
}

export async function createProveedor(
  proveedor: CrearProveedorRequest,
): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(proveedor),
    cache: "no-store",
  });

  if (response.status === 409) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "El número de teléfono ya está registrado.",
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "No se pudo registrar el proveedor.",
    );
  }
}

export async function updateProveedor(
  id: string,
  proveedor: ActualizarProveedorRequest,
): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(proveedor),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("No se encontró el proveedor que intentas editar.");
  }

  if (response.status === 409) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        "El número de teléfono ya está registrado por otro proveedor.",
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "No se pudo actualizar el proveedor.",
    );
  }
}

export async function updateProveedorStatus(
  id: string,
  isActive: boolean,
): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/suppliers/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ IsActive: isActive }),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("No se encontró el proveedor.");
  }

  if (!response.ok) {
    throw new Error("No se pudo cambiar el estatus del proveedor.");
  }
}
