using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Helpers;
using DatingApp.Services.UserRepository;
using DatingApp.Services.MessageRepository;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using Microsoft.VisualBasic;
using DatingApp.Services.UnitOfWork;

namespace DatingApp.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public MessagesController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
        {
            var username = User.GetUsername();

            if (username == messageDto.RecipientUsername.ToLower())
            {
                return BadRequest("You can not send messages to yourself");
            }

            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(messageDto.RecipientUsername);

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

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<MessageDto>(message));
            }
            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PageList<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPage));

            return messages;
        }
        
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _unitOfWork.MessageRepository.GetMessage(id);

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
                _unitOfWork.MessageRepository.DeleteMessage(message);
            }

            if(await _unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Problem deleting the message");
        }
    }
}
