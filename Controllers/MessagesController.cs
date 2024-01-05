using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Services.Repository;
using DatingApp.Services.RepositoryService;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;

namespace DatingApp.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;

        public MessagesController(IUserRepository userRepository,
                                  IMessageRepository messageRepository,
                                  IMapper mapper)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
        {
            var username = User.GetUsername();

            if(username == messageDto.RecipientUsername.ToLower())
            {
                return BadRequest("You can not send messages to yourself");
            }

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recipient = await _userRepository.GetUserByUsernameAsync(messageDto.RecipientUsername);

            if(recipient == null)
            {
                return NotFound();
            }
            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = messageDto.Content
            };

            _messageRepository.AddMessage(message);

            if(await _messageRepository.SaveAllAsync())
            {
                return Ok(_mapper.Map<MessageDto>(message));
            }
            return BadRequest("Failed to send message");
        }

    }
}
