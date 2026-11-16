import { TicketsGrid } from "@/components/tickets/ticketsGrid";

export default function TicketsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full min-w-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
        <p className="text-sm text-muted-foreground">
          Captura y consulta los tickets de gastos operativos, administra
          comprobantes y supervisa pagos en efectivo y transferencias bancarias.
        </p>
      </div>

      <TicketsGrid />
    </div>
  );
}
