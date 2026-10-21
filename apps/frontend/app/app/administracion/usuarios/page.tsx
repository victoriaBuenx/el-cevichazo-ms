import { UsuariosGrid } from "@/components/usuarios/usuariosGrid";
import { getUsuarios } from "@/services/usuarios.service";

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
      <p className="text-sm text-muted-foreground">
        Administra las cuentas de acceso al sistema de caja y gestión del
        restaurante.
      </p>

      <UsuariosGrid usuarios={usuarios} />
    </div>
  );
}
