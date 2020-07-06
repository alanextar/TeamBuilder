import * as api from "./apiBase";
import { Urls } from "./api"

export function getPage(params) {
    console.log(`users.getPage`);
    return api.get(Urls.Users.GetPage, params);
};

export function saveOrConfirm(data) {
    console.log(`users.saveOrConfirm`);
    return api.post(Urls.Users.SaveOrConfirm, data);
};

export function checkConfirmation(id) {
    console.log(`users.checkConfirmation`);
    return api.get(Urls.Users.CheckConfirmation, { id: id });
};

export function getSkills(id) {
    console.log(`users.getSkills`);
    return api.get(Urls.Users.GetSkills, { id: id });
};

export function getTeams(id) {
    console.log(`users.getTeams`);
    return api.get(Urls.Users.GetTeams, { id: id });
};

export function getRecruitTeams(vkProfileId, id) {
    console.log(`users.getRecruitTeams`);
    return api.get(Urls.Users.GetRecruitTeams, { vkProfileId: vkProfileId, id: id });
};

export function joinTeam(teamId) {
    console.log(`users.joinTeam`);
    return api.get(Urls.Users.JoinTeam, { teamId: teamId });
};

export function quitOrDeclineTeam(teamId) {
    console.log(`users.quitOrDeclineTeam`);
    return api.get(Urls.Users.QuitOrDeclineTeam, { teamId: teamId });
};

export function cancelRequestTeam(teamId) {
    console.log(`users.cancelRequestTeam`);
    return api.get(Urls.Users.CancelRequestTeam, { teamId: teamId });
};

export function setTeam(id, teamId, isTeamOffer) {
    console.log(`users.setTeam`);
    return api.get(Urls.Users.SetTeam, { id: id, teamId: teamId, isTeamOffer: isTeamOffer });
};

export function getOwnerTeams(id) {
    console.log(`users.getOwnerTeams`);
    return api.get(Urls.Users.GetOwnerTeams, { id: id });
};
