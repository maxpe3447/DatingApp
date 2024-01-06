using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Services.RepositoryService
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
        public void AddMessage(Message message)
        {
            _dataContext.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _dataContext.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dataContext.Messages.FindAsync(id);
        }

        public async Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _dataContext.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username),
                _ => query.Where(u => u.RecipientUsername == messageParams.Username && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PageList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int RecipientId)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}
