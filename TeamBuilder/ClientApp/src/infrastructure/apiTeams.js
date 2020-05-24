import * as api from "./apiBase";
import { Urls } from "./urls"

export function pagingSearch(value) {
    console.log(`teams.search ${value}`);
    return api.get(Urls.Teams.PagingSearch, {search: value});
};

export function getPage(params = {}) {
    console.log(`teams.getPage`);
    return api.get(Urls.Teams.GetPage, params = {});
};

export function rejectedOrRemoveUser(data) {
    console.log(`teams.rejectedOrRemoveUser`);
    return api.post(Urls.Teams.RejectedOrRemoveUser, data);
};