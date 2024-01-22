﻿using DatingApp.Extensions;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public byte[] PasswordSalt { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string KnownAs {  get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive {  get; set; }
        public string Gender {  get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public List<Photo> Photos { get; set; } = new();
        public List<UserLike> LikedByUsers { get; set; } = new();
        public List<UserLike> LikedUsers { get; set; } = new();
        public List<Message> MessagesSent { get; set; }
        public List<Message> MessagesReceived { get; set; }
        public int GetAge() => DateOfBirth.CalculateAge();
        public ICollection<AppUserRole> UserRoles { get; set; }

    }
}