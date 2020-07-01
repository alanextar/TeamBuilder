import React from 'react';
import { connect } from 'react-redux';
import {
	Panel, PanelHeader, Group, Cell, Avatar, Button, Div, PanelHeaderBack,
	Tabs, TabsItem, Separator, Checkbox, InfoRow, Header, Title, Link, Switch, List
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Phone from '@vkontakte/icons/dist/24/phone';
import Icon24Article from '@vkontakte/icons/dist/24/article';
import Icon28MailOutline from '@vkontakte/icons/dist/28/mail_outline';
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon24Send from '@vkontakte/icons/dist/24/send';

import Icon28ViewOutline from '@vkontakte/icons/dist/28/view_outline';
import Icon28HideOutline from '@vkontakte/icons/dist/28/hide_outline';

import UserTeams from './userTeams'
import { Api } from '../../infrastructure/api';
import * as Utils from '../../infrastructure/utils';
import { getActivePanel } from "../../services/_functions";
import { goBack, setPage } from '../../store/router/actions';
import { setUser, setProfileUser, setRecruitTeams } from '../../store/user/actions';
import { setActiveTab } from "../../store/vk/actions";
import SkillTokens from '../components/SkillTokens';


// profile - заполняется данными из VK
// User - заполняется данными из БД
// profileUser - заполняется данными из БД (используется в App для определения  зарегестрирован пользователь или нет)

class User extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId || props.profile.id;
		let isMyProfile = itemIdInitial == props.profile.id;

		this.state = {
			itemId: itemIdInitial,

			profile: props.profile,
			profileUser: props.profileUser,
			user: props.user,

			activeTab: props.activeTab[`user_${itemIdInitial}`] || "main",
			isSearchable: props.user?.isSearchable || false,
			readOnlyMode: !isMyProfile,
			recruitTeams: [],
			loading: true
		}

		this.confirmUser = this.confirmUser.bind(this);
	}

	componentDidMount() {
		this.fetchUserData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.user !== prevProps.user) {
			this.setState({ user: this.props.user });
		}
		if (this.props.activeTab[`user_${this.state.itemId}`] !== prevProps.activeTab[`user_${this.state.itemId}`] ) {
			this.setState({ activeTab : this.props.activeTab[`user_${this.state.itemId}`]})
		}
	}

	componentWillUnmount() {
		const { setActiveTab } = this.props;
		setActiveTab(`user_${this.state.itemId}`, this.state.activeTab);
	}

	async fetchUserData() {
		const { setUser, setProfileUser, setRecruitTeams } = this.props;
		//TODO преобразовать в один запрос типа getProfileUserWithRelation - получить профиль с командами в которые можно вербовать юзера
		let user = await Api.Users.get(this.state.itemId);
		this.setState({ user: user });
		setUser(user);

		if (this.state.readOnlyMode) {
			let updatedProfile = await Api.Users.get(this.state.profile.id);
			setProfileUser(updatedProfile);

			let needGetRecruitTeams = this.state.profileUser?.anyTeamOwner && this.state.user.isSearchable
			if (needGetRecruitTeams) {
				let teams = await Api.Users.getRecruitTeams(this.state.profile.id, this.state.itemId);
				this.setState({ recruitTeams: teams });
				setRecruitTeams(teams);
			}
		}
		else {
			setProfileUser(user)
		}

		this.setState({ loading: false });
	}

	async confirmUser() {
		const { setUser, setProfileUser } = this.props;

		if (!this.state.profile)
			return;

		var profileViewModel = {
			id: this.state.profile.id,
			firstName: this.state.profile.first_name,
			lastName: this.state.profile.last_name,
			photo100: this.state.profile.photo_100,
			photo200: this.state.profile.photo_200
		};

		Api.Users.saveOrConfirm(profileViewModel)
			.then(user => {
				setUser(user);
				setProfileUser(user);
			});
	}

	render() {
		const { setPage, goBack, activeView } = this.props;

		return (
			<Panel id="user">
				<PanelHeader separator={false} left={this.props.activeStory !== 'user' &&
					<PanelHeaderBack onClick={() => goBack()} />}>{this.state.readOnlyMode ? 'Участник' : 'Профиль'}</PanelHeader>
				{this.state.readOnlyMode
					? this.state.user &&
					<Group title="VK Connect">
						<Link href={"https://m.vk.com/id" + this.state.user.id} target="_blank">
							<Cell description={this.state.user.city ? this.state.user.city : ''}
								before={this.state.user.photo100 ? <Avatar src={this.state.user.photo100} /> : null}
								asideContent={this.state.isSearchable ? <Icon28ViewOutline /> : <Icon28HideOutline />}>
								{`${this.state.user.firstName} ${this.state.user.lastName}`}
							</Cell>
						</Link>
					</Group>
					: this.state.profile &&
					<Group title="VK Connect">
						<Link href={"https://m.vk.com/id" + this.state.profile.id} target="_blank">
							<Cell description={this.state.profile.city && this.state.profile.city.title ? this.state.profile.city.title : ''}
								before={this.state.profile.photo_200 ? <Avatar src={this.state.profile.photo_200} /> : null}
								asideContent={this.state.isSearchable ? <Icon28ViewOutline /> : <Icon28HideOutline />}>
								{`${this.state.profile.first_name} ${this.state.profile.last_name}`}
							</Cell>
						</Link>
					</Group>
				}
				<Separator />
				<Tabs>
					<TabsItem
						onClick={() => this.setState({ activeTab: 'main' })}
						selected={this.state.activeTab === 'main'}>
						Основное
						</TabsItem>
					<TabsItem
						onClick={() => this.setState({ activeTab: 'teams' })}
						selected={this.state.activeTab === 'teams'}>
						Команды
						</TabsItem>
				</Tabs>
				{
					this.state.activeTab === 'main' ?
						<Group header={
							<Header
								mode="secondary"
								aside={!this.state.readOnlyMode && this.state.user &&
									<Icon24Write style={{ color: "#3f8ae0" }} onClick={() => setPage('user', 'userEdit')} />
								}>
								Информация
                                </Header>}>
							{this.state.user?.mobile &&
								<Cell before={<Icon24Phone style={{ paddingTop: 0, paddingBottom: 0 }} />}>
									<Link href={"tel:" + this.state.user.mobile}>{this.state.user.mobile}</Link>
								</Cell>}
							{this.state.user?.telegram &&
								<Cell before={<Icon24Send style={{ paddingTop: 0, paddingBottom: 0 }} />}>
									<Link href={"tg://resolve?domain=" + this.state.user.telegram}>@{this.state.user.telegram}</Link>
								</Cell>}
							{this.state.user?.email &&
								<Cell before={<Icon24Mention style={{ paddingTop: 0, paddingBottom: 0 }} />}>
									<Link href={"mailto:" + this.state.user.email}>{this.state.user.email}</Link>
								</Cell>}
							{this.state.user?.about &&
								<Cell multiline before={<Icon24Article style={{ paddingTop: 0, paddingBottom: 0 }} />}>
									{this.state.user.about}
								</Cell>}
							{/* {this.state.user?.mobile &&
								<Cell>
									<InfoRow header="Телефон">
										<Link href={"tel:" + this.state.user.mobile}>{this.state.user.mobile}</Link>
									</InfoRow>
								</Cell>}
							{this.state.user?.telegram &&
								<Cell>
									<InfoRow header="Telegram">
										<Link href={"tg://resolve?domain=" + this.state.user.telegram}>@{this.state.user.telegram}</Link>
									</InfoRow>
								</Cell>}
							{this.state.user?.email &&
								<Cell>
									<InfoRow header="Email">
										<Link href={"mailto:" + this.state.user.email}>{this.state.user.email}</Link>
									</InfoRow>
								</Cell>}
							{this.state.user?.about &&
								<Cell multiline>
									<InfoRow header="Дополнительно">
										{this.state.user.about}
									</InfoRow>
								</Cell>} */}
							{this.state.user?.userSkills?.length > 0 &&
								<Cell>
									<InfoRow header="Навыки">
										<SkillTokens selectedSkills={Utils.convertUserSkills(this.state.user?.userSkills)} />
									</InfoRow>
								</Cell>}
							<Div>
								{!this.state.readOnlyMode && !this.props.profileUser &&
									<Button mode="destructive" size='xl'
										onClick={() => this.confirmUser()}>
										Зарегистрироваться
									</Button>}
							</Div>
						</Group> :
						<Group>
							<UserTeams loading={this.state.loading} userTeams={this.state.user && this.state.user.userTeams} readOnlyMode={this.state.readOnlyMode} />
						</Group>
				}
				<Div>
					{this.state.recruitTeams && this.state.recruitTeams.length > 0 && < Button mode="primary" size='xl'
						onClick={() => setPage(activeView, 'setUserTeam')}
					>
						Завербовать
                    </Button>}
				</Div>
			</Panel>
		)
	}
}

const mapStateToProps = (state) => {

	return {
		user: state.user.user,
		profileUser: state.user.profileUser,
		profile: state.user.profile,
		activeStory: state.router.activeStory,
		activeView: state.router.activeView,
		activeTab: state.vkui.activeTab
	};
};

const mapDispatchToProps = {
	setPage,
	setUser,
	setProfileUser,
	goBack,
	setRecruitTeams,
	setActiveTab
};

export default connect(mapStateToProps, mapDispatchToProps)(User);