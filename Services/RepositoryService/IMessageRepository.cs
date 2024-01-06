using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;

namespace DatingApp.Services.RepositoryService
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int RecipientId);
        Task<bool> SaveAllAsync();
    }
}
