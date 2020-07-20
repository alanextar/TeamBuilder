import React from "react";
import { connect } from "react-redux";
import { goToPage } from "../../store/router/actions";

import { RichCell, Group, Button, Avatar } from "@vkontakte/vkui";

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';
import * as Alerts from "../components/Alerts.js";

import { Api } from '../../infrastructure/api';

const TeamManagment = (props) => {

	//Принять в команду
	const handleJoin = async (e, userTeam) => {
		commonHandler(e, async () => {
			let updatedTeam = await Api.Teams.joinTeam(userTeam.userId, userTeam.teamId);
			props.updateTeam(updatedTeam);
		});
	};

	//Удалить из команды / отклонить заявку
	const dropUser = async (e, userTeam, alert) => {
		let action = async () => {
			let updatedTeam = await Api.Teams.rejectedOrRemoveUser(userTeam.userId, userTeam.teamId);
			props.updateTeam(updatedTeam);
		}
		commonHandler(e, action, (handler) => alert(userTeam.user.fullName, handler));
	};

	//Отменить приглашение
	const cancelUser = async (e, userTeam) => {
		commonHandler(e, async () => {
			let updatedTeam = await Api.Teams.cancelRequestUser(userTeam.userId, userTeam.teamId);
			props.updateTeam(updatedTeam);
		});
	};

	const commonHandler = async (e, action, alert) => {
		e.stopPropagation();
		
		let handler = async () => {
			Alerts.BlockScreen();
			await action();
			Alerts.UnblockScreen();
		};

		if (alert) {
			alert(handler);
		}
		else {
			await handler();
		}
	}

	return (
		<Group>
			{props.userTeams?.map(userTeam => {
				return (
					(userTeam.userAction === 1 || userTeam.userAction === 2 || userTeam.userAction === 5) &&
					<RichCell key={userTeam.userId}
						before={<Avatar size={48} src={userTeam.user.photo100} />}
						after={
							userTeam.userAction === 2 &&
							<Icon24DismissDark onClick={e => dropUser(e, userTeam, Alerts.RemoveUserFromTeamPopout)} />
						}
						actions={
							userTeam.userAction === 1 &&
							<React.Fragment>
								<Button
									onClick={e => handleJoin(e, userTeam)}>Принять</Button>
								<Button mode="secondary" style={{ marginLeft: 2 }}
									onClick={e => dropUser(e, userTeam, Alerts.RejectUserRequestPopout)}>Отклонить</Button>
							</React.Fragment> ||
							userTeam.userAction === 5 &&
							<React.Fragment>
								<Button mode="secondary"
									onClick={e => cancelUser(e, userTeam)}>Отозвать предложение</Button>
							</React.Fragment>
						}
					>
						{userTeam.user.fullName}
					</RichCell>
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
