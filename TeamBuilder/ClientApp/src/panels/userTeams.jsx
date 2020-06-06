import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import { Alert, Button, Card, CardGrid, Group, List, Placeholder, RichCell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import React from 'react';
import { connect } from 'react-redux';
import { Api } from '../infrastructure/api';
import { countActiveUserTeams } from '../infrastructure/utils';
import { closePopout, openPopout, setPage } from '../store/router/actions';
import { setTeam, setUserTeam } from '../store/teams/actions';
import { setProfileUser, setUser } from '../store/user/actions';

class UserTeams extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userTeams: props.userTeams,
			fetching: false,
		}
	}

	componentDidMount() {

	}

	async handleJoin(e, teamId) {
		e.stopPropagation();
		Api.Users.joinTeam(teamId)
			.then(data => this.updateUserTeams(data));
	}

	async handleQuitOrDecline(e, teamId) {
		e.stopPropagation();
		Api.Users.quitOrDeclineTeam(teamId)
			.then(data => this.updateUserTeams(data));
	}

	async handleCancelRequestTeam(e, teamId) {
		e.stopPropagation();
		Api.Users.cancelRequestTeam(teamId)
			.then(data => this.updateUserTeams(data));
	}

	updateUserTeams = (userTeams) => {
		this.props.setProfileUser({
			...this.props.profileUser,
			userTeams: userTeams
		});
		this.setState({ userTeams: userTeams });
		this.props.setUser(this.props.profileUser)
	};

	openPopoutExit = (e, teamId) => {
		e.stopPropagation();
		this.props.openPopout(
			<Alert
				actionsLayout="vertical"
				actions={[{
					title: 'Выйти из команды',
					autoclose: true,
					mode: 'destructive',
					action: () => this.handleQuitOrDecline(e, teamId),
				}, {
					title: 'Отмена',
					autoclose: true,
					mode: 'cancel'
				}]}
				onClose={() => this.props.closePopout()}
			>
				<h2>Подтвердите действие</h2>
				<p>Вы уверены, что хотите выйти из команды?</p>
			</Alert>
		);
	};

	openPopoutDecline = (e, teamId) => {
		e.stopPropagation();
		this.props.openPopout(
			<Alert
				actionsLayout="vertical"
				actions={[{
					title: 'Отклонить приглашение',
					autoclose: true,
					mode: 'destructive',
					action: () => this.handleQuitOrDecline(e, teamId),
				}, {
					title: 'Отмена',
					autoclose: true,
					mode: 'cancel'
				}]}
				onClose={() => this.props.closePopout()}
			>
				<h2>Подтвердите действие</h2>
				<p>Вы уверены, что хотите отклонить приглашение?</p>
			</Alert>
		);
	};

	openPopoutAbort = (e, teamId) => {
		e.stopPropagation();
		this.props.openPopout(
			<Alert
				actionsLayout="vertical"
				actions={[{
					title: 'Отменить заявку',
					autoclose: true,
					mode: 'destructive',
					action: () => this.handleCancelRequestTeam(e, teamId),
				}, {
					title: 'Отмена',
					autoclose: true,
					mode: 'cancel'
				}]}
				onClose={() => this.props.closePopout()}
			>
				<h2>Подтвердите действие</h2>
				<p>Вы уверены, что хотите отменить заявку?</p>
			</Alert>
		);
	};

	render() {
		const { setPage, setTeam, activeView, setUserTeam } = this.props;
		let isTeamsExists = countActiveUserTeams(this.state.userTeams);

		return (
			<Group>
				{!isTeamsExists && !this.props.readOnlyMode &&
					<Placeholder header="Вступайте в команду">
						Или создайте свою и пригласите других участников. Здесь можно будет принять
						приглашение от команд или отозвать заявку.
                </Placeholder>}
				{!isTeamsExists && this.props.readOnlyMode &&
					<Placeholder header="Нет команд">
						Пользователь пока не состоит ни в одной из команд. Вы можете отправить ему приглашение, чтобы он присоединился к вам.
                </Placeholder>}
				<List>
					<CardGrid>
						{
							this.state.userTeams &&
							this.state.userTeams.map(userTeam => {
								return (
									<Card key={userTeam.teamId} size="l" mode="shadow">
										<RichCell key={userTeam.teamId}
											text={userTeam?.team?.description}
											caption={"Событие: " + (userTeam?.team?.event ? userTeam.team.event.name : '')}
											after={userTeam.userAction === 2 ? < Icon28CheckCircleOutline /> :
												(userTeam.userAction === 1 && <Icon28InfoOutline />)}
											onClick={() => { setTeam(userTeam.team); setUserTeam(userTeam.team); setPage(activeView, 'teaminfo') }}
											actions={!this.props.readOnlyMode && (userTeam.userAction === 5 ?
												<React.Fragment>
													<Button onClick={(e) => this.handleJoin(e, userTeam.teamId)}>Принять</Button>
													<Button onClick={(e) => this.openPopoutDecline(e, userTeam.teamId)}
														mode="secondary">Отклонить</Button>
												</React.Fragment> :
												((userTeam.userAction === 2 || userTeam.userAction === 1 && !userTeam.isOwner) && <React.Fragment>
													{
														userTeam.userAction === 2
															?
															<Button onClick={(e) => this.openPopoutExit(e, userTeam.teamId)} mode="secondary">
																Выйти
                                                        </Button>
															:
															(userTeam.userAction === 1 ?
																<Button onClick={(e) => this.openPopoutAbort(e, userTeam.teamId)} mode="secondary">
																	Отозвать заявку
                                                    </Button> : '')
													}
												</React.Fragment>
												))}>
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
		profileUser: state.user.profileUser
	};
};

const mapDispatchToProps = {
	setPage,
	setTeam,
	setUserTeam,
	openPopout,
	closePopout,
	setProfileUser,
	setUser
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTeams);
