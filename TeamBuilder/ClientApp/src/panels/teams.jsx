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
            nextHref: this.props.nextHref,
            teams: [],
            go: props.go,
            page_id: props.id,
            fetching: false,
        };

        console.log(`.ctr.Href: ${this.state.nextHref}`)

        this.onRefresh = () => {
            this.setState({ fetching: true });
            this.populateTeamData();
            this.setState({
                fetching: false
            });

        };
    }

    //componentDidMount() {
    //    this.populateTeamData();
    //}

    async populateTeamData() {
        var self = this;

        var url = api.baseUrl + '/teams/getpage';

        console.log(`populateTeamData.href: ${url}`)

        qwest.get(url, {
            pageSize: 20
        }, {
            cache: true
        })
            .then((xhr, resp) => {
                if (resp) {
                    var teamsT = [];
                    resp.collection.map((team) => {
                        teamsT.push(team);
                    });

                    if (resp.nextHref) {
                        self.setState({
                            teams: teamsT,
                            nextHref: resp.nextHref
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }

    loadItems(page) {
        var self = this;

        var url = api.baseUrl + '/teams/getpage';
        if (this.state.nextHref) {
            url = this.state.nextHref;
        }

        console.log(`loadItems.href: ${url}`)

        qwest.get(url, {
            pageSize: 20
        }, {
            cache: true
        })
            .then((xhr, resp) => {
                if (resp) {
                    var teamsT = self.state.teams;
                    resp.collection.map((team) => {
                        teamsT.push(team);
                    });

                    if (resp.nextHref) {
                        self.setState({
                            teams: teamsT,
                            nextHref: resp.nextHref
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
        var self = this;
        var href = self.state.nextHref
        console.log(`Render.href: ${href}`)
        const loader = <div className="loader">Loading ...</div>;

        var items = [];
        this.state.teams && this.state.teams.map((team, i) => {
            items.push(
                <RichCell
                    key={i}
                    text={team.description}
                    caption="Навыки"
                    after="1/3"
                    onClick={self.state.go}
                    data-to='teaminfo'
                    data-next-href={href}
                    data-id={team.id}>
                    {team.name} - {team.id}
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
                            <List>
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