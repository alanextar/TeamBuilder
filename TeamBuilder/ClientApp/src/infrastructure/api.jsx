import * as api from "./apiBase";
import * as users from "./apiUsers";
import * as teams from "./apiTeams";
import * as events from "./apiEvents";

export class Api {

    static Users = {
        pagingSearch: (value) => users.pagingSearch(value),
        getPage: () => users.getPage()
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
        pagingSearch: (value) => teams.pagingSearch(value),
        getPage: () => teams.getPage(),
        get: (id) => teams.get(id),
        create: (data) => teams.create(data),
        edit: (data) => teams.edit(data),
        delete: (data) => teams.remove(data),
        rejectedOrRemoveUser: (data) => teams.rejectedOrRemoveUser(data)
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
        RejectedOrRemoveUser: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/rejectedOrRemoveUser`
    };

    static Users = {
        Get: `${this.baseUrl}/${this.prefix}/${this.userStr}/get`,
        GetAll: `${this.baseUrl}/${this.prefix}/${this.userStr}/getAll`,
        GetPage: `${this.baseUrl}/${this.prefix}/${this.userStr}/getPage`,
        Edit: `${this.baseUrl}/${this.prefix}/${this.userStr}/edit`,
        PagingSearch: `${this.baseUrl}/${this.prefix}/${this.userStr}/pagingSearch`,
        Confirm: `${this.baseUrl}/${this.prefix}/${this.userStr}/confirm`,
        CheckConfirmation: `${this.baseUrl}/${this.prefix}/${this.userStr}/checkConfirmation`,
        GetSkills: `${this.baseUrl}/${this.prefix}/${this.userStr}/getSkills`,
        GetTeams: `${this.baseUrl}/${this.prefix}/${this.userStr}/getTeams`,
        JoinTeam: `${this.baseUrl}/${this.prefix}/${this.userStr}/joinTeam`,
        QuitOrDeclineTeam: `${this.baseUrl}/${this.prefix}/${this.userStr}/quitOrDeclineTeam`,
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