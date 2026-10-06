using ElCevichazo.Application.Auth.Interfaces;
using ElCevichazo.Application.Auth.DTOs;

namespace ElCevichazo.Application.Auth.UseCases;

public class GetUsersUseCase
{
    private readonly IUserRepository _userRepository;

    public GetUsersUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserListResponse>> ExecuteAsync()
    {
        var users = await _userRepository.GetAllAsync();

        return users.Select(u => new UserListResponse
        {
            Id = u.Id,
            UserName = u.UserName,
            Email = u.Email,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        }).ToList();
    }
}