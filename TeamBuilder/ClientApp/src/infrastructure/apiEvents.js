import * as api from "./apiBase";
import { Urls } from "./api"

export function getPage(params = {}) {
    console.log(`events.getPage`);
    return api.get(Urls.Events.GetPage, params);
};

export function getAll() {
    console.log(`events.getAll`);
    return api.get(Urls.Events.GetAll);
};