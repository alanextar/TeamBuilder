import React from 'react';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, InfoRow, Avatar,
    SimpleCell
} from '@vkontakte/vkui';

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';

class TeamEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: null,
            events: null,
            check: null,
            usersNumber: 2,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription'
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.populateTeamData();
        this.populateEventsData();
    }

    async populateEventsData() {
        const response = await fetch(`/api/event/getall`);
        const data = await response.json();
        this.setState({ events: data });
    }

    async populateTeamData() {
        const response = await fetch(`/api/teams/get/${this.props.teamId}`);
        const data = await response.json();
        console.log('data from teamEdit', data)
        this.setState({
            team: data,
            usersNumber: data.userTeams.length
        });
    }

    onChange(e) {
        const { check, value } = e.currentTarget;
        this.setState({ check: value });
    }

    render() {
        const check = this.state.check;
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.state.go} data-to='teams' />}>
                    {this.state.team && this.state.team.name}
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
                                <Input top="Название команды" type="text" defaultValue={this.state.team.name} />

                                <Textarea top="Описание команды" defaultValue={this.state.team.description} />
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
                                            <option value={i}>
                                                {ev.name}
                                            </ option>
                                        )
                                    })}

                                </Select>
                                <Button mode="destructive">Создать Событие</Button>
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
                                    <Textarea top="Описание участников и их задач" defaultValue="" />
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
                <Div>
                    <Button mode="destructive">Применить Изменения</Button>
                </Div>
            </Panel>
        );
    }

};

export default TeamEdit;