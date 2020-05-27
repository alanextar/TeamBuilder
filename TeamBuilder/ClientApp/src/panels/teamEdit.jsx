import React from 'react';
import { Api, Urls } from '../infrastructure/api';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, InfoRow, Avatar,
    RichCell, FixedLayout
} from '@vkontakte/vkui';

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';

class TeamEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: this.props.activeTeam,
            events: [],
            usersNumber: 50,
            activeTab: 'teamDescription',
            panelId: props.id
        };

        this.onEventChange = this.onEventChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onMembersDescriptionChange = this.onMembersDescriptionChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.postEdit = this.postEdit.bind(this);
    }

    componentDidMount() {
        this.populateEventsData();
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.activeTeam !== prevProps.activeTeam) {
            this.setState({ team: this.props.activeTeam });
        }
    }

    async populateEventsData() {
        Api.Events.getAll()
            .then(result => this.setState({ events: result, }));
    }

    onEventChange(e) {
        var team = this.state.team;
        team.eventId = e.target.value;
        this.setState({ team: team })
    }

    onNameChange(e) {
        var team = this.state.team;
        team.name = e.target.value;
        this.setState({ team: team })
    }

    onDescriptionChange(e) {
        var team = this.state.team;
        team.description = e.target.value;
        this.setState({ team: team })

    }

    onMembersDescriptionChange(e) {
        var team = this.state.team;
        team.membersDescription = e.target.value;
        this.setState({ team: team })
    }

    async postEdit() {
        const { setTeam } = this.props;

        var editTeamViewModel = {
            id: this.state.team.id,
            name: this.state.team.name,
            description: this.state.team.description,
            numberRequiredMembers: this.state.usersNumber,
            descriptionRequiredMembers: this.state.team.membersDescription,
            eventId: this.state.team.eventId
        }
        Api.Teams.edit(editTeamViewModel)
            .then(t => setTeam(t));
    };

    async handleJoin(e, userTeam) {
        e.stopPropagation();
        Api.Users.joinTeam(userTeam.userId, userTeam.teamId)
            .then(result => this.updateUserTeamsState(result));
    };

    async dropUser(e, userTeam) {
        await Api.Teams.rejectedOrRemoveUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(userTeams => {
                console.log('on drop click ', JSON.stringify(userTeams))

                this.updateUserTeamsState(userTeams);
            })
    };

    async cancelUser(e, userTeam) {
        await Api.Teams.cancelRequestUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(userTeams => {
                console.log('on cancel click ', JSON.stringify(userTeams))

                this.updateUserTeamsState(userTeams)
            })
    };

    updateUserTeamsState(userTeams) {
        const { setTeam } = this.props;
        var team = this.state.team;
        team.userTeams = userTeams;
        this.setState({ team: team });
        setTeam(team);
    }

    render() {
        const { goBack, setPage, activeView } = this.props;

        return (
            <Panel id={this.state.panelId}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                    {this.state.team && this.state.team.name}
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
                    {this.state.team && (
                        this.state.activeTab === 'teamDescription' ?
                            <FormLayout >
                                <Input top="Название команды" type="text" defaultValue={this.state.team.name} onChange={this.onNameChange} />
                                <Textarea top="Описание команды" defaultValue={this.state.team.description} onChange={this.onDescriptionChange} />
                                <Select
                                    top="Выберете событие"
                                    placeholder="Событие"
                                    onChange={this.onEventChange}
                                    value={this.state.team && this.state.team.eventId}
                                    name="eventId">
                                    {this.state.events && this.state.events.map((ev, i) => {
                                        return (
                                            <option value={ev.id} key={i}>
                                                {ev.name}
                                            </option>
                                        )
                                    })}

                                </Select>
                                <Button onClick={() => { setPage(activeView, 'eventCreate') }}>Создать Событие</Button>
                            </FormLayout>
                            :
                            <Cell>
                                <FormLayout >
                                    {/*<Slider
                                        step={1}
                                        min={0}
                                        max={50}
                                        value={Number(this.state.usersNumber)}
                                        onChange={usersNumber => this.setState({ usersNumber })}
                                        top="Количество участников в команде"
                                    />*/}
                                    <Input value={String(this.state.usersNumber)} onChange={e => this.setState({ usersNumber: e.target.value })} type="number" />
                                    <Textarea
                                        top="Описание участников и их задач"
                                        value={this.state.team.membersDescription}
                                        onChange={this.onMembersDescriptionChange} />
                                </FormLayout>

                                <InfoRow header='Участники'>
                                    {this.state.team.userTeams &&
                                        this.state.team.userTeams.map((userTeam, i) => {
                                            return (
                                                (userTeam.userAction === 1 || userTeam.userAction === 2 || userTeam.userAction === 5) &&
                                                <RichCell key={i}
                                                    before={<Avatar size={48} />}
                                                    after={userTeam.userAction === 2 && <Icon24DismissDark
                                                        onClick={(e) => this.dropUser(e, userTeam)} />}
                                                    actions={
                                                        userTeam.userAction === 1 &&
                                                        <React.Fragment>
                                                            <Button
                                                                onClick={(e) => this.handleJoin(e, userTeam)}>Принять</Button>
                                                            <Button mode="secondary"
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
                                </InfoRow>

                            </Cell>
                    )}
                    <Div>
                        <Button
                            stretched
                            onClick={() => { this.postEdit(); goBack() }}>
                            Применить Изменения
                        </Button>
                    </Div>
                </Group>
            </Panel>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        activeTeam: state.team.activeTeam,
        activeView: state.router.activeView
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setTeam, goBack }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamEdit);