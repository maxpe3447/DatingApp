using DatingApp.Services.LikeRepository;
using DatingApp.Services.MessageRepository;
using DatingApp.Services.UserRepository;

namespace DatingApp.Services.UnitOfWork
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikeRepository LikeRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
