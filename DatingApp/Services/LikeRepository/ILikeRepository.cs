using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Services.LikeRepository
{
    public interface ILikeRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<PageList<LikeDto>> GetUserLikes(LikesParams likesParams);
    }
}
