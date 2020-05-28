import * as api from "./apiBase";
import { Urls } from "./api"

export function getAll() {
    console.log(`skills.getAll`);
    return api.get(Urls.Skills.GetAll);
};