using System.Numerics;

namespace DatingApp.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int ItemPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
