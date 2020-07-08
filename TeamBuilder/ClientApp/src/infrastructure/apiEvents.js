import * as api from "./apiBase";
import { Urls } from "./api"

export function getAll() {
    console.log(`events.getAll`);
    return api.get(Urls.Events.GetAll);
};