import React from 'react';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select
} from '@vkontakte/vkui';

class TeamCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            evenName: '',
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription'
        };

        this.onChange = this.onChange.bind(this);
    }

    //componentDidMount() {
    //    this.populateTeamData();
    //}

    //async populateTeamData() {
    //    const response = await fetch(`/teams/get/${this.props.teamId}`);
    //    const data = await response.json();
    //    this.setState({ team: data });
    //}

    onChange(e) {
        const { evenName, value } = e.currentTarget;
        this.setState({ evenName: value });
    }

    render() {
        const evenName = this.state.evenName;
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
                                status={evenName ? 'valid' : 'error'}
                                bottom={evenName ? '' : 'Пожалуйста, выберете или создайте событие'}
                                onChange={this.onChange}
                                value={evenName}
                                name="evenName"
                            >
                                <option value="0">Бизнес или работа</option>
                                <option value="1">Индивидуальный туризм</option>
                                <option value="2">Посещение близких родственников</option>
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