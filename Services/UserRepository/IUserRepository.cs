using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Services.UserRepository;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser> GetByIdAsync(int id);
    Task<AppUser> GetUserByUsernameAsync(string username);
    Task<PageList<MemberDto>> GetMemberAsync(UserParams userParams);
    Task<MemberDto> GetMemberAsync(string username);
}
