import React from 'react';
import {
    Panel, PanelHeader, Avatar, Search, List, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';
import { Api } from '../infrastructure/api';
import debounce from 'lodash.debounce';

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Filter from '@vkontakte/icons/dist/24/filter';

class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMoreItems: true,
            href: this.props.href,
            nextHref: null,
            teams: [],
            go: props.go,
            page_id: props.id,
            fetching: false,
            search: '',
        };

        console.log(`.ctr.Href: ${this.state.href}`);
        console.log(`.ctr.nextHref: ${this.state.nextHref}`);

        this.onRefresh = () => {
            this.setState({ fetching: true });
            this.populateTeamData();
            this.setState({
                fetching: false
            });

        };

        this.onChangeSearch = this.onChangeSearch.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.searchTeams('');
    }

    async populateTeamData() {
        var self = this;

        var url = Api.Teams.GetPage;

        qwest.get(url, {
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
                            href: url,
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
        var url = `${Api.Teams.GetPage}`;
        if (this.state.nextHref) {
            url = this.state.nextHref;
        }
        window.scrollTo(0, 0);
        var self = this;

        console.log(`loadItems.Url: ${url}`);

        qwest.get(url, {
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
                            href: url,
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

    async searchTeams(value) {
        console.log('searchTeam value', value)
        console.log('searchTeam  event.id', this.props.filtredByEvent.id)
        const response = await fetch(`${Api.Teams.PagingSearch}?search=${value}&eventId=${this.props.filtredByEvent.id}`);
        const data = await response.json();
        console.log('searchTeam', data)
        this.setState({
            teams: data.collection,
            hasMoreItems: data.nextHref ? true : false,
            nextHref: data.nextHref
        });
    }

    delayedSearchEvents = debounce(this.searchTeams, 250);

    onChangeSearch(e) {
        this.setState({
            search: e.target.value,
            nextHref: null
        })
        this.delayedSearchEvents(e.target.value)
    }

    getRandomInt() {
        var min = 0;
        var max = 1000;
        return Math.floor(Math.random() * (+max - +min)) + +min;
    }

    render() {
        var self = this;
        //var href = self.state.href === api.baseUrl + api.getTeams ? self.state.href : self.state.href + '&prev=true';
        const loader = <div key={0}>Loading ...</div>;

        var items = [];
        this.state.teams && this.state.teams.map((team, i) => {
            items.push(
                <Card size="l" mode="shadow" key={team.id}>
                    <RichCell
                        before={<Avatar size={64} src={team.photo100} />}
                        text={team.description}
                        caption={team.event.name}
                        after={team.userTeams.length + '/' + team.numberRequiredMembers}
                        onClick={self.state.go}
                        data-to='teaminfo'
                        data-id={team.id}>
                        {team.name}
                    </RichCell>
                </Card>
            );
        });

        return (
            <Panel id={this.state.page_id}>
                <PanelHeader left={
                    <PanelHeaderButton>
                        <Icon28AddOutline onClick={this.state.go} data-to='teamCreate' />
                    </PanelHeaderButton>}>
                    Команды
                </PanelHeader>
                <Search value={this.state.search} onChange={this.onChangeSearch} after={null}
                    icon={<Icon24Filter />}
                    onIconClick={this.props.onFiltersClick} />
                <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>

                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadItems.bind(this)}
                        hasMore={this.state.hasMoreItems}
                        loader={loader}>
                        <CardGrid style={{ marginBottom: 10 }}>
                            {items}
                        </CardGrid>
                    </InfiniteScroll>
                </PullToRefresh>
            </Panel>)

    }
};

export default Teams;