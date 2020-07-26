import * as api from "./apiBase";
import { Urls } from "./api"

export function rejectedOrRemoveUser(userId, teamId) {
    console.log(`teams.rejectedOrRemoveUser`);
    return api.post(Urls.Teams.RejectedOrRemoveUser, { userId, teamId });
};

export function cancelRequestUser(userId, teamId) {
    console.log(`teams.cancelRequestUser`);
    return api.post(Urls.Teams.CancelRequestUser, { userId, teamId });
};

export function joinTeam(userId, teamId) {
    console.log(`users.joinTeam`);
    return api.post(Urls.Teams.JoinTeam, { userId, teamId });
};