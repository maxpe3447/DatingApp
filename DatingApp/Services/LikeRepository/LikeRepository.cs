using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Services.LikeRepository
{
    public class LikeRepository : ILikeRepository
    {
        private readonly DataContext _dataContext;

        public LikeRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _dataContext.Likes.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<PageList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _dataContext.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _dataContext.Likes.AsQueryable();

            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.TargetUser);
            }
            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.TargetUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }
            var likeUsers = users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(x=>x.IsMain).Url,
                City =user.City
            });

            return await PageList<LikeDto>.CreateAsync(likeUsers, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _dataContext.Users.Include(x => x.LikedUsers)
                                           .FirstOrDefaultAsync(x=>x.Id == userId);
        }
    }
}
