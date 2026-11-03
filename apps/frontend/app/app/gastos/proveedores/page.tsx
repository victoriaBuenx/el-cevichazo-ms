import { ProveedoresGrid } from "@/components/proveedores/proveedoresGrid";
import { getProveedores } from "@/services/proveedores.service";

export default async function ProveedoresPage() {
  const proveedores = await getProveedores();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
        <p className="text-sm text-muted-foreground">
          Administra el catálogo de proveedores, monitorea saldos por liquidar y
          el gasto acumulado del mes.
        </p>
      </div>

      <ProveedoresGrid proveedores={proveedores} />
    </div>
  );
}
