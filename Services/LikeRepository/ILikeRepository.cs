using DatingApp.DTOs;
using DatingApp.Entities;

namespace DatingApp.Services.LikeRepository
{
    public interface ILikeRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<UserLike> GetUserWithLikes(int userId);
        Task<IEnumerable<AppUser>> GetUserLikes(string predicate, int userId);
    }
}
