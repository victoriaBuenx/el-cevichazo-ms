namespace ElCevichazo.Application.Users.Exceptions;

public class DuplicateUserEmailException : Exception
{
    public DuplicateUserEmailException()
        : base("Ya existe un usuario con ese correo electrónico.")
    {
    }
}