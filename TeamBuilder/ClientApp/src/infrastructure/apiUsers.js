import * as api from "./apiBase";
import { Urls } from "./urls"

export function pagingSearch(value) {
    console.log(`users.search ${value}`);
    return api.get(Urls.Users.PagingSearch, {search: value});
};

export function getPage(params = {}) {
    return api.get(Urls.Users.GetPage, params);
};