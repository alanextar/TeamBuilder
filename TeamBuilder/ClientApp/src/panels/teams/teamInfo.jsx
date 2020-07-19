import React from 'react';
import { Api } from '../../infrastructure/api';

import { connect } from 'react-redux';
import { goBack, goToPage } from "../../store/router/actions";
import { setActiveTab } from "../../store/vk/actions";

import {
	Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow,
	SimpleCell, Avatar, Div, PullToRefresh, PanelHeaderContent, Separator
} from '@vkontakte/vkui';

import TeamMenu from './teamMenu';

import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import { getActivePanel } from "../../services/_functions";
import { countConfirmed } from "../../infrastructure/utils";

class TeamInfo extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId;
		this.bindingId = `teamInfo_${itemIdInitial}`;

		this.state = {
			itemId: itemIdInitial,
			team: {},
			activeTab: props.activeTab[this.bindingId] || "teamDescription",
			edit: true,
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
	}

	componentDidMount() {
		this.populateTeamData();
	}

	componentWillUnmount() {
		const { setActiveTab } = this.props;
		setActiveTab(this.bindingId, this.state.activeTab);
	}

	async populateTeamData() {
		Api.Teams.get(this.state.itemId)
			.then(result => this.setState({ team: result }));
	}

	toggleContext() {
		this.setState({ contextOpened: !this.state.contextOpened });
	};

	render() {
		const { goBack, goToPage } = this.props;

		let teamCap = this.state.team.userTeams?.find(x => x.isOwner)?.user;

		return (
			<Panel id={this.props.id}>
				<PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
					{this.props.profileUser ?
						<PanelHeaderContent
							status={`${countConfirmed(this.state.team.userTeams)} участников`}
							before={<Avatar size={36} src={this.state.team.image?.dataURL} />}
							aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
							onClick={() => { this.toggleContext(); }}>
							{this.state.team.name}
						</PanelHeaderContent> :
						`Команда`}
				</PanelHeader>
				<TeamMenu team={this.state.team} opened={this.state.contextOpened} onClose={this.toggleContext} />
				<Tabs>
					<TabsItem
						onClick={() => {
							this.setState({ activeTab: 'teamDescription' })
						}}
						selected={this.state.activeTab === 'teamDescription'}
					>
						Описание
                    </TabsItem>
					<TabsItem
						onClick={() => {
							this.setState({ activeTab: 'teamUsers' })
						}}
						selected={this.state.activeTab === 'teamUsers'}
					>
						Участники
                    </TabsItem>
				</Tabs>
				<PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
					<Group>
						{this.state.team && (
							this.state.activeTab === 'teamDescription' ?
								<Cell>
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
									<SimpleCell expandable onClick={() => goToPage('eventInfo', this.state.team.event?.id)}>
										<InfoRow header='Участвуем в '>
											{this.state.team.event?.name}
										</InfoRow>
									</SimpleCell>
								</Cell>
								:
								<Cell>
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
									<Div>
										<InfoRow header='Участники'>
											{teamCap && <SimpleCell key={teamCap.id}
												onClick={() => goToPage('user', teamCap.id)}
												before={<Avatar size={48} src={teamCap.photo100} />}
												after={<Icon28MessageOutline />}
												expandable>
												{teamCap.fullName}
											</SimpleCell>}
											<Separator style={{ margin: '12px 0' }} />
											{this.state.team.userTeams?.map(userTeam => {
												console.log('userTeam out', userTeam);
												return (
													userTeam.userAction === 2 &&
													<SimpleCell key={userTeam.userId}
														onClick={() => goToPage('user', userTeam.userId)}
														before={<Avatar size={48} src={userTeam.user && userTeam.user.photo100} />}
														after={<Icon28MessageOutline />}
														expandable>
														{userTeam.user && userTeam.user.fullName}
													</SimpleCell>

												)
											}
											)}
										</InfoRow>
									</Div>
								</Cell>)}
					</Group>
				</PullToRefresh>
			</Panel>
		);
	}

};

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		profile: state.user.profile,
		profileUser: state.user.profileUser,
		activeTab: state.vkui.activeTab
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack,
	setActiveTab
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInfo);
