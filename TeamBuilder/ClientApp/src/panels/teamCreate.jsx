import React from 'react';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, FixedLayout
} from '@vkontakte/vkui';
import qwest from 'qwest';
import { Api } from '../infrastructure/api';

class TeamCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            membersDescription:'',
            events: null,
            check: null,
            usersNumber: 2,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription'
        };

        this.onChange = this.onChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onMembersDescriptionChange = this.onMembersDescriptionChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.postCreate = this.postCreate.bind(this);
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateTeamData() {
        var self = this;
        qwest.get(Api.Events.GetAll,
            {},
            {
                cache: true
            })
            .then((xhr, resp) => {
                if (resp) {
                    console.log("events getall", resp)
                    self.setState({ events: resp });
                }
            })
            .catch((error) =>
                console.log(`Error for get all events: Details: ${error}`));
    }

    onChange(e) {
        const { check, value } = e.currentTarget;
        this.setState({ check: value });
    }

    onNameChange(e) {
        const { name, value } = e.currentTarget;
        this.setState({ name: value })
    }

    onDescriptionChange(e) {
        const { description, value } = e.currentTarget;
        this.setState({ description: value })
    }

    onMembersDescriptionChange(e) {
        const { membersDescription, value } = e.currentTarget;
        this.setState({ membersDescription: value })
    }

    async postCreate() {
        let name = this.state.name;
        let description = this.state.description;
        let numberRequiredMembers = this.state.usersNumber;
        let eventId = this.state.check;
        let descriptionRequiredMembers = this.state.membersDescription;
        var createTeamViewModel = { name, description, numberRequiredMembers, descriptionRequiredMembers, eventId };

        let response = await fetch('/api/teams/create', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createTeamViewModel)
        });
    }

    render() {
        const check = this.state.check;
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.state.go} data-to='teams' />}>
                    Новая команда
                </PanelHeader>
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
                <Group>
                    {this.state.activeTab === 'teamDescription' ?
                        <FormLayout >
                            <Input top="Название команды" type="text" placeholder="DreamTeam" onChange={this.onNameChange} defaultValue={this.state.name} />
                            <Textarea top="Описание команды" onChange={this.onDescriptionChange} defaultValue={this.state.description} />
                            <Select
                                top="Выберете событие"
                                placeholder="Событие"
                                status={check ? 'valid' : 'error'}
                                bottom={check ? '' : 'Пожалуйста, выберете или создайте событие'}
                                onChange={this.onChange}
                                value={check}
                                name="check"
                            >
                                {this.state.events && this.state.events.map((ev, i) => {
                                    return (
                                        <option value={ev.id}>
                                            {ev.name}
                                        </ option>
                                    )
                                })}

                            </Select>
                            <Button onClick={this.state.go}
                                data-to={'eventCreate'}
                                data-from={this.state.id}>Создать Событие</Button>
                        </ FormLayout>
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
                                <Textarea top="Описание участников и их задач" onChange={this.onMembersDescriptionChange} defaultValue={this.state.membersDescription} />
                            </ FormLayout>
                        </ Cell>}
                </ Group>
                <FixedLayout vertical="bottom">
                    <Div>
                        {this.state.check && (
                        <Button 
                            stretched={ true }
                            onClick={(e) => { this.postCreate(); this.state.go(e) }}
                            data-to={'teams'}>Создать Команду
                        </Button> )}
                    </Div>
                </ FixedLayout>
            </Panel>
        );
    }

};

export default TeamCreate;