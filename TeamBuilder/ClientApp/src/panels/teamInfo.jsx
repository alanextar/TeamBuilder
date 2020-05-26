import React from 'react';
import { Api } from '../infrastructure/api';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";
import { setUser, setTeamUser } from "../store/user/actions";

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

        console.log(`props.activeTeam ${props.activeTeam}`);
        console.log(`props.activeTeam.str ${JSON.stringify(props.activeTeam)}`);
        this.state = {
            team: props.activeTeam,
            panelId: props.id,
            activeTab: 'teamDescription',
            edit: true,
            contextOpened: false,
            vkProfile: props.profile,
            ourProfile: props.profileUser
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

    // componentDidMount() {
    //     this.populateTeamData();
    // }

    async populateTeamData() {
        Api.Teams.get(this.state.team.id)
            .then(result => this.setState({ team: result }))
    }

    toggleContext() {
        this.setState({ contextOpened: !this.state.contextOpened });
    };

    async sendRequest(e, user, team) {
        await Api.Users.setTeam({ userId: user.id, teamId: team.id })
            .then(json => {
                this.setState({ team: json })
            })
    };

    async dropUser(e, userTeam) {
        await Api.Teams.rejectedOrRemoveUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(json => {
                console.log('on drop click ', JSON.stringify(json))
                this.setState({ team: json })
            })
    };

    async cancelUser(e, userTeam) {
        await Api.Teams.cancelRequestUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(json => {
                console.log('on cancel click ', JSON.stringify(json))
                this.setState({ team: json })
            })
    };

    render() {
        const { id, goBack, setTeam, setTeamUser, setUser, setPage } = this.props;
        console.log(`teamId: ${this.state.team && this.state.team.id}`);
        console.log('vkprofile', this.state.vkProfile);
        console.log('profile', this.state.ourProfile);
        console.log('team', this.state.team);
        return (
            <Panel id={this.state.panelId}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                    {this.state.ourProfile ?
                        <PanelHeaderContent
                            aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
                            onClick={this.toggleContext}
                        >
                            {this.state.team && this.state.team.name.length > 15 ? `${this.state.team.name.substring(0, 15)}...` : this.state.team.name}
                        </PanelHeaderContent> :
                        this.state.team.name}
                </PanelHeader>
                <PanelHeaderContext opened={this.state.contextOpened} onClose={this.toggleContext}>
                    {this.state.team.userTeams.find(user => user.isOwner).userId === this.state.vkProfile.id &&
                        <List>
                            <Cell
                                onClick={() => setPage('teams', 'teamEdit')}
                            >
                                Редактировать команду
                            </Cell>
                        </List>
                        || this.state.team.userTeams.find(user => user.userId === this.state.vkProfile.id).userAction === 1 &&
                        <List>
                            <Cell>
                                Заявка на рассмотрении
                            </Cell>
                        </List>
                        || this.state.team.userTeams.find(user => user.userId === this.state.vkProfile.id).userAction === 2 &&
                        <List>
                            <Cell onClick={(e) => this.dropUser(e, this.state.team.userTeams.find(user => user.userId === this.state.vkProfile.id))}>
                                удалиться из команды
                            </Cell>
                        </List>
                        || this.state.team.userTeams.find(user => user.userId === this.state.vkProfile.id).userAction === 5 &&
                        <List>
                            <Cell
                                onClick={() => setPage('teams', 'teamEdit')}
                            >
                                Принять заявку /// nonono add teamcontroller
                            </Cell>
                            <Cell
                                onClick={(e) => this.cancelUser(e, this.state.team.userTeams.find(user => user.userId === this.state.vkProfile.id))}
                            >
                                Отклонить заявку
                            </Cell>
                        </List>
                        || this.state.team.userTeams.length < this.state.team.numberRequiredMembers &&
                        <List>
                            <Cell onClick={(e) => this.sendRequest(e, this.state.vkProfile, this.state.team)}>
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
                </PanelHeaderContext>
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
                                    {console.log('==== ', this.state.team)}
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
                                        {console.log('userTeams ', this.state.team.userTeams)}
                                            {this.state.team.userTeams &&
                                                this.state.team.userTeams.map((userTeam, i) => {
                                                    return (
                                                        userTeam.userAction === 2 &&
                                                        <SimpleCell key={i}
                                                            onClick={() => {
                                                                setPage('teams', 'user');
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
        profile: state.user.profile,
        profileUser: state.user.profileUser
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setTeam, setUser, goBack, setTeamUser }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInfo);
