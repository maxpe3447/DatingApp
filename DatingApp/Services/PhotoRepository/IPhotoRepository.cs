using DatingApp.DTOs;
using DatingApp.Entities;

namespace DatingApp.Services.PhotoRepository
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhoto();
        Task<Photo> GetPhotoById(int id);
        void RemovedPhoto(Photo photo);
    }
}
