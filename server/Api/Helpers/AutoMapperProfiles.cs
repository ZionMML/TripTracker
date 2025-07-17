using Api.DTOs;
using Api.Models;
using AutoMapper;

namespace Api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<ApplicationUser, UserDto>();
            CreateMap<UpdateUserDto, ApplicationUser>()
                .ForMember(dest => dest.LastActive, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<CreateUserDto, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Created, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.LastActive, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(
                    dest => dest.DateOfBirth,
                    opt => opt.MapFrom(src => DateOnly.FromDateTime(src.DateOfBirth))
                );
            CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
            CreateMap<DateTime, DateTime>()
                .ConstructUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>()
                .ConvertUsing(d =>
                    d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null
                );
        }
    }
}
