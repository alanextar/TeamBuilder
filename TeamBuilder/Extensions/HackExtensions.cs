using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Extensions
{
	public static class HackExtensions
	{
		public static Page<UserDtoForList> HackForReferenceLoop(this Page<User> users)
		{
			var converted = users.Collection.HackForReferenceLoop();
			return new Page<UserDtoForList>(converted, users.NextHref);
		}

		public static IEnumerable<UserDtoForList> HackForReferenceLoop(this IEnumerable<User> users)
		{
			var config = new MapperConfiguration(cfg => cfg.CreateMap<User, UserDtoForList>()
				.ForMember(
					"Skills",
					opt => opt.MapFrom(src => src.UserSkills.Select(ConvertSkill).ToList())
				)
				.ForMember(
					"IsTeamMember",
					opt => opt.MapFrom(src => src.UserTeams.Any(ut => ut.IsOwner || ut.UserAction == UserActionEnum.JoinedTeam))
				)
			);
			var mapper = new Mapper(config);
			return users.Select(user => mapper.Map<User, UserDtoForList>(user));
		}

		private static UserTeamDto ConvertTeam(UserTeam userTeam)
		{
			var config = new MapperConfiguration(cfg => cfg.CreateMap<UserTeam, UserTeamDto>()
				.ForMember(
					"Id",
					opt => opt.MapFrom(src => src.Team.Id))
				.ForMember(
					"Description",
					opt => opt.MapFrom(src => src.Team.Description))
				.ForMember(
					"Link",
					opt => opt.MapFrom(src => src.Team.Link))
				.ForMember(
					"Photo100",
					opt => opt.MapFrom(src => src.Team.Photo100))
				.ForMember(
					"Photo200",
					opt => opt.MapFrom(src => src.Team.Photo200))
				.ForMember(
					"NumberRequiredMembers",
					opt => opt.MapFrom(src => src.Team.NumberRequiredMembers))
				.ForMember(
					"DescriptionRequiredMembers",
					opt => opt.MapFrom(src => src.Team.DescriptionRequiredMembers))
			);
			var mapper = new Mapper(config);
			return mapper.Map<UserTeam, UserTeamDto>(userTeam);
		}

		private static SkillDto ConvertSkill(UserSkill userSkill)
		{
			var skill = userSkill.Skill;
			var config = new MapperConfiguration(cfg => cfg.CreateMap<Skill, SkillDto>());
			var mapper = new Mapper(config);
			return mapper.Map<Skill, SkillDto>(skill);
		}
	}
}
