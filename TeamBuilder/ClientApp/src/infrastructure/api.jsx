import * as api from "./apiBase";
import * as users from "./apiUsers";
import * as teams from "./apiTeams";
import * as events from "./apiEvents";

export class Api {

    static Users = {
        pagingSearch: (value, filter = {}) => users.pagingSearch(value, filter),
        getPage: (params = {}) => users.getPage(params),
        confirm: (data) => users.confirm(data),
        checkConfirmation: (id) => users.checkConfirmation(id),
        getSkills: (id) => users.getSkills(id),
        getTeams: (id) => users.getTeams(id),
        get: (id) => users.get(id),
        getRecruitTeams: (vkProfileId, id) => users.getRecruitTeams(vkProfileId, id),
        edit: (data) => users.edit(data),
        joinTeam: (userId, teamId) => users.joinTeam(userId, teamId),
        quitOrDeclineTeam: (userId, teamId) => users.quitOrDeclineTeam(userId, teamId),
        setTeam: (id, teamId, isTeamOffer) => users.setTeam(id, teamId, isTeamOffer),
        getOwnerTeams: (id) => users.getOwnerTeams(id)
    };

    static Events = {
        pagingSearch: (value) => events.pagingSearch(value),
        getPage: () => events.getPage(),
        getAll: () => events.getAll(),
        get: (id) => events.get(id),
        create: (data) => events.create(data),
        edit: (data) => events.edit(data),
        delete: (data) => events.remove(data)
    };
    
    static Teams = {
        pagingSearch: (value, filter = {}) => teams.pagingSearch(value, filter),
        getPage: (params = {}) => teams.getPage(params),
        get: (id) => teams.get(id),
        create: async (data) => await teams.create(data),
        edit: (data) => teams.edit(data),
        delete: (data) => teams.remove(data),
        rejectedOrRemoveUser: (data) => teams.rejectedOrRemoveUser(data),
        cancelRequestUser: (data) => teams.cancelRequestUser(data),
        joinTeam: (userId, teamId) => teams.joinTeam(userId, teamId),
    };

    static get = (url, params = {}) => api.get(url, params);
    static post = (url, data = {}) => api.post(url, data);
}

export class Urls {
    static baseUrl = '';
    static prefix = 'api';
    static teamsStr = 'teams';
    static userStr = 'user';
    static eventStr = 'event';

    static Teams = {
        Get: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/get`,
        GetAll: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/getAll`,
        GetPage: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/getPage`,
        Create: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/create`,
        Delete: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/delete`,
        Edit: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/edit`,
        PagingSearch: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/pagingSearch`,
        RejectedOrRemoveUser: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/rejectedOrRemoveUser`,
        CancelRequestUser: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/cancelRequestUser`
    };

    static Users = {
        Get: `${this.baseUrl}/${this.prefix}/${this.userStr}/get`,
        GetAll: `${this.baseUrl}/${this.prefix}/${this.userStr}/getAll`,
        GetPage: `${this.baseUrl}/${this.prefix}/${this.userStr}/getPage`,
        Edit: `${this.baseUrl}/${this.prefix}/${this.userStr}/edit`,
        PagingSearch: `${this.baseUrl}/${this.prefix}/${this.userStr}/pagingSearch`,
        Confirm: `${this.baseUrl}/${this.prefix}/${this.userStr}/confirm`,
        CheckConfirmation: `${this.baseUrl}/${this.prefix}/${this.userStr}/checkConfirmation`,
        GetRecruitTeams: `${this.baseUrl}/${this.prefix}/${this.userStr}/getRecruitTeams`,
        GetSkills: `${this.baseUrl}/${this.prefix}/${this.userStr}/getSkills`,
        GetTeams: `${this.baseUrl}/${this.prefix}/${this.userStr}/getTeams`,
        JoinTeam: `${this.baseUrl}/${this.prefix}/${this.userStr}/joinTeam`,
        QuitOrDeclineTeam: `${this.baseUrl}/${this.prefix}/${this.userStr}/quitOrDeclineTeam`,
        SetTeam: `${this.baseUrl}/${this.prefix}/${this.userStr}/setTeam`,
        GetOwnerTeams: `${this.baseUrl}/${this.prefix}/${this.userStr}/getOwnerTeams`
    };

    static Events = {
        Get: `${this.baseUrl}/${this.prefix}/${this.eventStr}/get`,
        GetAll: `${this.baseUrl}/${this.prefix}/${this.eventStr}/getall`,
        GetPage: `${this.baseUrl}/${this.prefix}/${this.eventStr}/getPage`,
        Create: `${this.baseUrl}/${this.prefix}/${this.eventStr}/create`,
        Delete: `${this.baseUrl}/${this.prefix}/${this.eventStr}/delete`,
        Edit: `${this.baseUrl}/${this.prefix}/${this.eventStr}/edit`,
        PagingSearch: `${this.baseUrl}/${this.prefix}/${this.eventStr}/pagingSearch`
    };
}