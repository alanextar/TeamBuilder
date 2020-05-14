import React from 'react';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton } from '@vkontakte/vkui';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';

import Team_info from './team_info'

import { getRandomInt, getRandomUser } from '../utils';


class Teams extends React.Component {
    constructor(props) {
        super(props);

        let items = [];

        for (let i = 0; i < 10; i++) {
            items.push(this.getNewItem())
        }

        this.state = {
            teams: [{
                'description': "команда из екб",
                'finishDate': null,
                'id': 1,
                'link': null,
                'name': "Na’Vi Natus Vincere",
                'startDate': null,
                'teamEvents': null,
                'userTeams': null
            },],
            page_id: props.id,
            go: props.go,
            items: items,
            fetching: false
        }

        this.onRefresh = () => {
            this.setState({ fetching: true });

            setTimeout(() => {
                this.setState({
                    items: [this.getNewItem(), ...this.state.items],
                    fetching: false
                });
            }, getRandomInt(600, 2000));

            //let data = this.componentDidMount();
            //this.setState({ teams: data });
        }
    }

    getNewItem() {
        return getRandomUser();
    }

    componentDidMount() {
        return this.populateTeamData();
    }

    async populateTeamData() {
        let response = await fetch('/team/getall');
        let data = await response.json();
        console.log(data)
        this.setState({ teams: data })
        //return data;
    }


    render() {
        return (
            <Panel id={this.state.page_id}>
                <PanelHeader right={<PanelHeaderButton><Icon28AddOutline /></PanelHeaderButton>}>Команды</PanelHeader>
                <Search />
                <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
                    <Group>
                        <List>
                            {this.state.teams.map(({ id, name }, i) => {
                                return (
                                    <RichCell
                                        before={<Avatar />}
                                        onClick={this.state.go} data-to='panel2'
                                        text="Мероприятия"
                                        caption="Навыки"
                                        after="1/3"
                                    >
                                        {name}
                                     </RichCell>
                                )
                            })}
                        </List>
                    </Group>
                </PullToRefresh>
            </Panel>
        )
    }
};

export default Teams;

//{
//    this.thematics.length > 0 &&
//    <List>
//        {this.thematics.map(thematic => <Cell key={thematic.id}>{thematic.name}</Cell>)}
//    </List>
//}