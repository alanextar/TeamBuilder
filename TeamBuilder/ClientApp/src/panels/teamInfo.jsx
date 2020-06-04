import React from 'react';
import { Api, Urls } from '../infrastructure/api';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage, openPopout, closePopout } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";
import { setUser, setTeamUser, setProfileUser, addTeamToProfile } from "../store/user/actions";
import { setActiveTab } from "../store/vk/actions";

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow,
    SimpleCell, Avatar, Div, PullToRefresh, PanelHeaderContent, PanelHeaderContext,
    List, Alert
} from '@vkontakte/vkui';

import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import { countConfirmed } from "../infrastructure/utils";

class TeamInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: props.activeTeam,
            panelId: props.id,
            activeTab: props.activeTab["teamInfo"] || "teamDescription",
            edit: true,
            contextOpened: false,
            vkProfile: props.profile,
            profileUser: props.profileUser,
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

    componentDidUpdate(prevProps) {
        if (this.props.activeTeam !== prevProps.activeTeam) {
            this.setState({ team: this.props.activeTeam });
        }
    }

    componentWillUnmount() {
        const { setActiveTab } = this.props;
        setActiveTab("teamInfo", this.state.activeTab);
    }

    async populateTeamData() {
        const { setTeam } = this.props;
        Api.Teams.get(this.state.team.id)
            .then(result => { setTeam(result); this.setState({ team: result }) });
    }

    toggleContext() {
        this.setState({ contextOpened: !this.state.contextOpened });
    };
	//TODO рефакторинг обновления профиля после выполнения действий по команде
    //Подать заявку в команду
    async sendRequest() {
        const { setProfileUser } = this.props;

        let id = this.state.vkProfile.id;
        let teamId = this.state.team.id
		let isTeamOffer = false;

		let newUserTeam = {
			isOwner: false,
			team: this.state.team,
			teamId: teamId,
			userAction: 1,
			userId: this.props.profileUser.id
		};

        await Api.Users.setTeam(id, teamId, isTeamOffer)
            .then(team => {
				this.setState({ team: team });
				this.props.addTeamToProfile(newUserTeam);
            })
    };

    //Принять приглашение
    async joinTeam() {
		let profile = this.props.profileUser;
        let teamId = this.state.team.id;
        var userId = this.state.profileUser.id;

		await Api.Users.joinTeam(teamId);
		let userTeams = this.state.team.userTeams;

        userTeams.map((userTeam, i) => {
            (userTeam.userId === userId) && (userTeam.userAction = 2);
		})

        this.setState({
            team: {
                ...this.state.team,
                userTeams: userTeams
            }
		})

		let userTeamToUpd = profile.userTeams.find(x => x.teamId == teamId);
		userTeamToUpd.userAction = 2;
		this.props.setProfileUser(profile);
    };

    //Выйти из команды / отклонить приглашение
    async dropUser() {
        let userId = this.state.profileUser.id;
        let teamId = this.state.team.id;

        await Api.Teams.rejectedOrRemoveUser({ teamId: teamId, userId: userId })
            .then(json => {
				this.setState({ team: json });
				let profile = this.props.profileUser;
				let userTeamToUpd = profile.userTeams.find(x => x.teamId == teamId);

				switch (userTeamToUpd.userAction) {
					case 2:
						userTeamToUpd.userAction = 4;
					case 5:
						userTeamToUpd.userAction = 3;
				}

				this.props.setProfileUser(profile);
            })
    };

    //Удалить команду
    async deleteTeam() {
        let id = this.state.team.id
		await Api.Teams.delete(id);

		let profile = this.props.profileUser;
		teamsToRemove = profile.userTeams.find(x => x.teamId == id);
		const index = profile.userTeams.indexOf(teamsToRemove);
		if (index > -1) {
			profile.userTeams.splice(index, 1);
		}
		this.props.setProfileUser(profile);

        this.props.goBack();
    };

    //Отменить поданную в команду заявку
    async cancelUser(e, userTeam) {
        let teamId = userTeam.teamId;
        await Api.Users.cancelRequestTeam(teamId)
        let updateTeam = []
        this.state.team.userTeams.map((userTeam, i) => {
            (userTeam.userId != this.state.profileUser.id) && updateTeam.push(userTeam)
		})

        this.setState({
            team: {
                ...this.state.team,
                userTeams: updateTeam
            }
		})

		let profile = this.props.profileUser;
		let userTeamToUpd = profile.userTeams.find(x => x.teamId == teamId);
		//не нашел подходящего действия, поставил 4 чтобы команда не отображалась
		userTeamToUpd.userAction = 4;
		this.props.setProfileUser(profile);
    };

    openPopoutExit = () => {
        this.props.openPopout(
            <Alert
                actionsLayout="vertical"
                actions={[{
                    title: 'Выйти из команды',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => this.dropUser(),
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

    openPopoutDecline = (e, userInActiveTeam) => {
        this.props.openPopout(
            <Alert
                actionsLayout="vertical"
                actions={[{
                    title: 'Отклонить приглашение',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => this.dropUser(e, userInActiveTeam),
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

    openPopoutDeleteTeam = () => {
        this.props.openPopout(
            <Alert
                actionsLayout="vertical"
                actions={[{
                    title: 'Удалить команду',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => { this.deleteTeam() },
                }, {
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel'
                }]}
                onClose={() => this.props.closePopout()}
            >
                <h2>Подтвердите действие</h2>
                <p>Вы уверены, что хотите удалить команду?</p>
            </Alert>
        );
    };

    getPanelHeaderContext = (isOwner, isModerator, userAction, userInActiveTeam, isUserInActiveTeam, confirmedUser) => {
        const { setPage, activeView } = this.props;
        return (
            this.state.team && <PanelHeaderContext opened={this.state.contextOpened} onClose={this.toggleContext}>
                {(isOwner || isModerator) &&
                    <List>
                        <Cell onClick={() => setPage(activeView, 'teamEdit')}>
                        Редактировать команду
                         </Cell>
                    <Cell onClick={() => { this.openPopoutDeleteTeam() }}>
                            Удалить команду
                         </Cell>
                    </List>
                    || userAction === 1 &&
                    <List>
                        <Cell>
                            Заявка на рассмотрении
                                </Cell>
                        <Cell onClick={(e) => this.cancelUser(e, userInActiveTeam)}>
                            Отменить заявку
                                </Cell>
                    </List>
                    || userAction === 2 &&
                    <List>
                        <Cell onClick={() => this.openPopoutExit()}>
                            Выйти из команды
                                </Cell>
                    </List>
                    || userAction === 5 &&
                    <List>
                        <Cell onClick={() => this.joinTeam()}>
                            Принять приглашение
                                </Cell>
                        <Cell
                            onClick={(e) => this.openPopoutDecline(e, userInActiveTeam)}>
                            Отклонить приглашение
                                </Cell>
                    </List>
                    || (!isUserInActiveTeam || userAction == 3 || userAction == 4) &&
                    confirmedUser < this.state.team.numberRequiredMembers &&
                    <List>
                        <Cell onClick={() => this.sendRequest()}>
                            Подать заявку в команду
                                </Cell>
                    </List>
                    || confirmedUser > this.state.team.numberRequiredMembers &&
                    <List>
                        <Cell>
                            В команде нет мест
                                </Cell>
                    </List>
                }
            </PanelHeaderContext>
        )
    }

    render() {
        const { goBack, setTeamUser, setUser, setPage, activeView } = this.props;
        let userInActiveTeam = this.state.vkProfile && this.state.team.userTeams &&
            this.state.team.userTeams.find(user => user.userId === this.state.vkProfile.id);
        let isUserInActiveTeam = userInActiveTeam != null;
        let isOwner = isUserInActiveTeam && userInActiveTeam && userInActiveTeam.isOwner;
        let isModerator = this.state.profileUser && this.state.profileUser.isModerator;
        let userAction = userInActiveTeam && userInActiveTeam.userAction;
        let confirmedUser = countConfirmed(this.state.team.userTeams);
        let teamCap = this.state.team.userTeams.find(x => x.isOwner) && this.state.team.userTeams.find(x => x.isOwner).user

        return (
            <Panel id={this.state.panelId}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { goBack(); }} />}>
                    {this.state.profileUser ?
                        <PanelHeaderContent
                            aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
                            onClick={(e) => { this.toggleContext(); }}>
                            Команда
                        </PanelHeaderContent> :
                        `Команда`}
                </PanelHeader>
                {this.getPanelHeaderContext(isOwner, isModerator, userAction, userInActiveTeam, isUserInActiveTeam, confirmedUser)}
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
                                    <SimpleCell>
                                        <InfoRow header='Участвуем в '>
                                            {this.state.team.event && this.state.team.event.name}
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
                                            {teamCap && <SimpleCell key={-1}
                                                onClick={() => {
                                                    setPage(activeView, 'user');
                                                    setUser(teamCap);
                                                    setTeamUser(teamCap)
                                                }}
                                                before={<Avatar size={48} src={teamCap.photo100} />}
                                                after={<Icon28MessageOutline />}>
                                                {teamCap.fullName}
                                            </SimpleCell>}
                                            {this.state.team.userTeams &&
                                                this.state.team.userTeams.map((userTeam, i) => {
                                                    console.log('userTeam out', userTeam);
                                                    return (
                                                        userTeam.userAction === 2 &&
                                                        <SimpleCell key={i}
                                                            onClick={() => {
                                                                setPage(activeView, 'user');
                                                                setUser(userTeam.user);
                                                                setTeamUser(userTeam.user)
                                                            }}
                                                            before={<Avatar size={48} src={userTeam.user && userTeam.user.photo100} />}
                                                            after={<Icon28MessageOutline />}>
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
        activeTeam: state.team.activeTeam,
        activeView: state.router.activeView,
        profile: state.user.profile,
        profileUser: state.user.profileUser,
        activeTab: state.vkui.activeTab
    };
};

const mapDispatchToProps = {
    setPage,
    setTeam,
    setUser,
    goBack,
    setActiveTab,
    setTeamUser,
    setProfileUser,
    openPopout,
	closePopout,
	addTeamToProfile
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInfo);
