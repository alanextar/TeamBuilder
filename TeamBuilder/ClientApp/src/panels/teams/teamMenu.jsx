import React from "react";
import { connect } from "react-redux";
import { goToPage, goBack } from "../../store/router/actions";

import { List, PanelHeaderContext, Cell } from "@vkontakte/vkui";

import * as Alerts from "../components/Alerts.js";

import { Api } from '../../infrastructure/api';
import { countConfirmed } from "../../infrastructure/utils";
import { longOperationWrapper } from "../../services/_functions";

const TeamMenu = (props) => {
	const { goToPage, goBack } = props;

	const userInActiveTeam =
		props.profile &&
		props.team.userTeams?.find((user) => user.userId === props.profile.id);

	const isUserInActiveTeam = userInActiveTeam != null;
	const isOwner = isUserInActiveTeam && userInActiveTeam?.isOwner;
	const isModerator = props.profileUser?.isModerator;
	const userAction = userInActiveTeam?.userAction;
	const confirmedUser = countConfirmed(props.team.userTeams);

	const canEdit = isOwner || isModerator;
	const canSendRequest =
		(!isUserInActiveTeam || userAction == 3 || userAction == 4) &&
		confirmedUser < props.team.numberRequiredMembers;
	const fullTank = confirmedUser >= props.team.numberRequiredMembers;

	const deleteTeamHandler = async () => {
			let action = async () => await Api.Teams.delete(props.team.id);
			let postAction = () => goBack();
			let handler = () => longOperationWrapper({action, postAction});

			Alerts.DeleteTeamPopout(props.team.name, handler);
	};

	const sendRequestHandler = async () => {
		let action = async () => {
			let updatedTeam = await Api.Users.setTeam(props.profileUser.id, props.team.id, false);
			setUserTeams(updatedTeam.userTeams);
		}

		await longOperationWrapper({action});
	};

	const dropUserHandler = async (alert) => {
		let action = async () => {
			let updatedTeam = await Api.Teams.rejectedOrRemoveUser(props.profileUser.id, props.team.id);
			setUserTeams(updatedTeam.userTeams);
		}
		let handler = () => longOperationWrapper({action});

		alert(props.team.name, handler)
	};

	const canselRequestHandler = async () => {
		let action = async () => {
			let updatedTeam = await Api.Teams.cancelRequestUser(props.profileUser.id, props.team.id);
			setUserTeams(updatedTeam.userTeams);
		}

		await longOperationWrapper({action});
	};

	const joinTeamHandler = async () => {
		let action = async () => {
			let updatedTeam = await Api.Teams.joinTeam(props.profileUser.id, props.team.id);
			setUserTeams(updatedTeam.userTeams);
		}

		await longOperationWrapper({action});
	};

	const setUserTeams = (userTeams) => {
		props.updateTeam({
			...props.team,
			userTeams: userTeams
		});
	};

	return (
		props.team && (
			<PanelHeaderContext opened={props.opened} onClose={props.onClose}>
				<List>
					{(canEdit && (
						<>
							<Cell onClick={() => goToPage("teamEdit", props.team.id)}>
								Редактировать команду
							</Cell>
							<Cell
								onClick={() => deleteTeamHandler()}>
								Удалить команду
							</Cell>
						</>
					)) ||
						(userAction === 1 && (
							<Cell onClick={() => canselRequestHandler()}>
								Отозвать заявку
							</Cell>
						)) ||
						(userAction === 2 && (
							<Cell
								onClick={() => dropUserHandler(Alerts.LeaveTeamPopout)}>
								Выйти из команды
							</Cell>
						)) ||
						(userAction === 5 && (
							<>
								<Cell onClick={() => joinTeamHandler()}>
									Принять приглашение
								</Cell>
								<Cell
									onClick={() => dropUserHandler(Alerts.DeclineTeamInvitePopout)}>
									Отклонить приглашение
								</Cell>
							</>
						)) ||
						(canSendRequest && (
							<Cell onClick={() => sendRequestHandler()}>
								Подать заявку в команду
							</Cell>
						)) ||
						(fullTank && <Cell>В команде нет мест</Cell>)}
				</List>
			</PanelHeaderContext>
		)
	);
};

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		profileUser: state.user.profileUser,
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMenu);
