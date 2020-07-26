import { store } from "../index";
import { goBack } from "../store/router/actions";
import { Api } from '../infrastructure/api';

//TODO рефакторинг обновления профиля после выполнения действий по команде

//Подать заявку в команду
export const sendRequest = async (teamId) => {
	let userId = store.getState().user.profileUser.id;
	let isTeamOffer = false;

	let updatedTeam = await Api.Users.setTeam(userId, teamId, isTeamOffer);
	return updatedTeam;
};

//Удалить команду
export const deleteTeam = async (teamId) => {
	await Api.Teams.delete(teamId);
	store.dispatch(goBack());
};

//Выйти из команды / отклонить приглашение
export const dropUser = async (teamId) => {
	let userId = store.getState().user.profileUser.id;

	let updatedTeam = await Api.Teams.rejectedOrRemoveUser(userId, teamId);
	return updatedTeam;
};

//Отменить поданную в команду заявку
export const cancelUser = async (teamId) => {
	let userId = store.getState().user.profileUser.id;

	let updatedUserTeams = await Api.Teams.cancelRequestUser(userId, teamId);
	return updatedUserTeams;
};

//Принять приглашение
export const joinTeam = async (teamId) => {
	let userId = store.getState().user.profileUser.id;

	let updatedUserTeams = await Api.Teams.joinTeam(userId, teamId);
	return updatedUserTeams;
};