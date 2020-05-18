import React from 'react';

import { Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow } from '@vkontakte/vkui';

class Teaminfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: null,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription',
            return: props.return
        };
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateTeamData() {
        const response = await fetch(`/teams/get/${this.props.teamId}`);
        const data = await response.json();
        this.setState({ team: data });
    }

    render() {
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.state.go} data-to={this.state.return} />}>
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
                            <Cell>
                                <InfoRow header='Описаноие команды'>
                                    {this.state.team.description}    
                                </InfoRow>
                            </ Cell>
                            : 
                            <Cell>
                                <InfoRow header='События'>
                                    {console.log('ttteams ', this.state.team.teamEvents)}
                                    {this.state.team.teamEvents &&
                                        this.state.team.teamEvents.map((ev, i) => {
                                            return(<p>
                                                {ev.event.name}
                                            </p>)
                                        }
                                    )}
                                </InfoRow>
                            </ Cell> )}
                </ Group>
            </Panel>
    );
    }

};

export default Teaminfo;