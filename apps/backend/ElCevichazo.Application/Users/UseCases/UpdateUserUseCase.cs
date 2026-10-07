using ElCevichazo.Application.Users.DTOs;
using ElCevichazo.Application.Users.Interfaces;

namespace ElCevichazo.Application.Users.UseCases;

public class UpdateUserUseCase
{
    private readonly IUserRepository _userRespository;

    public UpdateUserUseCase (IUserRepository userRepository)
    {
        _userRespository = userRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _userRespository.GetByIdAsync(id);
        if (user is null)
            return false;

        user.UserName = request.UserName;
        user.Email = request.Email;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRespository.UpdateAsync(user);
        return true;
    }
}