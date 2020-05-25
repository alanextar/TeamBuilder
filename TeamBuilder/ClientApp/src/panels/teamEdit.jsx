import React from 'react';
import { Api } from '../infrastructure/api';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, InfoRow, Avatar,
    RichCell
} from '@vkontakte/vkui';

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';

class TeamEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            membersDescription: '',
            team: this.props.activeTeam,
            events: [],
            eventId: null,
            usersNumber: 2,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription',
            userTeams: null,
        };

        this.onEventChange = this.onEventChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onMembersDescriptionChange = this.onMembersDescriptionChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.postEdit = this.postEdit.bind(this);
    }

    componentDidMount() {
        this.populateEventsData();
        this.populateTeamData();
    }

    async populateEventsData() {
        Api.Events.getAll()
            .then(result => this.setState({ events: result, }));
    }

    async populateTeamData() {
        Api.Teams.get(this.props.teamId)
            .then(result =>
                this.setState({
                    team: result,
                    name: result.name,
                    description: result.description,
                    membersDescription: result.descriptionRequiredMembers,
                    usersNumber: result.numberRequiredMembers,
                    eventId: result.event && result.event.id,
                    userTeams: result.userTeams
                }));
    }

    onEventChange(e) {
        console.log(`event.team: ${e.target.value}`)
        this.setState({ eventId: e.target.value })
    }

    onNameChange(e) {
        console.log(`event.Name: ${e.target.value}`)
        this.setState({ name: e.target.value })
    }

    onDescriptionChange(e) {
        console.log(`event.Description: ${e.target.value}`)
        this.setState({ description: e.target.value })
    }

    onMembersDescriptionChange(e) {
        this.setState({ membersDescription: e.target.value })
    }

    async postEdit(e) {
        var editTeamViewModel = {
            id: this.state.team.id,
            name: this.state.name,
            description: this.state.description,
            numberRequiredMembers: this.state.usersNumber,
            descriptionRequiredMembers: this.state.membersDescription,
            eventId: this.state.eventId
        }
        Api.Teams.edit(editTeamViewModel);
    };

    async handleJoin(e, userTeam) {
        e.stopPropagation();
        console.log('into handleJoin');
        console.log(userTeam);
        const response = await fetch(`/api/user/joinTeam/?id=${userTeam.userId}&teamId=${userTeam.teamId}`);
        const data = await response.json();
        console.log(data);
        this.setState({ userTeams: data });
    };

    async dropUser(e, userTeam) {
        await Api.Teams.rejectedOrRemoveUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(json => {
                console.log('on drop click ', JSON.stringify(json))
                this.setState({ userTeams: json })
            })
    };

    async cancelUser(e, userTeam) {
        await Api.Teams.cancelRequestUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(json => {
                console.log('on cancel click ', JSON.stringify(json))
                this.setState({ userTeams: json })
            })
    };

    render() {
        const { id, goBack, setTeam, setPage } = this.props;

        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                    {this.state.team && this.state.name}
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
                                    value={this.state.eventId ? this.state.eventId : ''}
                                    name="eventId"
                                >
                                    {this.state.events && this.state.events.map((ev, i) => {
                                        return (
                                            <option value={ev.id} key={i}>
                                                {ev.name}
                                            </option>
                                        )
                                    })}

                                </Select>
                                <Button onClick={() => { setPage('teams','eventCreate') }}>Создать Событие</Button>
                            </FormLayout>
                            :
                            <Cell>
                                <FormLayout >
                                    <Slider
                                        step={1}
                                        min={2}
                                        max={10}
                                        value={Number(this.state.usersNumber)}
                                        onChange={usersNumber => this.setState({ usersNumber })}
                                        top="Количество участников в команде"
                                    />
                                    <Input value={String(this.state.usersNumber)} onChange={e => this.setState({ usersNumber: e.target.value })} type="number" />
                                    <Textarea
                                        top="Описание участников и их задач"
                                        defaultValue={this.state.team.membersDescription}
                                        onChange={this.onMembersDescriptionChange} />
                                </FormLayout>

                                <InfoRow header='Участники'>
                                    {console.log('userTeams ', this.state.team.userTeams)}
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
                                                    {userTeam.user.fullName }
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
                        onClick={(e) => { this.postEdit(); goBack() }}
                        data-to={'teaminfo'}
                        data-id={this.props.teamId} >
                        Сохранить
                        </Button>
                </Div>
                </ Group>

            </Panel >
        );
    }

};

const mapStateToProps = (state) => {
    return {
        activeTeam: state.team.activeTeam,
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setTeam, goBack }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamEdit);