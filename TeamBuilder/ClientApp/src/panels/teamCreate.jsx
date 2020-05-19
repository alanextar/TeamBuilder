import React from 'react';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider
} from '@vkontakte/vkui';
import qwest from 'qwest';
import { Api } from './../api';

class TeamCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
    }

    async populateTeamData() {
        var self = this;
        qwest.get(Api.Events.GetEventsAll,
            {},
            {
                cache: true
            })
            .then((xhr, resp) => {
                if (resp) {
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
                            <Input top="Название команды" type="text" placeholder="DreamTeam" />

                            <Textarea top="Описание команды" />
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
                                <Textarea top="Описание участников и их задач" />
                            </ FormLayout>
                        </ Cell>}
                </ Group>
                <Div>
                    <Button mode="destructive">Создать Команду</Button>
                </Div>
            </Panel>
        );
    }

};

export default TeamCreate;