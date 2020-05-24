import * as api from "./apiBase";
import { Urls } from "./urls"

export function pagingSearch(value) {
    console.log(`events.search ${value}`);
    return api.get(Urls.Events.PagingSearch, { search: value });
};

export function getPage(params = {}) {
    return api.get(Urls.Events.GetPage, params);
};

export function edit(data = {}) {
    return api.post(Urls.Events.Edit, data);
};