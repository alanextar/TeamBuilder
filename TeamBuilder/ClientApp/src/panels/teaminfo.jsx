import React from 'react';

import { Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow } from '@vkontakte/vkui';

class Teaminfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: null,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription'
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
                    {this.state.team && this.state.activeTab === 'teamDescription' ?
                        <Cell>
                            <InfoRow header='Описаноие команды'>
                                {this.state.team.description}    
                            </InfoRow>
                        </ Cell>
                        : 
                        <Cell>
                            <InfoRow header='События'>
                                {this.state.team && this.state.team.teamEvents &&
                                    this.state.team.TeamEvents.map((ev, i) =>
                                    {
                                        console.log('1111122222222', ev.name);
                                        return ev.name;
                                    }
                                )}
                            </InfoRow>
                        </ Cell>}
                </ Group>
            </Panel>
    );
    }

};

export default Teaminfo;

//<PanelHeader separator={false} left={<PanelHeaderBack onClick={go} data-to='teams' />}>
//    Communities
//                        </PanelHeader>
//    <Search />
//    <Cell description="Humor" before={<Avatar />} onClick={go} data-to='panel3'>
//        Swipe Right
//                        </Cell>
//    <Cell description="Cultural Center" before={<Avatar />} onClick={go} data-to='panel3'>
//        Out Cinema
//                        </Cell>
//    <Cell description="Movies" before={<Avatar />} onClick={go} data-to='panel3'>
//        #ARTPOKAZ
//                        </Cell>