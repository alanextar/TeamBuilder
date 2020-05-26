import * as api from "./apiBase";
import { Urls } from "./api"

export function pagingSearch(value, filter) {
    console.log(`users.search ${value}`);
    let search = {search: value};
    return api.get(Urls.Users.PagingSearch, {...search, ...filter});
};

export function getPage(params) {
    return api.get(Urls.Users.GetPage, params);
};

export function confirm(data) {
    return api.post(Urls.Users.Confirm, data);
};

export function checkConfirmation(id) {
    return api.get(Urls.Users.CheckConfirmation, {id: id});
};

export function getSkills(id) {
    return api.get(Urls.Users.GetSkills, {id: id});
};

export function getTeams(id) {
    return api.get(Urls.Users.GetTeams, {id: id});
};

export function get(id) {
    return api.get(Urls.Users.Get, {id: id});
};

export function edit(data) {
    return api.post(Urls.Users.Edit, data);
};

export function joinTeam(userId, teamId) {
    return api.get(Urls.Users.JoinTeam, {id: userId, teamId: teamId});
};

export function quitOrDeclineTeam(userId, teamId) {
    return api.get(Urls.Users.QuitOrDeclineTeam, {id: userId, teamId: teamId});
};

export function setTeam(userId, teamId) {
    return api.get(Urls.Users.SetTeam, {id: userId, teamId: teamId});
};

export function getOwnerTeams(id) {
    return api.get(Urls.Users.GetOwnerTeams, {id: id});
};
