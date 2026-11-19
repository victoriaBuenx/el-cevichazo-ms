import { TicketsGrid } from "@/components/tickets/ticketsGrid";
import { getTickets } from "@/services/tickets.service";
import { getProveedores } from "@/services/proveedores.service";

export default async function TicketsPage() {
  const [tickets, proveedores] = await Promise.all([
    getTickets().catch(() => []),
    getProveedores().catch(() => []),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-full min-w-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
        <p className="text-sm text-muted-foreground">
          Captura y consulta los tickets de gastos operativos, administra
          comprobantes y supervisa pagos en efectivo y transferencias bancarias.
        </p>
      </div>

      <TicketsGrid initialTickets={tickets} proveedores={proveedores} />
    </div>
  );
}
