import React from 'react';
import { connect } from 'react-redux';
import { goBack, setPage } from '../store/router/actions';
import {
    Panel, PanelHeader, Avatar, Search, List, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import { Api, Urls } from '../infrastructure/api';
import debounce from 'lodash.debounce';
import { setTeam, createTeam } from "../store/teams/actions";

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';

class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMoreItems: true,
            nextHref: null,
            teams: [],
            go: props.go,
            page_id: props.id,
            fetching: false,
            search: '',
        };

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
        //this.populateTeamData();
    }

    async populateTeamData() {
        var self = this;
        Api.Teams.GetPage()
            .then(result => {
                if (result) {
                    var teamsT = [];
                    result.collection.map((team) => {
                        teamsT.push(team);
                    });

                    if (result.nextHref) {
                        self.setState({
                            teams: teamsT,
                            nextHref: result.nextHref
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
        var url = `${Urls.Teams.GetPage}`;
        if (this.state.nextHref) {
            url = this.state.nextHref;
        }

        console.log(`loadItems.Url: ${url}`);

        Api.get(url)
            .then(result => {
                if (result) {
                    var teamsT = self.state.teams;
                    result.collection.map((team) => {
                        teamsT.push(team);
                    });

                    if (result.nextHref) {
                        self.setState({
                            teams: teamsT,
                            nextHref: result.nextHref
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
        await Api.Teams.pagingSearch(value).then(result =>
            this.setState({
                teams: result.collection,
                hasMoreItems: result.nextHref ? true : false,
                nextHref: result.nextHref
            }));
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
        const { id, goBack, createTeam, setPage, setTeam } = this.props;
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
                        caption="Навыки"
                        after={team.userTeams.length + '/' + team.numberRequiredMembers}
                        onClick={() => { setPage('teams', 'teaminfo'); setTeam(team) }}
                    >
                        {team.name} - {team.id}
                    </RichCell>
                </Card>
            );
        });

        return (
            <Panel id={this.state.page_id}>
                <PanelHeader left={
                    <PanelHeaderButton>
                        <Icon28AddOutline onClick={() => { createTeam(); setPage('teams', 'teamCreate'); }} />
                    </PanelHeaderButton>}>
                    Команды
                </PanelHeader>
                <Search value={this.state.search} onChange={this.onChangeSearch} after={null} />
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

const mapDispatchToProps = {
    setPage,
    setTeam,
    createTeam,
    goBack
};

export default connect(null, mapDispatchToProps)(Teams);