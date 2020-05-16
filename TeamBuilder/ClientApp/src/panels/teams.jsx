import React from 'react';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton } from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';


const api = {
    baseUrl: '',
};

class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMoreItems: true,
            nextHref: null,
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
    }

    async populateTeamData() {
        const response = await fetch('/teams/getpage');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            data[i].go = this.state.go;
        }
        this.setState({ teams: data });
    }

    loadItems(page) {
        var self = this;

        var url = api.baseUrl + '/teams/getpage';
        if (this.state.nextHref) {
            url = this.state.nextHref;
        }

        qwest.get(url, {
            pageSize: 10
        }, {
            cache: true
        })
            .then(function (xhr, resp) {
                if (resp) {
                    var teams = self.state.teams;
                    resp.collection.map((team) => {
                        teams.push(team);
                    });

                    if (resp.nextHref) {
                        self.setState({
                            teams: teams,
                            nextHref: resp.next_href
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }

    render() {
        const loader = <div className="loader">Loading ...</div>;

        var items = [];
        this.state.teams.map(({ id, name, description, go }, i) => {
            items.push(
                <RichCell key={i}
                    text={description}
                    caption="Навыки"
                    after="1/3"
                    onClick={go}
                    data-to='teaminfo'
                    data-id={id}>
                    {name}
                </RichCell>
            );
        });

        return (
            <Panel id={this.state.page_id}>
                <PanelHeader left={<PanelHeaderButton><Icon28AddOutline /></PanelHeaderButton>}>Команды</PanelHeader>
                <Search />
                <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
                    <Group>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadItems.bind(this)}
                            hasMore={this.state.hasMoreItems}
                            loader={loader}>
                                <List >
                                    {items}
                                </List>
                        </InfiniteScroll>
                    </Group>
                </PullToRefresh>
            </Panel>
        );
    }
};

export default Teams;