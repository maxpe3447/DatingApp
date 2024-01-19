using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Helpers;
using DatingApp.Services.LikeRepository;
using DatingApp.Services.UnitOfWork;
using DatingApp.Services.UserRepository;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public LikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _unitOfWork.LikeRepository.GetUserWithLikes(sourceUserId);

            if (likedUser == null)
            {
                return NotFound();
            }
            if (sourceUser.UserName == username)
            {
                return BadRequest("You cannot like yourself");
            }
            var userLike = await _unitOfWork.LikeRepository.GetUserLike(sourceUserId, likedUser.Id);
            if (userLike != null)
            {
                return BadRequest("You already like this user");
            }
            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };
            sourceUser.LikedUsers.Add(userLike);
            if (await _unitOfWork.Complete())
            {
                return Ok();
            }
            return BadRequest("Failed to like user");
        }
        [HttpGet]
        public async Task<ActionResult<PageList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users = await _unitOfWork.LikeRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPage));

            return Ok(users);
        }
    
    }
}
