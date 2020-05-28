import React from 'react';
import { Api } from '../infrastructure/api';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";
import { setUser, setTeamUser, setProfileUser } from "../store/user/actions";

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow,
    SimpleCell, Avatar, Div, PullToRefresh, FixedLayout, PanelHeaderContent, PanelHeaderContext,
    List,
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
            activeTab: 'teamDescription',
            edit: true,
            contextOpened: false,
            vkProfile: props.profile,
            profileUser: props.profileUser
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

    async populateTeamData() {
        const { setTeam } = this.props;
        Api.Teams.get(this.state.team.id)
            .then(result => { setTeam(result); this.setState({ team: result }) });
    }

    toggleContext() {
        this.setState({ contextOpened: !this.state.contextOpened });
    };

    async sendRequest() {
        const { setProfileUser } = this.props;

        let id = this.state.vkProfile.id;
        let teamId = this.state.team.id
        let isTeamOffer = false;

        await Api.Users.setTeam(id, teamId, isTeamOffer)
            .then(json => {
                this.setState({ team: json });
                var user = this.state.profileUser;
                user.userAction = 1;
                setProfileUser(user);
            })
    };


    async joinTeam() {
        var teamId = this.state.team.id;
        var userId = this.state.profileUser.id;

        await Api.Teams.joinTeam(userId, teamId)
            .then(data => {
                this.setState({ team: data });
            })
    };

    async dropUser() {
        var userId = this.state.profileUser.id;
        var teamId = this.state.team.id;

        await Api.Teams.rejectedOrRemoveUser({ teamId: teamId, userId: userId })
            .then(json => {
                this.setState({ team: json })
            })
    };

    async cancelUser(e, userTeam) {
        let teamId = userTeam.teamId;
        let userId = userTeam.userId;

        await Api.Teams.cancelRequestUser({ teamId, userId })
            .then(json => {
                this.setState({ team: json });
                var profileUser = profileUser;
                profileUser.userAction = 1;
                setProfileUser(profileUser);
            })
    };

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
                {this.state.team && <PanelHeaderContext opened={this.state.contextOpened} onClose={this.toggleContext}>
                    {(isOwner || isModerator) &&
                        <List>
                            <Cell
                                onClick={() => setPage(activeView, 'teamEdit')}
                            >
                                Редактировать команду
                            </Cell>
                        </List>
                        || userAction === 1 &&
                        <List>
                            <Cell>
                                Заявка на рассмотрении
                            </Cell>
                        </List>
                        || userAction === 2 &&
                        <List>
                            <Cell onClick={(e) => this.dropUser(e, userInActiveTeam)}>
                                Выйти из команды
                            </Cell>
                        </List>
                        || userAction === 5 &&
                        <List>
                            <Cell
                                onClick={() => this.joinTeam()}
                            >
                                Принять заявку
                            </Cell>
                            <Cell
                                onClick={(e) => this.cancelUser(e, userInActiveTeam)}
                            >
                                Отклонить заявку
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
                </PanelHeaderContext>}
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
                                            Требуется {this.state.team.numberRequiredMembers} участников
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
        profileUser: state.user.profileUser
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setTeam, setUser, goBack, setTeamUser, setProfileUser }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInfo);
