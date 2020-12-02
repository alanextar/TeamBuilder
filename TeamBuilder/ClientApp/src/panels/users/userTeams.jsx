import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import { Button, Card, CardGrid, Group, List, Placeholder, RichCell, PanelSpinner } from '@vkontakte/vkui';
import * as Alerts from "../components/Alerts.js";
import '@vkontakte/vkui/dist/vkui.css';
import React from 'react';
import { connect } from 'react-redux';
import { Api } from '../../infrastructure/api';
import { countMyActiveTeams, countForeignActiveTeams } from '../../infrastructure/utils';
import { longOperationWrapper } from "../../services/_functions";
import { goToPage } from '../../store/router/actions';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import { isNoContentResponse } from "../../infrastructure/utils";

class UserTeams extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userTeams: props.userTeams
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.userTeams !== prevProps.userTeams) {
			this.setState({ userTeams: this.props.userTeams })
		}
	}

	async handleJoin(e, teamId) {
		e.preventDefault();

		let action = async () => {
			let updatedUserTeams = await Api.Users.joinTeam(teamId);
			this.setState({ userTeams: updatedUserTeams });
		}

		await longOperationWrapper({ action });
	}

	async handleQuitOrDecline(e, teamId, teamName, alert) {
		e.preventDefault();

		let action = async () => {
			let updatedUserTeams = await Api.Users.quitOrDeclineTeam(teamId);
			this.setState({ userTeams: updatedUserTeams });
		}
		let handler = () => longOperationWrapper({ action });

		alert(teamName, handler)
	}

	async handleCancelRequestToTeam(e, teamId, teamName) {
		e.preventDefault();

		let action = async () => {
			let updatedUserTeams = await Api.Users.cancelRequestTeam(teamId);
			this.setState({ userTeams: updatedUserTeams });
		}
		let handler = () => longOperationWrapper({ action });

		Alerts.CanselRequestToTeamPopout(teamName, handler);
	}

	goToTeam = (e, teamId) => {
		if (e.defaultPrevented) return;
		this.props.goToPage('teamInfo', teamId);
	}

	buildTeamAction = (userTeam) => {
		if (this.props.readOnlyMode) {
			return;
		}

		if (userTeam.userAction === 5) {
			return (
				<>
					<Button onClick={(e) => this.handleJoin(e, userTeam.teamId)}>Принять</Button>
					<Button onClick={(e) => this.handleQuitOrDecline(e, userTeam.teamId, userTeam.team.name, Alerts.DeclineTeamInvitePopout)}
						mode="secondary">
						Отклонить
						</Button>
				</>
			);
		}

		if (userTeam.userAction === 1 && !userTeam.isOwner) {
			return (
				<Button onClick={(e) => this.handleCancelRequestToTeam(e, userTeam.teamId, userTeam.team.name)} mode="secondary">
					Отозвать заявку
				</Button>
			);
		}

		if (userTeam.userAction === 2 && !userTeam.isOwner) {
			return (
				<Button onClick={(e) => this.handleQuitOrDecline(e, userTeam.teamId, userTeam.team.name, Alerts.LeaveTeamPopout)} mode="secondary">
					Выйти
				</Button>
			);
		}
	}

	render() {
		let isTeamsExistsForProfile = countMyActiveTeams(this.state.userTeams) !== 0;
		let isTeamsExistsForUser = countForeignActiveTeams(this.state.userTeams) !== 0;
		const loader = <PanelSpinner key={0} size="large" />

		return (
			this.props.loading ? loader :
				<Group>
					{!isTeamsExistsForProfile && !this.props.readOnlyMode &&
						<Placeholder icon={<Icon56UsersOutline />} header="Вступайте в команду">
							Или создайте свою и пригласите других участников. <br />
							Здесь можно будет принять приглашение или отозвать заявку
						</Placeholder>}
					{!isTeamsExistsForUser && this.props.readOnlyMode &&
						<Placeholder icon={<Icon56UsersOutline />} header="Нет команд">
							Пользователь пока не состоит ни в одной из команд. <br />
							Если у вас есть своя команда, Вы можете отправить ему приглашение
						</Placeholder>}
					<List>
						<CardGrid style={{ marginTop: 10, marginBottom: 10 }}>
							{this.state.userTeams && this.state.userTeams?.map(userTeam => {
								if (this.props.readOnlyMode && userTeam.userAction !== 2 && !userTeam.isOwner)
									return;
								return (
										<Card key={userTeam.teamId} size="l" mode="shadow">
											<RichCell key={userTeam.teamId}
												text={userTeam?.team?.description}
												caption={userTeam.team.event?.name}
												after={userTeam.userAction === 2 ? < Icon28CheckCircleOutline /> :
													(userTeam.userAction === 1 && <Icon28InfoOutline />)}
												onClick={(e) => this.goToTeam(e, userTeam.teamId)}
												actions={this.buildTeamAction(userTeam)}>
												{userTeam.team.name}
											</RichCell>
										</Card>
									)
								})
							}
						</CardGrid>
					</List>
				</Group>
		)
	}

}

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		inputData: state.formData.forms,
		snackbar: state.formData.snackbar,
		error: state.formData.error
	}
};

const mapDispatchToProps = {
	goToPage
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTeams);
