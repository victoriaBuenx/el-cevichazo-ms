using ElCevichazo.Application.Users.DTOs;
using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Application.Users.Exceptions;

namespace ElCevichazo.Application.Users.UseCases;

public class UpdateUserUseCase
{
    private readonly IUserRepository _userRepository;

    public UpdateUserUseCase (IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user is null)
            return false;

        var emailExists = await _userRepository.ExistsByEmailAsync(
            request.Email,
            id
        );

        if (emailExists)
            throw new DuplicateUserEmailException();

        user.UserName = request.UserName;
        user.Email = request.Email;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
        return true;
    }
}