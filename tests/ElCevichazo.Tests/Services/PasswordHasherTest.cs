using ElCevichazo.Application.Interfaces;
using ElCevichazo.Infrastructure.Services;

namespace ElCevichazo.Tests.Services;

public class PasswordHasherTest
{
    private readonly PasswordHasher _passwordHasher = new();

    [Fact]
    public void Hash_ShouldReturnDifferentValueFromPassword(){
        const string password = "Password123";
        var hash = _passwordHasher.HashPassword(password);
        Assert.NotEqual(password, hash);
    }

    [Fact]
    public void Hash_ShouldGenerateDifferentHashesForSamePassword(){
        const string password= "Password123";
        var hash1 = _passwordHasher.HashPassword(password);
        var hash2 = _passwordHasher.HashPassword(password);
        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void Hash_ShouldReturnTrueForCorrectPassword()
    {
        const string password= "Password123";
        var hash = _passwordHasher.HashPassword(password);
        var result = _passwordHasher.VerifyPassword(password, hash);
        Assert.True(result);

    }

    [Fact]
    public void Hash_ShouldReturnFalseForIncorrectPassword()
    {
        const string password = "Password123";
        const string wrongPassword = "WrongPassword";

        var hash = _passwordHasher.HashPassword(password);
        var result = _passwordHasher.VerifyPassword(wrongPassword, hash);
        Assert.False(result);

    }
}