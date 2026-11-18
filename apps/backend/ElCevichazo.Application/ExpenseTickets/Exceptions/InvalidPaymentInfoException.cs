namespace ElCevichazo.Application.ExpenseTickets.Exceptions;

public class InvalidPaymentInfoException : Exception
{
    public InvalidPaymentInfoException(string message)
        : base(message)
    {
    }
}
