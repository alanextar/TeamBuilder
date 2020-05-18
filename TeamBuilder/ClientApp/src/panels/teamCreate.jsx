import React from 'react';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Search
} from '@vkontakte/vkui';

class TeamCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: '',
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
        const response = await fetch(`/event/getall`);
        const data = await response.json();
        this.setState({ events: data });
    }

    onChange(e) {
        const { events, value } = e.currentTarget;
        this.setState({ events: value });
    }

    render() {
        const events = this.state.events;
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
                        <FormLayout>
                            <Textarea top="Описание команды" />
                            <Select
                                top="Выберете событие"
                                placeholder="Событие"
                                status={events ? 'valid' : 'error'}
                                bottom={events ? '' : 'Пожалуйста, выберете или создайте событие'}
                                onChange={this.onChange}
                                value={events}
                                name="events"
                            >
                                {this.state.events && this.state.events.map((ev, i) => {
                                    return (
                                        <option value={i}>
                                            {ev.name}
                                        </ option>
                                    )
                                })}

                            </Select>
                        </ FormLayout>
                        :
                        <Cell>

                        </ Cell>}
                </ Group>
                <Div>
                    <Button mode="destructive">Создать</Button>
                </Div>
            </Panel>
        );
    }

};

export default TeamCreate;