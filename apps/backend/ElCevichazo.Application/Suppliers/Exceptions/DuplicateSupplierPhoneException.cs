namespace ElCevichazo.Application.Suppliers.Exceptions;

public class DuplicateSupplierPhoneException : Exception
{
    public DuplicateSupplierPhoneException()
        : base("El número de teléfono ya está registrado.")
    {
    }
}
