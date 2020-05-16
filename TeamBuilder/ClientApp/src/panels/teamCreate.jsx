import React from 'react';

import { Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, Div, Button, Textarea, FormLayout } from '@vkontakte/vkui';

class TeamCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //team: null,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription'
        };
    }

    //componentDidMount() {
    //    this.populateTeamData();
    //}

    //async populateTeamData() {
    //    const response = await fetch(`/teams/get/${this.props.teamId}`);
    //    const data = await response.json();
    //    this.setState({ team: data });
    //}

    render() {
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