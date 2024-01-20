using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Services.PhotoRepository
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _dataContext;

        public PhotoRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<Photo> GetPhotoById(int id)
        {
            return await _dataContext.Photos.IgnoreQueryFilters()
                                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhoto()
        {
            return await _dataContext.Photos.IgnoreQueryFilters()
                                            .Where(p => !p.IsApproved)
                                            .Select(p => new PhotoForApprovalDto
                                            {
                                                Id = p.Id,
                                                Username = p.AppUser.UserName,
                                                Url = p.Url,
                                                IsApproved = p.IsApproved
                                            }).ToListAsync();
        }

        public void RemovedPhoto(Photo photo)
        {
            _dataContext.Photos.Remove(photo);
        }
    }
}
