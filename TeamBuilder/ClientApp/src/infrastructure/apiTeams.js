import * as api from "./apiBase";
import { Urls } from "./api"

export function getPage(params) {
    console.log(`teams.getPage`);
    return api.get(Urls.Teams.GetPage, params);
};

export function rejectedOrRemoveUser(data) {
    console.log(`teams.rejectedOrRemoveUser`);
    return api.post(Urls.Teams.RejectedOrRemoveUser, data);
};

export function cancelRequestUser(data) {
    console.log(`teams.cancelRequestUser`);
    return api.post(Urls.Teams.CancelRequestUser, data);
};

export function joinTeam(userId, teamId) {
    console.log(`users.joinTeam`);
    return api.get(Urls.Teams.JoinTeam, { userId: userId, teamId: teamId });
};