using DatingApp.DTOs;
using DatingApp.Entities;

namespace DatingApp.Services.LikeRepository
{
    public interface ILikeRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId);
    }
}
