import { store } from "../index";
import { setProfileUser, addTeamToProfile } from "../store/user/actions";
import { goBack } from "../store/router/actions";
import { Api } from '../infrastructure/api';

//TODO рефакторинг обновления профиля после выполнения действий по команде

//Подать заявку в команду
export const sendRequest = async (teamId) => {
	let userId = store.getState().user.profile.id;
	let isTeamOffer = false;

	let newUserTeam = {
		userId: userId,
		teamId: teamId,
		team: {},
		isOwner: false,
		userAction: 1,
	};

	let updatedTeam = await Api.Users.setTeam(userId, teamId, isTeamOffer);
	newUserTeam.team = updatedTeam;
	store.dispatch(addTeamToProfile(newUserTeam));
	return updatedTeam;
};

//Удалить команду
export const deleteTeam = async (teamId) => {
	await Api.Teams.delete(teamId);

	let profile = store.getState().user.profileUser;
	let teamsToRemove = profile.userTeams.find(x => x.teamId == teamId);
	const index = profile.userTeams.indexOf(teamsToRemove);
	if (index > -1) {
		profile.userTeams.splice(index, 1);
	}
	store.dispatch(setProfileUser(profile));
	store.dispatch(goBack());
};

//Выйти из команды / отклонить приглашение
export const dropUser = async (teamId) => {
	let profile = store.getState().user.profileUser;
	let userId = profile.id;

	let updatedTeam = await Api.Teams.rejectedOrRemoveUser(userId, teamId);
	let userTeamToUpd = profile.userTeams.find(x => x.teamId == teamId);

	switch (userTeamToUpd.userAction) {
		case 2:
			userTeamToUpd.userAction = 4;
			break;
		case 5:
			userTeamToUpd.userAction = 3;
			break;
	}

	store.dispatch(setProfileUser(profile));
	return updatedTeam;
};

//Отменить поданную в команду заявку
export const cancelUser = async (teamId) => {
	let profileUser = store.getState().user.profileUser;

	let updatedUserTeams = await Api.Teams.cancelRequestUser(profileUser.id, teamId);

	// let updatedUserTeams = []
	// team.userTeams.map(userTeam => {
	// 	userTeam.userId != profileUser.id && updatedUserTeams.push(userTeam)
	// })

	// setTeam({
	// 	...team,
	// 	userTeams: updatedUserTeams
	// });

	let teamsToRemove = profileUser.userTeams.find(x => x.teamId == teamId);
	const index = profileUser.userTeams.indexOf(teamsToRemove);
	if (index > -1) {
		profileUser.userTeams.splice(index, 1);
	}
	store.dispatch(setProfileUser(profileUser));
	return updatedUserTeams;
};

//Принять приглашение
export const joinTeam = async (teamId) => {
	let profileUser = store.getState().user.profileUser;

	let updatedUserTeams = await Api.Teams.joinTeam(profileUser.id, teamId);
	// let userTeams = team.userTeams;

	// userTeams.map(userTeam => {
	// 	(userTeam.userId === profileUser.id) && (userTeam.userAction = 2);
	// })

	// setTeam({
	// 	...team,
	// 	userTeams: userTeams
	// })

	let userTeamToUpd = profileUser.userTeams.find(x => x.teamId == teamId);
	userTeamToUpd.userAction = 2;
	store.dispatch(setProfileUser(profileUser));
	return updatedUserTeams;
};