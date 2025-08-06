using Api.DTOs;
using API.DTOs;
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
            CreateMap<ApplicationUser, UserDto>()
                .ForMember(
                    dest => dest.ProfilePhotoUrl,
                    opt =>
                        opt.MapFrom(src => src.ProfilePhoto != null ? src.ProfilePhoto.Url : null)
                )
                .ForMember(
                    dest => dest.ProfilePhotoId,
                    opt =>
                        opt.MapFrom(src =>
                            src.ProfilePhoto != null ? src.ProfilePhoto.Id : (int?)null
                        )
                )
                .ForMember(dest => dest.Trips, opt => opt.MapFrom(src => src.Trips));

            CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
            CreateMap<DateTime, DateTime>()
                .ConstructUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>()
                .ConvertUsing(d =>
                    d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null
                );
            CreateMap<DateTime, DateOnly>().ConvertUsing(dt => DateOnly.FromDateTime(dt));

            CreateMap<ProfilePhoto, PhotoDto>();
            CreateMap<TripPhoto, PhotoDto>();

            CreateMap<Trip, TripDto>()
                .ForMember(
                    dest => dest.KnownAs,
                    opt => opt.MapFrom(src => src.User != null ? src.User.KnownAs : null)
                );
            CreateMap<CreateTripDto, Trip>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(_ => DateTime.UtcNow));
            CreateMap<UpdateTripDto, Trip>()
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }
}
