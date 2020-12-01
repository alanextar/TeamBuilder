import React from 'react';
import { Api } from '../../infrastructure/api';

import { connect } from 'react-redux';
import { goBack, goToPage } from "../../store/router/actions";
import { setActiveTab } from "../../store/vk/actions";

import {
	Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, InfoRow,
	SimpleCell, Avatar, PullToRefresh, PanelHeaderContent, Separator,
	withPlatform, ANDROID, Placeholder
} from '@vkontakte/vkui';

import TeamMenu from './teamMenu';
import TeamManagment from './teamManagment';

import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

import { getActivePanel } from "../../services/_functions";
import { countConfirmed, isNoContentResponse } from "../../infrastructure/utils";

class TeamInfo extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId;
		this.bindingId = `${props.id}_${itemIdInitial}`;

		this.state = {
			itemId: itemIdInitial,
			team: {},
			contextOpened: false
		};

		this.onRefresh = async () => {
			this.setState({ fetching: true });
			await this.populateTeamData();
			this.setState({
				fetching: false
			});

		};

		this.toggleContext = this.toggleContext.bind(this);
		this.updateTeam = this.updateTeam.bind(this);
	}

	componentDidMount() {
		this.populateTeamData();
	}

	async populateTeamData() {
		let team = await Api.Teams.get(this.state.itemId);
		this.setState({ team: team });
	}

	toggleContext() {
		this.setState({ contextOpened: !this.state.contextOpened });
	};

	updateTeam(newTeam) {
		this.setState({ team: newTeam })
	}

	render() {
		const { goBack, goToPage, setActiveTab, platform } = this.props;
		let teamCap = this.state.team.userTeams?.find(x => x.isOwner)?.user;

		const userInActiveTeam =
			this.state.team.userTeams?.find((user) => user.userId === this.props.profile?.id);
		const activeTeamMembers = this.state.team && this.state.team.userTeams;

		const isUserInActiveTeam = userInActiveTeam != null;
		const isOwner = isUserInActiveTeam && userInActiveTeam?.isOwner;
		const isModerator = this.props.profileUser?.isModerator;
		const canEdit = isOwner || isModerator;
		let isEmptyTeam = !canEdit && activeTeamMembers?.filter(x => x.userAction === 2).length == 0; 

		return (
			<Panel id={this.props.id}>
				<PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
					{this.props.profileUser ?
						<PanelHeaderContent
							status={`${countConfirmed(this.state.team.userTeams)} участников`}
							before={<Avatar size={36} src={this.state.team.image?.dataURL} />}
							aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
							onClick={() => this.toggleContext()}>
							{this.state.team.name}
						</PanelHeaderContent> :
						`Команда`}
				</PanelHeader>
				<TeamMenu
					team={this.state.team}
					updateTeam={this.updateTeam}
					opened={this.state.contextOpened}
					onClose={this.toggleContext} />
				<Tabs>
					<TabsItem
						onClick={() => setActiveTab(this.bindingId, null)}
						selected={!this.props.activeTab[this.bindingId]}>
						Описание
                    </TabsItem>
					<TabsItem
						onClick={() => setActiveTab(this.bindingId, 'teamUsers')}
						selected={this.props.activeTab[this.bindingId] === 'teamUsers'}>
						Участники
                    </TabsItem>
				</Tabs>
				<PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
					<Group>
						{this.state.team && (
							this.props.activeTab[this.bindingId] !== 'teamUsers' ?
								<Group>
									<SimpleCell multiline>
										<InfoRow header="Название">
											{this.state.team.name}
										</InfoRow>
									</SimpleCell>
									<SimpleCell multiline>
										<InfoRow header='Описание'>
											{this.state.team.description}
										</InfoRow>
									</SimpleCell>
									<SimpleCell
										expandable
										after={platform === ANDROID && <Icon24Chevron />}
										onClick={() => goToPage('eventInfo', this.state.team.event?.id)}>
										<InfoRow header='Участвуем в '>
											{this.state.team.event?.name}
										</InfoRow>
									</SimpleCell>
									<SimpleCell>
										<InfoRow header="Мы ищем">
											{this.state.team.numberRequiredMembers} участников
                                        </InfoRow>
									</SimpleCell>
									<SimpleCell multiline>
										<InfoRow header="Описание участников и их задач">
											{this.state.team.descriptionRequiredMembers}
										</InfoRow>
									</SimpleCell>
								</Group>
								:
								(<Group>
									{teamCap && !canEdit &&
										<SimpleCell key={teamCap.id}
											onClick={() => goToPage('user', teamCap.id)}
											before={<Avatar size={48} src={teamCap.photo100} />}
											description="Капитан"
											expandable
											after={platform === ANDROID && <Icon24Chevron />}>
											{teamCap.fullName}
										</SimpleCell>
									}
									{isEmptyTeam &&
										<Placeholder icon={<Icon56UsersOutline />} header="Нет участников">
											Список участников пуст<br />
											Вы можете подать заявку и<br />
											капитан команды рассмотрит её
										</Placeholder>}
									{
										!canEdit ?
											<Group>
												<Separator style={{ margin: '12px 0' }} />
												{activeTeamMembers && activeTeamMembers.map(userTeam => {
													return (
														userTeam.userAction === 2 &&
														<SimpleCell key={userTeam.userId}
															onClick={() => goToPage('user', userTeam.userId)}
															before={<Avatar size={48} src={userTeam.user?.photo100} />}
															description={null}
															expandable
															after={platform === ANDROID && <Icon24Chevron />}>
															{userTeam.user?.fullName}
														</SimpleCell>
													)
												})}
											</Group> :
											<TeamManagment isModerator={isModerator} userTeams={this.state.team.userTeams} updateTeam={this.updateTeam} />
									}
									</Group>
								)
						)}
					</Group>
				</PullToRefresh>
				{this.props.snackbar}
			</Panel>
		);
	}

};

withPlatform(TeamInfo);

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		profile: state.user.profile,
		profileUser: state.user.profileUser,
		activeTab: state.vkui.activeTab,
		snackbar: state.formData.snackbar
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack,
	setActiveTab
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInfo);
