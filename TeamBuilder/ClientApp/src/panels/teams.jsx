import React from 'react';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton, Cell } from '@vkontakte/vkui';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';


class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: null,
            go: props.go,
            page_id: props.id,
            fetching: false,
        };

        this.onRefresh = () => {
            this.setState({ fetching: true });

            this.populateTeamData();

            this.setState({
                fetching: false
            });

        };
    }

    componentDidMount() {
        this.populateTeamData();
    };

    async populateTeamData() {
        const response = await fetch('/team/getall');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            data[i].go = this.state.go
        }
        this.setState({ teams: data });
    }
    render() {
        return (
            <Panel id={this.state.page_id}>
                <PanelHeader right={<PanelHeaderButton><Icon28AddOutline /></PanelHeaderButton>}>Команды</PanelHeader>
                <Search />
                <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
                    <Group>
                        <List>
                            {
                                this.state.teams ?
                                    this.state.teams.map(function (team, index) {
                                        return (
                                            <RichCell key={index}
                                                onClick={team.go}
                                                data-to='teaminfo'
                                                text="Мероприятия"
                                                caption="Навыки"
                                                after="1/3"
                                            >
                                                {team.name}
                                            </RichCell>
                                        )
                                    }) : <RichCell />} 
                        </List>
                    </Group>
                </PullToRefresh>
            </Panel>
        );
    }
};

export default Teams;

//{
//    this.thematics.length > 0 &&
//    <List>
//        {this.thematics.map(thematic => <Cell key={thematic.id}>{thematic.name}</Cell>)}
//    </List>
//}



