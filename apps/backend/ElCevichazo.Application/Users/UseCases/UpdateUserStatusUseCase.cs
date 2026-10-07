using ElCevichazo.Application.Users.DTOs;
using ElCevichazo.Application.Users.Interfaces;

namespace ElCevichazo.Application.Users.UseCases;

public class UpdateUserStatusUseCase
{
    private readonly IUserRepository _userRepository;

    public UpdateUserStatusUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id, UpdateUserStatusRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
            return false;
        
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        return true;
    }
}