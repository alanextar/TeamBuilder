import * as apiMethods from "./commonApiMethods";
import * as api from "./apiBase";
import * as users from "./apiUsers";
import * as teams from "./apiTeams";
import * as events from "./apiEvents";
import * as skills from "./apiSkills";

export class Api {

	static Users = {
		pagingSearch: (value, filter = {}) => apiMethods.pagingSearch(Urls.Users.PagingSearch, value, filter),
		saveOrConfirm: (data) => users.saveOrConfirm(data),
		checkConfirmation: (id) => users.checkConfirmation(id),
		getSkills: (id) => users.getSkills(id),
		getTeams: (id) => users.getTeams(id),
		get: (id) => apiMethods.get(Urls.Users.Get, id),
		getRecruitTeams: (vkProfileId, id) => users.getRecruitTeams(vkProfileId, id),
		edit: (data) => apiMethods.edit(Urls.Users.Edit, data),
		joinTeam: (teamId) => users.joinTeam(teamId),
		quitOrDeclineTeam: (teamId) => users.quitOrDeclineTeam(teamId),
		cancelRequestTeam: (teamId) => users.cancelRequestTeam(teamId),
		setTeam: (id, teamId, isTeamOffer) => users.setTeam(id, teamId, isTeamOffer),
		getOwnerTeams: (id) => users.getOwnerTeams(id)
	};

	static Events = {
		pagingSearch: (value, filter = {}) => apiMethods.pagingSearch(Urls.Events.PagingSearch, value, filter),
		getAll: () => events.getAll(),
		get: (id) => apiMethods.get(Urls.Events.Get, id),
		create: (data) => apiMethods.create(Urls.Events.Create, data),
		edit: (data) => apiMethods.edit(Urls.Events.Edit, data),
		delete: (id) => apiMethods.Delete(Urls.Events.Delete, id)
	};

	static Teams = {
		pagingSearch: (value, filter = {}) =>
			apiMethods.pagingSearch(Urls.Teams.PagingSearch, value, filter),
		get: (id) =>
			apiMethods.get(Urls.Teams.Get, id),
		create: (data) =>
			apiMethods.create(Urls.Teams.Create, data),
		edit: (data) =>
			apiMethods.edit(Urls.Teams.Edit, data),
		delete: (id) =>
			apiMethods.Delete(Urls.Teams.Delete, id),
		rejectedOrRemoveUser: (userId, teamId) =>
			teams.rejectedOrRemoveUser(userId, teamId),
		cancelRequestUser: (userId, teamId) =>
			teams.cancelRequestUser(userId, teamId),
		joinTeam: (userId, teamId) =>
			teams.joinTeam(userId, teamId),
	};

	static Skills = {
		getAll: () => skills.getAll(),
	};

	static get = (url, params = {}) => api.get(url, params);
	static post = (url, data = {}) => api.post(url, data);
}

export class Urls {
	static baseUrl = '';
	static prefix = 'api';

	static teamsController = 'teams';
	static userController = 'user';
	static eventController = 'event';
	static skillController = 'skill';

	static Teams = {
		Get: `${this.baseUrl}/${this.prefix}/${this.teamsController}/get`,
		GetAll: `${this.baseUrl}/${this.prefix}/${this.teamsController}/getAll`,
		Create: `${this.baseUrl}/${this.prefix}/${this.teamsController}/create`,
		Delete: `${this.baseUrl}/${this.prefix}/${this.teamsController}/delete`,
		Edit: `${this.baseUrl}/${this.prefix}/${this.teamsController}/edit`,
		PagingSearch: `${this.baseUrl}/${this.prefix}/${this.teamsController}/pagingSearch`,
		RejectedOrRemoveUser: `${this.baseUrl}/${this.prefix}/${this.teamsController}/rejectedOrRemoveUser`,
		CancelRequestUser: `${this.baseUrl}/${this.prefix}/${this.teamsController}/cancelRequestUser`,
		JoinTeam: `${this.baseUrl}/${this.prefix}/${this.teamsController}/joinTeam`,
	};

	static Users = {
		Get: `${this.baseUrl}/${this.prefix}/${this.userController}/get`,
		GetAll: `${this.baseUrl}/${this.prefix}/${this.userController}/getAll`,
		Edit: `${this.baseUrl}/${this.prefix}/${this.userController}/edit`,
		PagingSearch: `${this.baseUrl}/${this.prefix}/${this.userController}/pagingSearch`,
		SaveOrConfirm: `${this.baseUrl}/${this.prefix}/${this.userController}/saveOrConfirm`,
		CheckConfirmation: `${this.baseUrl}/${this.prefix}/${this.userController}/checkConfirmation`,
		GetRecruitTeams: `${this.baseUrl}/${this.prefix}/${this.userController}/getRecruitTeams`,
		GetSkills: `${this.baseUrl}/${this.prefix}/${this.userController}/getSkills`,
		GetTeams: `${this.baseUrl}/${this.prefix}/${this.userController}/getTeams`,
		JoinTeam: `${this.baseUrl}/${this.prefix}/${this.userController}/joinTeam`,
		QuitOrDeclineTeam: `${this.baseUrl}/${this.prefix}/${this.userController}/quitOrDeclineTeam`,
		CancelRequestTeam: `${this.baseUrl}/${this.prefix}/${this.userController}/cancelRequestTeam`,
		SetTeam: `${this.baseUrl}/${this.prefix}/${this.userController}/setTeam`,
		GetOwnerTeams: `${this.baseUrl}/${this.prefix}/${this.userController}/getOwnerTeams`
	};

	static Events = {
		Get: `${this.baseUrl}/${this.prefix}/${this.eventController}/get`,
		GetAll: `${this.baseUrl}/${this.prefix}/${this.eventController}/getall`,
		Create: `${this.baseUrl}/${this.prefix}/${this.eventController}/create`,
		Delete: `${this.baseUrl}/${this.prefix}/${this.eventController}/delete`,
		Edit: `${this.baseUrl}/${this.prefix}/${this.eventController}/edit`,
		PagingSearch: `${this.baseUrl}/${this.prefix}/${this.eventController}/pagingSearch`
	};

	static Skills = {
		GetAll: `${this.baseUrl}/${this.prefix}/${this.skillController}/getall`,
	};
}