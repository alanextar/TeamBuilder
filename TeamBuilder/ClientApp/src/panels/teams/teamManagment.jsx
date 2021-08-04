import React from "react";
import { connect } from "react-redux";
import { goToPage } from "../../store/router/actions";

import { RichCell, Group, Button, Avatar, SimpleCell, Placeholder } from "@vkontakte/vkui";

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
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

	const canDelete = (userTeam) => {
		let isAccepted = userTeam.userAction === 2;
		let isSelf = userTeam.userId == props.profileUser.id

		return isAccepted && !isSelf;
	}

	return (
		<Group>
			{props.userTeams?.filter(x => isAnyActionAllowed(x.userAction))?.length == 0 &&
				<Placeholder icon={<Icon56UsersOutline />} header="Нет участников">
					Список участников пуст<br />
					Вы можете подать заявку и<br />
					капитан команды рассмотрит её
				</Placeholder>
			}
			{ props.userTeams?.map(userTeam => {
				return (
					<React.Fragment>
						{
							isAnyActionAllowed(userTeam.userAction) &&
							<RichCell
								key={userTeam.userId}
								caption={userTeam.isOwner ? "Капитан" : null}
								before={<Avatar size={48} src={userTeam.user.photo100} />}
								after={
									canDelete(userTeam) &&
									<Icon24Dismiss onClick={e => dropUser(e, userTeam, Alerts.RemoveUserFromTeamPopout)} />
								}
								onClick={(e) => goToUser(e, userTeam.userId)}
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
								{userTeam.user?.fullName}
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
