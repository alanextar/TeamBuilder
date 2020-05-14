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
        }
    }

    getNewItem() {
        return getRandomUser();
    }

    render() {
        return (
            <Panel id={this.state.page_id}>
                <PanelHeader right={<PanelHeaderButton><Icon28AddOutline /></PanelHeaderButton>}>Команды</PanelHeader>
                <Search />
                <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
                    <Group id="2">
                        <List>
                            {this.state.items.map(({ id, name, photo_100 }, i) => {
                                return (
                                    <RichCell
                                        before={<Avatar src={photo_100} />}
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