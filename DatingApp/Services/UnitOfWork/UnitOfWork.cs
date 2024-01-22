using AutoMapper;
using DatingApp.Data;
using DatingApp.Services.LikeRepository;
using DatingApp.Services.MessageRepository;
using DatingApp.Services.PhotoRepository;
using DatingApp.Services.UserRepository;

namespace DatingApp.Services.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;

        public UnitOfWork(DataContext dataContext, 
                          IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }
        public IUserRepository UserRepository => new UserRepository.UserRepository(_dataContext, _mapper);

        public IMessageRepository MessageRepository => new MessageRepository.MessageRepository(_dataContext, _mapper);

        public ILikeRepository LikeRepository => new LikeRepository.LikeRepository(_dataContext);

        public IPhotoRepository PhotoRepository => new PhotoRepository.PhotoRepository(_dataContext);

        public async Task<bool> Complete()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _dataContext.ChangeTracker.HasChanges();
        }
    }
}
