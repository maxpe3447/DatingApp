using AutoMapper;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Helpers;
using DatingApp.Services.PhotoService;
using DatingApp.Services.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _unitOfWork;

        public UsersController(IMapper mapper,
                               IPhotoService photoService,
                               IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<PageList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {

            var currentUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = currentUser.UserName;

            if (string.IsNullOrEmpty(currentUser.Gender))
            {
                userParams.Gender = currentUser.Gender == "male" ? "female" : "male";
            }

            var users = await _unitOfWork.UserRepository.GetMemberAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,
                users.PageSize, users.TotalCount, users.TotalPage));

            return Ok(users);
        }
        [Authorize(Roles = "Member")]
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _unitOfWork.UserRepository.GetMemberAsync(username);
        }

        [HttpPut()]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null)
            {
                return NotFound();
            }

            _mapper.Map(memberUpdateDto, user);

            if (await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Faild to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null)
            {
                return NotFound();
            }

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUri.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _unitOfWork.Complete())
            {
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null)
            {
                return NotFound();
            }
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null)
            {
                return NotFound();
            }
            if (photo.IsMain)
            {
                return BadRequest("This is already your photo");
            }

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMain != null)
            {
                currentMain.IsMain = false;
            }
            photo.IsMain = true;

            if (await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Problem setting the main Photo!");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null)
            {
                return NotFound();
            }
            if (photo.IsMain)
            {
                return BadRequest("You cannot delete your main photo!");
            }
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            user.Photos.Remove(photo);

            if (await _unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Problem deleting photo");
        }
    }
}
