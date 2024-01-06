using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Services.RepositoryService
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _dataContext;

        public MessageRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
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

        public Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            throw new NotImplementedException();
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
