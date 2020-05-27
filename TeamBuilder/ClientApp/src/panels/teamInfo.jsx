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
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

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
        // Typical usage (don't forget to compare props):
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

        console.log('setTeam get request (id, teamId):', id, teamId)
        await Api.Users.setTeam(id, teamId, isTeamOffer)
            .then(json => {
                this.setState({ team: json });
                var user = this.state.profileUser;
                user.userAction = 1; // отправил запрос, может отозвать заявку
                setProfileUser(user);
            })
    };


    async joinTeam() {
        var teamId = this.state.team.id;
        var userId = this.state.profileUser.id;

        await Api.Teams.joinTeam(userId, teamId)
            .then(json => {
                console.log('on jonTeam click ', JSON.stringify(json))
                this.setState({ team: json });
            })
    };

    async dropUser() {
        var userId = this.state.profileUser.id;
        var teamId = this.state.team.id;

        await Api.Teams.rejectedOrRemoveUser({ teamId: teamId, userId : userId })
            .then(json => {
                console.log('on drop click ', JSON.stringify(json))
                this.setState({ team: json })
            })
    };

    async cancelUser(e, userTeam) {
        let teamId = userTeam.teamId;
        let id = userTeam.userId;
        let isTeamOffer = false;

        await Api.Teams.cancelRequestUser({ teamId, id })
            .then(json => {
                console.log('on cancel click ', JSON.stringify(json))
                this.setState({ team: json });
                var profileUser = profileUser;
                profileUser.userAction = 1;
                setProfileUser(profileUser);
            })
    };

    render() {
        console.log('profileUser', this.state.profileUser);
        console.log('userTeams', this.state.vkProfile.id);
        const { goBack, setTeamUser, setUser, setPage, activeView } = this.props;
        console.log('userTeams', this.state.team.userTeams);
        let userInActiveTeam = this.state.vkProfile && this.state.team.userTeams &&
            this.state.team.userTeams.find(user => user.userId === this.state.vkProfile.id);
        let isUserInActiveTeam = userInActiveTeam != null;
        console.log('is user In Active Team', isUserInActiveTeam);
        let isOwner = isUserInActiveTeam && userInActiveTeam && userInActiveTeam.isOwner;
        console.log('userInActiveTeam isOwner', isOwner);
        let userAction = userInActiveTeam && userInActiveTeam.userAction;
        console.log('userInActiveTeam userAction', userAction);

        return (
            <Panel id={this.state.panelId}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { console.log('goback'); goBack(); }} />}>
                    {this.state.profileUser ?
                        <PanelHeaderContent
                            aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
                            onClick={(e) => { console.log('Dropdown'); this.toggleContext(); }}
                        >
                            {this.state.team && this.state.team.name.length > 15 ? `${this.state.team.name.substring(0, 15)}...` : this.state.team.name}
                        </PanelHeaderContent> :
                        this.state.team.name}
                </PanelHeader>
                {this.state.team && <PanelHeaderContext opened={this.state.contextOpened} onClose={this.toggleContext}>
                    {isOwner &&
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
                                удалиться из команды
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
                        //профиля нет в текущей команде и команда не полная
                        || !userAction && this.state.team.userTeams.length < this.state.team.numberRequiredMembers &&
                        <List>
                            <Cell onClick={() => this.sendRequest()}>
                                Подать заявку в команду
                            </Cell>
                        </List>
                        ||
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
                                    <SimpleCell>
                                        <InfoRow header='Описание команды'>
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
                                    <Div>
                                        <InfoRow header='Участники'>
                                            Требуется {this.state.team.numberRequiredMembers} участников
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
                                                            before={<Avatar size={48} src={userTeam.user.photo100} />}
                                                            after={<Icon28MessageOutline />}>
                                                            {userTeam.user.fullName}
                                                        </SimpleCell>

                                                    )
                                                }
                                                )}
                                        </InfoRow>
                                    </Div>
                                    <Div>
                                        <InfoRow header='Описание задач'>
                                            {this.state.team.descriptionRequiredMembers}
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
