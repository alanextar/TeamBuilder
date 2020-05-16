import React from 'react';

import { Panel, PanelHeader, Group, Search, List, Cell, Avatar, PanelHeaderBack } from '@vkontakte/vkui';

class Teaminfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: null,
            go: props.go,
            id: props.id
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