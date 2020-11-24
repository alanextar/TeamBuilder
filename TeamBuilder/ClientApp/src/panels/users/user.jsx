import React from 'react';
import { connect } from 'react-redux';
import {
	Panel, PanelHeader, Group, Cell, Avatar, Button, Div, PanelHeaderBack, Counter,
	Tabs, TabsItem, Separator, PullToRefresh, InfoRow, Header, Link, PanelSpinner
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Article from '@vkontakte/icons/dist/24/article';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import Icon24Send from '@vkontakte/icons/dist/24/send';

import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28HideOutline from '@vkontakte/icons/dist/28/hide_outline';

import UserTeams from './userTeams';
import UserNotifications from './userNotifications';
import { Api } from '../../infrastructure/api';
import * as Utils from '../../infrastructure/utils';
import { getActivePanel } from "../../services/_functions";
import { goBack, goToPage } from '../../store/router/actions';
import { setProfileUser } from '../../store/user/actions';
import { setActiveTab } from "../../store/vk/actions";
import SkillTokens from '../components/SkillTokens';

// profile - заполняется данными из VK
// profileUser - заполняется данными из БД (используется в App для определения  зарегестрирован пользователь или нет)

class User extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId || props.profile?.id;
		let isMyProfile = itemIdInitial == props.profile?.id;

		this.state = {
			itemId: itemIdInitial,
			user: null,

			readOnlyMode: !isMyProfile,
			isRecruitTeamsExist: undefined,
			loading: true
		}

		this.onRefresh = async () => {
			this.setState({ fetching: true });
			await this.fetchUserData(this.state.itemId);
			this.setState({
				fetching: false
			});

		};

		this.bindingId = `${props.id}_${this.state.itemId}`;
		this.confirmUser = this.confirmUser.bind(this);
	}

	componentDidMount() {
		this.fetchUserData(this.state.itemId);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profile !== prevProps.profile) {
			let itemIdInitial = getActivePanel(this.props.activeView).itemId || this.props.profile?.id;
			let isMyProfile = itemIdInitial == this.props.profile?.id;

			this.setState({ itemId: itemIdInitial, readOnlyMode: !isMyProfile });
			this.bindingId = `${this.props.id}_${itemIdInitial}`;

			this.fetchUserData(itemIdInitial);
		}
	}

	async fetchUserData(itemId) {
		const { setProfileUser } = this.props;

		if (!itemId) {
			return;
		}

		//TODO преобразовать в один запрос типа getProfileUserWithRelation - получить профиль с командами в которые можно вербовать юзера
		let user = await Api.Users.get(itemId);
		this.setState({ user: user });

		if (this.state.readOnlyMode) {
			let updatedProfile = await Api.Users.get(this.props.profile?.id);
			setProfileUser(updatedProfile);

			let needGetRecruitTeams = updatedProfile?.anyTeamOwner && user?.isSearchable
			if (needGetRecruitTeams) {
				let teams = await Api.Users.getRecruitTeams(this.props.profile?.id, itemId);
				this.setState({ isRecruitTeamsExist: teams.length > 0 });
			}
			else {
				this.setState({ isRecruitTeamsExist: null });
			}
		}
		else {
			setProfileUser(user)
		}

		this.setState({ loading: false });
	}

	async confirmUser() {
		const { setProfileUser } = this.props;

		if (!this.props.profile)
			return;

		var profileViewModel = {
			id: this.props.profile.id,
			firstName: this.props.profile.first_name,
			lastName: this.props.profile.last_name,
			photo100: this.props.profile.photo_100,
			photo200: this.props.profile.photo_200,
			isSearchable: true
		};

		Api.Users.saveOrConfirm(profileViewModel)
			.then(user => {
				this.setState({ user: user });
				setProfileUser(user);
			});
	}

	render() {
		const { goBack, goToPage, setActiveTab } = this.props;
		let user = this.state.user;
		let hasBack = this.props.panelsHistory[this.props.activeView].length > 1;

		return (
			<Panel id={this.props.id}>
				{user === undefined && this.props.profileUser === undefined
					? <PanelSpinner key={0} size="large" />
					:
					<>
						<PanelHeader separator={false}
							left={hasBack &&
								<PanelHeaderBack onClick={() => goBack()} />}>{this.state.readOnlyMode ? 'Участник' : 'Профиль'}
						</PanelHeader>
						<PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
							{this.state.readOnlyMode
								? user &&
								<Group title="VK Connect">
									<Link href={"https://m.vk.com/id" + user.id} target="_blank">
										<Cell description={user.city || ''}
											before={user.photo100 ? <Avatar src={user.photo100} /> : null}
											asideContent={user?.isSearchable ? <Icon28ViewOutline /> : <Icon28HideOutline />}>
											{`${user.firstName} ${user.lastName}`}
										</Cell>
									</Link>
									{this.state.isRecruitTeamsExist === undefined
										? <PanelSpinner key={0} size="regular" height="69px" />
										:
										this.state.isRecruitTeamsExist &&
										<Div>
											<Button mode="primary" size='xl'
												onClick={() => goToPage('setUserTeam', this.state.itemId)}>
												Завербовать
												</Button>
										</Div>}
								</Group>
								: this.props.profile &&
								<Group title="VK Connect">
									<Link href={"https://m.vk.com/id" + this.props.profile.id} target="_blank">
										<Cell description={this.props.profile.city?.title || ''}
											before={this.props.profile.photo_200 ? <Avatar src={this.props.profile.photo_200} /> : null}
											asideContent={user?.isSearchable ? <Icon28ViewOutline /> : <Icon28HideOutline />}>
											{`${this.props.profile.first_name} ${this.props.profile.last_name}`}
										</Cell>
									</Link>
									{this.props.profileUser === null &&
										<Div>
											<Button mode="destructive" size='xl'
												onClick={() => this.confirmUser()}>
												Зарегистрироваться
									</Button>
										</Div>}
								</Group>
							}
							<Separator />
							<Tabs>
								<TabsItem
									onClick={() => setActiveTab(this.bindingId, null)}
									selected={!this.props.activeTab[this.bindingId]}>
									Основное</TabsItem>
								<TabsItem
									onClick={() => setActiveTab(this.bindingId, 'teams')}
									selected={this.props.activeTab[this.bindingId] === 'teams'}>
									Команды</TabsItem>
								<TabsItem
									onClick={() => setActiveTab(this.bindingId, 'notifications')}
									selected={this.props.activeTab[this.bindingId] === 'notifications'}
									after={this.props.notifications?.length !== 0 && <Counter size="s">{this.props.notifications.length}</Counter>}>
									Уведомления</TabsItem>
							</Tabs>
							{
								!this.props.activeTab[this.bindingId]
									?
									<Group header={
										<Header
											mode="secondary"
											aside={!this.state.readOnlyMode &&
												<Icon24Write style={{ color: "#3f8ae0" }} onClick={() => goToPage('userEdit')} />
											}>
											Информация</Header>}>
										{user?.mobile &&
											<Cell before={<Icon24Phone style={{ paddingTop: 0, paddingBottom: 0 }} />}>
												<Link href={"tel:" + user.mobile}>{user.mobile}</Link>
											</Cell>}
										{user?.telegram &&
											<Cell before={<Icon24Send style={{ paddingTop: 0, paddingBottom: 0 }} />}>
												<Link href={"tg://resolve?domain=" + user.telegram}>@{user.telegram}</Link>
											</Cell>}
										{user?.email &&
											<Cell before={<Icon24Mention style={{ paddingTop: 0, paddingBottom: 0 }} />}>
												<Link href={"mailto:" + user.email}>{user.email}</Link>
											</Cell>}
										{user?.about &&
											<Cell multiline before={<Icon24Article style={{ paddingTop: 0, paddingBottom: 0 }} />}>
												{user.about}
											</Cell>}
										{user?.userSkills?.length > 0 &&
											<Cell>
												<InfoRow header="Навыки">
													<SkillTokens selectedSkills={Utils.convertUserSkills(user?.userSkills)} />
												</InfoRow>
											</Cell>}
									</Group>
									:
									this.props.activeTab[this.bindingId] === 'teams'
										?
										<Group>
											<UserTeams loading={this.state.loading} userTeams={user?.userTeams} readOnlyMode={this.state.readOnlyMode} />
										</Group>
										:
										<Group>
											<UserNotifications />
										</Group>
							}
						</PullToRefresh>
					</>
				}
			</Panel>
		)
	}
}

const mapStateToProps = (state) => {

	return {
		profileUser: state.user.profileUser,
		profile: state.user.profile,
		activeView: state.router.activeView,
		activeTab: state.vkui.activeTab,
		panelsHistory: state.router.panelsHistory,
		notifications: state.notice.notifications
	};
};

const mapDispatchToProps = {
	goToPage,
	setProfileUser,
	goBack,
	setActiveTab
};

export default connect(mapStateToProps, mapDispatchToProps)(User);