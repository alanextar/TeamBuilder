import { Urls } from "./urls";
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
        edit: (data) => events.edit(data)
    };
    
    static Teams = {
        pagingSearch: (value) => teams.pagingSearch(value),
        getPage: () => teams.getPage(),
        rejectedOrRemoveUser: (data) => teams.rejectedOrRemoveUser(data)
    };

    static get = (url, params = {}) => api.get(url, params);
    static post = (url, data = {}) => api.post(url, data);
}