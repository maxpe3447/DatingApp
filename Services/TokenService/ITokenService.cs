using DatingApp.Entities;

namespace DatingApp.Services.TokenService
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
