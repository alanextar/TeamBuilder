import React from "react";
import { connect } from "react-redux";
import { goToPage } from "../../store/router/actions";

import { RichCell, Group, Button, Avatar, SimpleCell } from "@vkontakte/vkui";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import * as Alerts from "../components/Alerts.js";

import { Api } from '../../infrastructure/api';
import { longOperationWrapper } from "../../services/_functions";

const TeamManagment = (props) => {

	//Принять в команду
	const handleJoin = async (e, userTeam) => {
		e.preventDefault();

		let action = async () => {
			let updatedTeam = await Api.Teams.joinTeam(userTeam.userId, userTeam.teamId);
			props.updateTeam(updatedTeam);
		}

		await longOperationWrapper({ e, action });
	};

	//Удалить из команды / отклонить заявку
	const dropUser = async (e, userTeam, alert) => {
		e.preventDefault();

		let action = async () => {
			let updatedTeam = await Api.Teams.rejectedOrRemoveUser(userTeam.userId, userTeam.teamId);
			props.updateTeam(updatedTeam);
		}
		let handler = () => longOperationWrapper({ action });

		alert(userTeam.user.fullName, handler);
	};

	//Отменить приглашение
	const cancelUser = async (e, userTeam) => {
		e.preventDefault();

		let action = async () => {
			let updatedTeam = await Api.Teams.cancelRequestUser(userTeam.userId, userTeam.teamId);
			props.updateTeam(updatedTeam);
		}

		await longOperationWrapper({ e, action });
	};

	const goToUser = (e, userId) => {
		if (e.defaultPrevented) return;
		props.goToPage("user", userId);
	}
	
	const isAnyActionAllowed = (userAction) => {
		const actionsAllowed = [1, 2, 5];
		return actionsAllowed.includes(userAction);
	}

	return (
		<Group>
			{ props.userTeams?.map(userTeam => {
				return (
					<React.Fragment>
						{
							userTeam.isOwner &&
							<RichCell
								key={userTeam.id}
								before={<Avatar size={48} src={userTeam.user.photo100} />}
								onClick={(e) => goToUser(e, userTeam.userId)}
								caption="Капитан"
								expandable
								after={
									<Icon24Dismiss onClick={e => dropUser(e, userTeam, Alerts.RemoveUserFromTeamPopout)} />
								}
							>
								{userTeam.user.fullName}
							</RichCell>
						}
						{
							isAnyActionAllowed(userTeam.userAction) && !userTeam.isOwner &&
							<RichCell
								key={userTeam.userId}
								before={<Avatar size={48} src={userTeam.user.photo100} />}
								after={
									userTeam.userAction === 2 || props.isModerator &&
									<Icon24Dismiss onClick={e => dropUser(e, userTeam, Alerts.RemoveUserFromTeamPopout)} />
								}
								onClick={(e) => goToUser(e, userTeam.userId)}
								actions={
									userTeam.userAction === 1 || props.isModerator &&
									<React.Fragment>
										<Button
											onClick={e => handleJoin(e, userTeam)}>Принять</Button>
										<Button mode="secondary" style={{ marginLeft: 2 }}
											onClick={e => dropUser(e, userTeam, Alerts.RejectUserRequestPopout)}>Отклонить</Button>
									</React.Fragment> ||
									userTeam.userAction === 5 || props.isModerator &&
									<React.Fragment>
										<Button mode="secondary"
											onClick={e => cancelUser(e, userTeam)}>Отозвать предложение</Button>
									</React.Fragment>
								}
							>
								{userTeam.user.fullName}
							</RichCell>
						}
					</React.Fragment>
				)
			}
			)}
		</Group>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamManagment);
