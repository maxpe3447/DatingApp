using DatingApp.Data;
using DatingApp.Helpers;
using DatingApp.Services.LikeRepository;
using DatingApp.Services.PhotoService;
using DatingApp.Services.UserRepository;
using DatingApp.Services.MessageRepository;
using DatingApp.Services.TokenService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.Json.Serialization;
using DatingApp.SignalR;
using DatingApp.Services.UnitOfWork;

namespace DatingApp.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(
            this IServiceCollection services, 
                 IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddSignalR();
            services.AddSingleton<PresenceTracker>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            return services;
        }
    }
}
