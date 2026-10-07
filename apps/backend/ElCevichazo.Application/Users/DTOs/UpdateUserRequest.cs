using System.ComponentModel.DataAnnotations;
namespace ElCevichazo.Application.Users.DTOs;

public class UpdateUserRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email {get; set;} = string.Empty;
    [Required]
    [MaxLength(100)]
    public string UserName {get; set;} = string.Empty;
}