using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Helpers;
using DatingApp.Services.UserRepositoryService;
using DatingApp.Services.MessageRepositoryService;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using Microsoft.VisualBasic;

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

            if (username == messageDto.RecipientUsername.ToLower())
            {
                return BadRequest("You can not send messages to yourself");
            }

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recipient = await _userRepository.GetUserByUsernameAsync(messageDto.RecipientUsername);

            if (recipient == null)
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

            if (await _messageRepository.SaveAllAsync())
            {
                return Ok(_mapper.Map<MessageDto>(message));
            }
            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PageList<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPage));

            return messages;
        }
        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _messageRepository.GetMessage(id);

            if(message.SenderUsername != username && message.RecipientUsername!= username)
            {
                return Unauthorized();
            }

            if(message.SenderUsername ==username)
            {
                message.SenderDeleted = true;
            }
            if(message.RecipientUsername ==username)
            {
                message.RecipientDeleted = true;
            }

            if(message.RecipientDeleted && message.SenderDeleted)
            {
                _messageRepository.DeleteMessage(message);
            }

            if(await _messageRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Problem deleting the message");
        }
    }
}
