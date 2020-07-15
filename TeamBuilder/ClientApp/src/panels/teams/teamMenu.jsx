import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
	goBack,
	openPopout,
	closePopout,
	goToPage,
} from "../../store/router/actions";
import { setProfileUser, addTeamToProfile } from "../../store/user/actions";

import { Alert, List, PanelHeaderContext, Cell } from "@vkontakte/vkui";

import * as Alerts from "../components/Alerts.js";

import { Api } from "../../infrastructure/api";
import * as TeamManagement from "../../services/teamManagement";
import { countConfirmed } from "../../infrastructure/utils";

const TeamMenu = (props) => {
	const { goToPage } = props;

	const [team, setTeam] = useState(props.team);

	useEffect(() => {
		if (props.team !== team) {
			setTeam(props.team);
		}
	}, [props.team]);

	const userInActiveTeam =
		props.profile &&
		team.userTeams?.find((user) => user.userId === props.profile.id);

	const isUserInActiveTeam = userInActiveTeam != null;
	const isOwner = isUserInActiveTeam && userInActiveTeam?.isOwner;
	const isModerator = props.profileUser?.isModerator;
	const userAction = userInActiveTeam?.userAction;
	const confirmedUser = countConfirmed(team.userTeams);

	const canEdit = isOwner || isModerator;
	const canSendRequest =
		(!isUserInActiveTeam || userAction == 3 || userAction == 4) &&
		confirmedUser < team.numberRequiredMembers;
	const fullTank = confirmedUser >= team.numberRequiredMembers;

	const sendRequestHandler = async () => {
		let updatedTeam = await TeamManagement.sendRequest(team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const dropUserHandler = async () => {
		let updatedTeam = await TeamManagement.dropUser(team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const canselRequestHandler = async () => {
		let updatedTeam = await TeamManagement.cancelUser(team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const joinTeamHandler = async () => {
		let updatedTeam = await TeamManagement.joinTeam(team.id);
		setUserTeams(updatedTeam.userTeams);
	};

	const setUserTeams = (userTeams) =>
		setTeam({
			...team,
			userTeams: userTeams,
		});

	return (
		team && (
			<PanelHeaderContext opened={props.opened} onClose={props.onClose}>
				<List>
					{(canEdit && (
						<>
							<Cell onClick={() => goToPage("teamEdit", team.id)}>
								Редактировать команду
							</Cell>
							<Cell
								onClick={() =>
									Alerts.DeleteTeamPopout(team.id, team.name)
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
									Alerts.LeaveTeamPopout(
										team.name,
										dropUserHandler
									)
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
										Alerts.DeclineInvitePopout(
											team.name,
											dropUserHandler
										)
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
	goToPage,
	goBack,
	setProfileUser,
	addTeamToProfile,
	openPopout,
	closePopout,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMenu);
