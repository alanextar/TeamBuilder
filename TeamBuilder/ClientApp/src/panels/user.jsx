import React from 'react';
import { connect } from 'react-redux';
import {
	Panel, PanelHeader, Group, Cell, Avatar, Button, Div, PanelHeaderBack,
	Tabs, TabsItem, Separator, Checkbox, InfoRow, Header, Title, Link, Switch
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28MailOutline from '@vkontakte/icons/dist/28/mail_outline';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import Icon28Send from '@vkontakte/icons/dist/28/send';
import UserTeams from './userTeams'
import { Api } from '../infrastructure/api';
import * as Utils from '../infrastructure/utils';
import { goBack, setPage } from '../store/router/actions';
import { setUser, setProfileUser, setRecruitTeams } from '../store/user/actions';
import { setActiveTab } from "../store/vk/actions";
import SkillTokens from './SkillTokens';

class User extends React.Component {
	constructor(props) {
		super(props);

		let isSearchable = props.user && props.user.isSearchable;

		this.state = {
			vkProfile: props.profile,
			profileUser: props.profileUser,
			user: props.user,
			activeTab: props.activeTab["profile"] || "main",
			isConfirmed: false,
			isSearchable: isSearchable ? isSearchable : false,
			readOnlyMode: props.activeStory != 'user',
			recruitTeams: []
		}

		this.confirmUser = this.confirmUser.bind(this);

	}

	componentDidMount() {
		this.state.vkProfile && this.fetchUserData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.user !== prevProps.user) {
			this.setState({ user: this.props.user });
		}
	}

	componentWillUnmount() {
		const { setActiveTab } = this.props;
		setActiveTab("profile", this.state.activeTab);
	}

	fetchUserData() {
		const { setRecruitTeams } = this.props;
		let id = this.state.readOnlyMode ? this.state.user.id : this.state.vkProfile.id;
		//TODO преобразовать в один запрос типа getProfileUserWithRelation - получить профиль с командами в которые можно вербовать юзера
		Api.Users.get(id).then(user => {
			setUser(user);
			this.setState({ user: user });
		});

		Api.Users.get(this.state.vkProfile.id).then(user => {
			setProfileUser(user);
		});

		if (this.state.profileUser && this.state.profileUser.anyTeamOwner && this.state.user.isSearchable) {
			Api.Users.getRecruitTeams(this.state.vkProfile.id, id)
				.then(data => { setRecruitTeams(data); this.setState({ recruitTeams: data }) });
		}

	}

	async confirmUser() {
		const { setUser, setProfileUser } = this.props;

		if (!this.state.vkProfile)
			return;

		var profileViewModel = {
			id: this.state.vkProfile.id,
			firstName: this.state.vkProfile.first_name,
			lastName: this.state.vkProfile.last_name,
			photo100: this.state.vkProfile.photo_100,
			photo200: this.state.vkProfile.photo_200
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
				<PanelHeader separator={false} left={this.state.readOnlyMode &&
					<PanelHeaderBack onClick={() => goBack()} />}>{this.state.readOnlyMode ? 'Участник' : 'Профиль'}</PanelHeader>
				{this.state.readOnlyMode
					? this.state.user &&
					<Group title="VK Connect">
						<Link href={"https://m.vk.com/id" + this.state.user.id} target="_blank">
							<Cell description={this.state.user.city ? this.state.user.city : ''}
								before={this.state.user.photo100 ? <Avatar src={this.state.user.photo100} /> : null}>
								{`${this.state.user.firstName} ${this.state.user.lastName}`}
							</Cell>
						</Link>
					</Group>
					: this.state.vkProfile &&
					<Group title="VK Connect">
						<Link href={"https://m.vk.com/id" + this.state.vkProfile.id} target="_blank">
							<Cell description={this.state.vkProfile.city && this.state.vkProfile.city.title ? this.state.vkProfile.city.title : ''}
								before={this.state.vkProfile.photo_200 ? <Avatar src={this.state.vkProfile.photo_200} /> : null}>
								{`${this.state.vkProfile.first_name} ${this.state.vkProfile.last_name}`}
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
									<Link style={{ color: "#3f8ae0" }} onClick={() => setPage('user', 'userEdit')}>Редактировать</Link>
								}>
								Информация
                                </Header>}>
							{/* <List>
                                <Cell before={<Icon28PhoneOutline />}>
                                    тел.: {this.state.user && <Link href={"tel:" + this.state.user.mobile}>{this.state.user.mobile}</Link>}
                                </Cell>
                                <Cell before={<Icon28Send />}>
                                    telegram: {this.state.user && <Link href={"tg://resolve?domain=" + this.state.user.telegram}>{this.state.user.telegram}</Link>}
                                </Cell>
                                <Cell before={<Icon28MailOutline />}>
                                    email: {this.state.user && <Link href={"mailto:" + this.state.user.email}>{this.state.user.email}</Link>}
                                </Cell>
                                <Cell before={<Icon28ArticleOutline />}>
                                    дополнительно: {this.state.user && this.state.user.about}
                                </Cell>
                            </List> */}
							{this.state.user?.mobile &&
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
								<Cell>
									<InfoRow header="Дополнительно">
										{this.state.user.about}
									</InfoRow>
								</Cell>}
							{this.state.user?.userSkills?.length > 0 &&
								<Div>
									<Title level="3" weight="regular" style={{ marginBottom: 4 }}>Скиллы:</Title>
									{/*SkillTokens - просто прямоугольники без селекта для отображения в информации об участнике*/}
									<SkillTokens selectedSkills={Utils.convertSkills(this.state.user?.userSkills)} />
								</Div>}
							<Div>
								<Cell asideContent={
									<Switch disabled={true}
										onChange={() => this.setState({ isSearchable: !this.state.isSearchable })}
										checked={this.state.isSearchable} />}>
									Ищу команду
                                    </Cell>
								{!this.state.readOnlyMode && !this.props.profileUser &&
									<Button mode="destructive" size='xl'
										onClick={() => this.confirmUser()}>
										Подтвердить
									</Button>}
							</Div>
						</Group> :
						<Group>
							<UserTeams readOnlyMode={this.state.readOnlyMode} userTeams={this.state.user && this.state.user.userTeams} readOnlyMode={this.state.readOnlyMode} />
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