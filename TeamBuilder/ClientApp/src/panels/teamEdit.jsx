import React from 'react';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, InfoRow, Avatar,
    SimpleCell, FixedLayout
} from '@vkontakte/vkui';

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';

class TeamEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            description: null,
            membersDescription: null,
            team: null,
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
        this.postEdit = this.postEdit.bind(this);
    }

    componentDidMount() {
        this.populateEventsData();
        this.populateTeamData();
    }

    async populateEventsData() {
        const response = await fetch(`/api/event/getall`);
        const data = await response.json();
        console.log('event from teamEdit', data)
        this.setState({
            events: data,
        });
    }

    async populateTeamData() {
        const response = await fetch(`/api/teams/get/${this.props.teamId}`);
        const data = await response.json();
        console.log('data from teamEdit', data)
        this.setState({
            team: data,
            name: data.name,
            description: data.description,
            membersDescription: data.descriptionRequiredMembers,
            usersNumber: data.numberRequiredMembers,
            check: data.event.id
        });
    }

    onChange(e) {
        const { check, value } = e.currentTarget;
        this.setState({ check: value });
    }

    onNameChange(e) {
        const { name, value } = e.currentTarget;
        console.log('change name ', value);
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

    async postEdit() {
        let id = this.state.team.id;
        let name = this.state.name;
        let description = this.state.description;
        let numberRequiredMembers = this.state.usersNumber;
        let eventId = this.state.check;
        let descriptionRequiredMembers = this.state.membersDescription;
        var editTeamViewModel = { id, name, description, numberRequiredMembers, descriptionRequiredMembers, eventId };

        let response = await fetch('/api/teams/edit', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editTeamViewModel)
        });
    }

    render() {
        const check = this.state.check;
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.state.go} data-to={'teaminfo'} data-id={this.props.teamId} />}>
                    {this.state.team && this.state.name}
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
                    {this.state.team && (
                        this.state.activeTab === 'teamDescription' ?
                            <FormLayout >
                                <Input top="Название команды" type="text" defaultValue={this.state.name} onChange={this.onNameChange} />

                                <Textarea top="Описание команды" defaultValue={this.state.description} onChange={this.onDescriptionChange} />
                                <Select
                                    top="Выберете событие"
                                    placeholder="Событие"
                                    defaultValue={this.state.team.events && this.state.team.events}
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
                                <Button>Создать Событие</Button>
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
                                    <Textarea
                                        top="Описание участников и их задач"
                                        defaultValue={this.state.membersDescription}
                                        onChange={this.onMembersDescriptionChange} />
                                </ FormLayout>

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

                            </ Cell>
                    )}
                </ Group>
                <FixedLayout vertical="bottom">
                    <Div>
                        <Button
                            stretched
                            onClick={(e) => { this.postEdit(); this.state.go(e) }}
                            data-to={'teaminfo'}
                            data-id={this.props.teamId} >
                            Применить Изменения
                        </Button>)
                    </Div>
                </ FixedLayout>
            </Panel>
        );
    }

};

export default TeamEdit;