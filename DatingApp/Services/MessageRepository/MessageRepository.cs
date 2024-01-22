using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Services.MessageRepository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext dataContext,
                                 IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }

        public void AddGroup(Group group)
        {
           _dataContext.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            _dataContext.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _dataContext.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _dataContext.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _dataContext.Groups
                    .Include(x => x.Connections)
                    .Where(x=> x.Connections.Any(c=>c.ConnectionId == connectionId))
                    .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dataContext.Messages.FindAsync(id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _dataContext.Groups
                    .Include(x=>x.Connections)
                    .FirstOrDefaultAsync();
        }

        public async Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _dataContext.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username && !u.RecipientDeleted),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username && !u.SenderDeleted),
                _ => query.Where(u => u.RecipientUsername == messageParams.Username && !u.RecipientDeleted && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PageList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var query = _dataContext.Messages
                .Where(m => m.RecipientUsername == currentUsername && !m.RecipientDeleted &&
                            m.SenderUsername == recipientUsername ||
                            m.RecipientUsername == recipientUsername && !m.SenderDeleted &&
                            m.SenderUsername == currentUsername)
                .OrderBy(m => m.MessageSent)
                .AsQueryable();

            var unreadMessages = query.Where(m => m.DateRead == null &&
                                               m.RecipientUsername == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
            }

            return await query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider).ToListAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            _dataContext.Connections.Remove(connection);
        }
    }
}
