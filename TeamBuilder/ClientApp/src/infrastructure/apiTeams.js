import * as api from "./apiBase";
import { Urls } from "./api"

export function pagingSearch(value, filter) {
    console.log(`teams.search ${value}`);
    let search = {search: value};
    return api.get(Urls.Teams.PagingSearch, {...search, ...filter});
};

export function getPage(params) {
    console.log(`teams.getPage`);
    return api.get(Urls.Teams.GetPage, params);
};

export function get(id) {
    console.log(`teams.get id: '${id}'`);
    return api.get(Urls.Teams.Get, {id: id});
};

export async function create(data) {
    console.log(`teams.create`);
    return await api.post(Urls.Teams.Create, data);
};

export function edit(data) {
    console.log(`teams.edit`);
    return api.post(Urls.Teams.Edit, data);
};

export function Delete(id) {
    console.log(`teams.Delete id: '${id}'`);
    return api.Delete(Urls.Teams.Delete, {id: id});
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