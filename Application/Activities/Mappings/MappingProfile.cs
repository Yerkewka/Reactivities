using System.Linq;
using Application.Activities.Dto;
using Application.Activities.Resolvers;
using AutoMapper;
using Domain;

namespace Application.Activities.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(d => d.Username, o =>
                    o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName, o =>
                    o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Image, o =>
                    o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(s => s.Following, o => o.MapFrom<FollowingResolver>());
        }
    }
}