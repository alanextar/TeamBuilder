﻿import React from 'react';
import { Api } from '../infrastructure/api';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, InfoRow, Avatar,
    SimpleCell, FixedLayout, Separator
} from '@vkontakte/vkui';

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';

class TeamEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            membersDescription: '',
            team: null,
            events: [],
            eventId: null,
            usersNumber: 2,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription'
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
                    eventId: result.event && result.event.id
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
    }

    render() {
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.state.go} data-to={'teaminfo'} data-id={this.props.teamId} />}>
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
                                <Input top="Название команды" type="text" defaultValue={this.state.name} onChange={this.onNameChange} />

                                <Textarea top="Описание команды" defaultValue={this.state.description} onChange={this.onDescriptionChange} />
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
                                <Button>Создать Событие</Button>
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
                                        defaultValue={this.state.membersDescription}
                                        onChange={this.onMembersDescriptionChange} />
                                </FormLayout>

                                <InfoRow header='Участники'>
                                    {console.log('userTeams ', this.state.team.userTeams)}
                                    {this.state.team.userTeams &&
                                        this.state.team.userTeams.map((members, i) => {
                                            return (
                                                <SimpleCell
                                                    before={<Avatar size={48} />}
                                                    after={<Icon24DismissDark />}>
                                                    {members.user.firstName, members.user.fullName}
                                                </SimpleCell>
                                            )
                                        }
                                        )}
                                </InfoRow>

                            </Cell>
                    )}
                </Group>
                <FixedLayout vertical="bottom">
                    <Div>
                        <Button
                            stretched
                            onClick={e => { this.postEdit(); this.state.go(e) }}
                            data-to={'teaminfo'}
                            data-id={this.props.teamId} >
                            Применить Изменения
                        </Button>
                    </Div>
                </FixedLayout>
            </Panel>
        );
    }

};

export default TeamEdit;