import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { goToPage } from "../../store/router/actions";

import { List, PanelHeaderContext, Cell } from "@vkontakte/vkui";

import * as Alerts from "../components/Alerts.js";

import * as TeamManagement from "../../services/teamManagement";
import { countConfirmed } from "../../infrastructure/utils";

const TeamMenu = (props) => {
	const { goToPage } = props;

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

	const sendRequestHandler = async () => {
		let updatedTeam = await TeamManagement.sendRequest(props.team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const dropUserHandler = async () => {
		let updatedTeam = await TeamManagement.dropUser(props.team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const canselRequestHandler = async () => {
		let updatedTeam = await TeamManagement.cancelUser(props.team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const joinTeamHandler = async () => {
		let updatedTeam = await TeamManagement.joinTeam(props.team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const setUserTeams = (userTeams) => {
		props.updateTeam({
			...props.team,
			userTeams: userTeams,
		});
	}

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
								onClick={() =>
									Alerts.DeleteTeamPopout(props.team.id, props.team.name)
								}
							>
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
								onClick={() =>
									Alerts.LeaveTeamPopout(props.team.name, dropUserHandler)
								}
							>
								Выйти из команды
							</Cell>
						)) ||
						(userAction === 5 && (
							<>
								<Cell onClick={() => joinTeamHandler()}>
									Принять приглашение
								</Cell>
								<Cell
									onClick={() =>
										Alerts.DeclineTeamInvitePopout(props.team.name, dropUserHandler)
									}
								>
									Отклонить приглашение
								</Cell>
							</>
						)) ||
						(canSendRequest && (
							<Cell onClick={sendRequestHandler}>
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
	goToPage
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMenu);
