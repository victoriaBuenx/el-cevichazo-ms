import "server-only";

import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import type { Usuario } from "@/types/usuario";
import type { CrearUsuarioRequest } from "@/types/createUsuario";
import { ActualizarUsuarioRequest } from "@/types/updateUsuario";

export async function getUsuarios(): Promise<Usuario[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error al consultar usuarios: ${response.status}`);
  }

  return (await response.json()) as Usuario[];
}

export async function createUsuario(
  usuario: CrearUsuarioRequest,
): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(usuario),
    cache: "no-store",
  });

  if (response.status === 409) {
    throw new Error("Ya existe un usuario con ese correo electrónico");
  }
  if (!response.ok) {
    throw new Error("No se pudo actualizar el usuario.");
  }
}

export async function updateUsuario(
  id: string,
  usuario: ActualizarUsuarioRequest,
): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(usuario),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("No se encontró el usuario que intentas editar.");
  }
  if (response.status === 409) {
    throw new Error("Ya existe un usuario con ese correo electrónico.");
  }
  if (!response.ok) {
    throw new Error("No se pudo actualizar el usuario.");
  }
}

export async function updateUsuarioStatus(
  id: string,
  isActive: boolean,
): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No hay una sesión autenticada.");
  }

  const response = await fetch(`${API_URL}/api/users/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ IsActive: isActive }),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("No se encontró el usuario.");
  }
  if (!response.ok) {
    throw new Error("No se pudo cambiar el estatus del usuario.");
  }
}
