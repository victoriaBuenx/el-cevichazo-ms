"use server";

import { revalidatePath } from "next/cache";
import {
  createUsuario,
  updateUsuario,
  updateUsuarioStatus,
} from "@/services/usuarios.service";

type CrearUsuarioData = {
  userName: string;
  email: string;
  password: string;
  confirmarPassword: string;
};

type ActualizarUsuarioData = {
  id: string;
  userName: string;
  email: string;
};

export async function crearUsuarioAction(data: CrearUsuarioData) {
  if (!data.userName.trim() || !data.email.trim() || !data.password) {
    return {
      success: false,
      message: "Completa todos los campos.",
    };
  }

  if (data.password.length < 8) {
    return {
      success: false,
      message: "La contraseña debe tener al menos 8 caracteres.",
    };
  }

  if (data.password !== data.confirmarPassword) {
    return {
      success: false,
      message: "Las contraseñas no coinciden.",
    };
  }

  try {
    await createUsuario({
      UserName: data.userName.trim(),
      Email: data.email.trim(),
      Password: data.password,
    });

    revalidatePath("/app/administracion/usuarios");

    return { success: true, message: "Usuario creado correctamente." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear el usuario.",
    };
  }
}

export async function actualizarUsuarioAction(data: ActualizarUsuarioData) {
  if (!data.id || !data.userName.trim() || !data.email.trim()) {
    return {
      success: false,
      message: "Completa todos los campos.",
    };
  }

  try {
    await updateUsuario(data.id, {
      UserName: data.userName.trim(),
      Email: data.email.trim(),
    });

    revalidatePath("/app/administracion/usuarios");

    return {
      success: true,
      message: "Usuario actualizado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el usuario.",
    };
  }
}

export async function cambiarEstatusUsuarioAction(data: {
  id: string;
  isActive: boolean;
}) {
  if (!data.id) {
    return {
      success: false,
      message: "ID de usuario requerido.",
    };
  }

  try {
    await updateUsuarioStatus(data.id, data.isActive);

    revalidatePath("/app/administracion/usuarios");

    return {
      success: true,
      message: data.isActive
        ? "Usuario reactivado correctamente."
        : "Usuario desactivado correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cambiar el estatus del usuario.",
    };
  }
}
