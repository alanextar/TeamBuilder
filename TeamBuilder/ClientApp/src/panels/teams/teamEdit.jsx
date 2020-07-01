import React from 'react';
import { Api } from '../../infrastructure/api';

import { connect } from 'react-redux';
import { goBack, setPage } from "../../store/router/actions";
import { setTeam } from "../../store/teams/actions";
import { setActiveTab } from "../../store/vk/actions";
import { setFormData } from "../../store/formData/actions";
import { setProfileUser } from "../../store/user/actions";

import {
	Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
	Div, Button, Textarea, FormLayout, Select, Input, Header, InfoRow, Avatar,
	RichCell, Link
} from '@vkontakte/vkui';

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';

import { getActivePanel } from "../../services/_functions";

class TeamEdit extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId;
		this.bindingId = `teamEdit_${itemIdInitial}`;

		this.state = {
			itemId: itemIdInitial,

			activeTab: props.activeTab[this.bindingId] || "teamDescription",
			inputData: props.inputData[this.bindingId],
			events: []
		};

		this.handleInput = (e) => {
			let value = e.currentTarget.value;

			if (e.currentTarget.type === 'checkbox') {
				value = e.currentTarget.checked;
			}

			this.setState({
				inputData: {
					...this.state.inputData,
					[e.currentTarget.name]: value
				}
			})
		}

		this.cancelForm = () => {
			this.setState({
				inputData: null
			})
			props.goBack();
		};
	}

	componentDidMount() {
		this.state.inputData || this.fetchTeams();
		this.populateEventsData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.inputData[this.bindingId] !== prevProps.inputData[this.bindingId]) {
			this.setState({ inputData: this.props.inputData[this.bindingId] });
		}
	}

	componentWillUnmount() {
		const { setActiveTab, setFormData } = this.props;
		setActiveTab(this.bindingId, this.state.activeTab);
		setFormData(this.bindingId, this.state.inputData);
	}

	fetchTeams() {
		Api.Teams.get(this.state.itemId)
			.then(user => this.setState({ inputData: user }))
	}

	populateEventsData() {
		Api.Events.getAll()
			.then(events => this.setState({ events: events }));
	}

	async postEdit() {
		const { goBack } = this.props;

		if (!this.state.inputData.name)
			return;

		let updatedTeam = await Api.Teams.edit(this.state.inputData)

		let profileUser = this.props.profileUser;
		let ut = profileUser.userTeams.find(x => x.teamId == updatedTeam.id);
		ut.team = updatedTeam;
		this.props.setProfileUser(profileUser);

		goBack();
	};

	//Принять в команду
	async handleJoin(e, userTeam) {
		e.stopPropagation();
		Api.Teams.joinTeam(userTeam.userId, userTeam.teamId)
			.then(newTeam => {
				this.updateTeam(newTeam)
			});
	};

	//Удалить из команды / отклонить заявку
	async dropUser(e, userTeam) {
		Api.Teams.rejectedOrRemoveUser({ teamId: userTeam.teamId, userId: userTeam.userId })
			.then(newTeam => {
				this.updateTeam(newTeam);
			})
	};

	//Отменить приглашение
	async cancelUser(e, userTeam) {
		Api.Teams.cancelRequestUser({ teamId: userTeam.teamId, userId: userTeam.userId })
			.then(newTeam => {
				this.updateTeam(newTeam)
			})
	};

	updateTeam(newTeam) {
		const { setTeam } = this.props;
		setTeam(newTeam);
	}

	render() {
		const { goBack, setPage, activeView } = this.props;
		var inputData = this.state.inputData;

		return (
			<Panel id={this.props.id}>
				<PanelHeader separator={false} left={<PanelHeaderBack onClick={this.cancelForm} />}>
					Редактировать
                </PanelHeader>
				<Tabs>
					<TabsItem
						onClick={() => { this.setState({ activeTab: 'teamDescription' }) }}
						selected={this.state.activeTab === 'teamDescription'}>
						Описание
                        </TabsItem>
					<TabsItem
						onClick={() => { this.setState({ activeTab: 'teamUsers' }) }}
						selected={this.state.activeTab === 'teamUsers'}>
						Участники
                        </TabsItem>
				</Tabs>
				<Group>
					{inputData && (
						this.state.activeTab === 'teamDescription' ?
							<FormLayout >
								<Input name="name" top="Название команды" type="text" value={inputData.name}
									onChange={this.handleInput} status={inputData.name ? 'valid' : 'error'} placeholder='Введите название команды' />
								<Textarea top="Описание команды" name="description" value={inputData.description} onChange={this.handleInput} />
								<Select
									top='Выберете событие'
									placeholder="Событие"
									onChange={this.handleInput}
									name="eventId"
									value={inputData.eventId}
									bottom={<Link style={{ color: 'rebeccapurple', textAlign: "right" }} onClick={() => setPage(activeView, 'eventCreate')}>Создать событие</Link>}>
									{this.state.events && this.state.events.map((ev, i) => {
										return (
											<option value={ev.id} key={i}>
												{ev.name}
											</option>
										)
									})}
								</Select>
							</FormLayout>
							:
							<Group>
								<Group>
									<FormLayout>
										<Input top="Количество требуемых участников"
											name="numberRequiredMembers"
											value={String(inputData.numberRequiredMembers)}
											onChange={this.handleInput}
											type="number" />
										<Textarea
											top="Описание участников и их задач"
											name="descriptionRequiredMembers"
											value={inputData.descriptionRequiredMembers}
											onChange={this.handleInput} />
									</FormLayout>
								</Group>
								<Group>
									<Header mode="secondary">Участники</Header>
									{inputData.userTeams &&
										inputData.userTeams.map(userTeam => {
											return (
												(userTeam.userAction === 1 || userTeam.userAction === 2 || userTeam.userAction === 5) &&
												<RichCell key={userTeam.userId}
													before={<Avatar size={48} src={userTeam.user.photo100} />}
													after={userTeam.userAction === 2 && <Icon24DismissDark
														onClick={(e) => this.dropUser(e, userTeam)} />}
													actions={
														userTeam.userAction === 1 &&
														<React.Fragment>
															<Button
																onClick={(e) => this.handleJoin(e, userTeam)}>Принять</Button>
															<Button mode="secondary" style={{ marginLeft: 2 }}
																onClick={(e) => this.dropUser(e, userTeam)}>Отклонить</Button>
														</React.Fragment> ||
														userTeam.userAction === 5 &&
														<React.Fragment>
															<Button mode="secondary"
																onClick={(e) => this.cancelUser(e, userTeam)}>Отозвать предложение</Button>
														</React.Fragment>
													}
												>
													{userTeam.user.fullName}
												</RichCell>
											)
										}
										)}
								</Group>

							</Group>
					)}
					<Div>
						<Button
							stretched
							onClick={() => this.postEdit()}>
							Сохранить
                        </Button>
					</Div>
				</Group>
			</Panel>
		);
	}

};

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		activeTab: state.vkui.activeTab,
		inputData: state.formData.forms,
		profileUser: state.user.profileUser
	};
};


const mapDispatchToProps = {
	setPage,
	setTeam,
	goBack,
	setActiveTab,
	setFormData,
	setProfileUser
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamEdit);