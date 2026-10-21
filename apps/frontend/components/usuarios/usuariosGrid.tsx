"use client";

import { UserPlusIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { UsuariosCard } from "./usuariosCards";
import { useState } from "react";
import UsuariosForm from "./usuariosForm";
import type { Usuario } from "@/types/usuario";
import { cambiarEstatusUsuarioAction } from "@/actions/usuarios/actions";
import { useRouter } from "next/navigation";

type UsuariosGridProps = {
  usuarios: Usuario[];
};

export function UsuariosGrid({ usuarios }: UsuariosGridProps) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);

  const handleCrear = () => {
    setUsuarioSeleccionado(null);
    setAbierto(true);
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setAbierto(true);
  };

  const handleAbiertoChange = (open: boolean) => {
    setAbierto(open);
    if (!open) {
      setUsuarioSeleccionado(null);
    }
  };

  const handleCambiarEstatus = async (id: string, activo: boolean) => {
    await cambiarEstatusUsuarioAction({ id, isActive: activo });
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button className="font-semibold" type="button" onClick={handleCrear}>
          <UserPlusIcon />
          Crear Usuario
        </Button>
      </div>
      <UsuariosForm
        abierto={abierto}
        onAbiertoChange={handleAbiertoChange}
        usuario={usuarioSeleccionado}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {usuarios.map((usuario) => (
          <UsuariosCard
            key={usuario.id}
            id={usuario.id}
            nombre={usuario.userName}
            correo={usuario.email}
            activo={usuario.isActive}
            rol={usuario.role}
            fechaAlta={new Date(usuario.createdAt).toLocaleDateString("es-MX")}
            onEditar={() => handleEditar(usuario)}
            onCambiarEstatus={(activo) =>
              handleCambiarEstatus(usuario.id, activo)
            }
          />
        ))}
      </div>
    </div>
  );
}
