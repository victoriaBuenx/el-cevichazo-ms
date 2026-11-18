namespace ElCevichazo.Application.ExpenseTickets.Exceptions;

public class SupplierNotFoundException : Exception
{
    public SupplierNotFoundException(string message = "El proveedor asociado no existe.")
        : base(message)
    {
    }
}
