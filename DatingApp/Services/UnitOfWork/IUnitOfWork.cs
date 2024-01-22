using DatingApp.Services.LikeRepository;
using DatingApp.Services.MessageRepository;
using DatingApp.Services.PhotoRepository;
using DatingApp.Services.UserRepository;

namespace DatingApp.Services.UnitOfWork
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikeRepository LikeRepository { get; }
        IPhotoRepository PhotoRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
