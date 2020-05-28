import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { goBack, setPage } from '../store/router/actions';
import {
    Panel, PanelHeader, Avatar, Search, PanelSpinner, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import { Api, Urls } from '../infrastructure/api';
import useDebounce from '../infrastructure/use-debounce';
import { setTeam, setTeamsTeam } from "../store/teams/actions";

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Filter from '@vkontakte/icons/dist/24/filter';
import { countConfirmed } from "../infrastructure/utils";

const Teams = props => {
    const { setPage, setTeam, setTeamsTeam } = props;

    const [isSearching, setIsSearching] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);

    const [items, setItems] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(
        () => {
            setIsSearching(true);
            console.log(`teams.pagingSearch: ${debouncedSearchTerm}, ${props.teamsEventFilter && props.teamsEventFilter.id}`);
            Api.Teams.pagingSearch(debouncedSearchTerm, { eventId: props.teamsEventFilter && props.teamsEventFilter.id })
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setIsSearching(false);
                });
        },
        [debouncedSearchTerm, props.teamsEventFilter]
    )

    const onRefresh = () => {
        setFetching(true);
        if (searchTerm) {
            Api.Teams.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                });
        }
        else {
            Api.Teams.getPage()
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                })
        }
    };

    const loadItems = page => {
        var url = `${Urls.Teams.PagingSearch}?eventId=${props.teamsEventFilter && props.teamsEventFilter.id}`;
        if (nextHref) {
            url = nextHref;
        }
        console.log(`teams.loadItems ${url}`)
        Api.get(url)
            .then(e => {
                var itemsTemp = items;
                e.collection.map((item) => {
                    itemsTemp.push(item);
                });
                if (e.nextHref) {
                    setNextHref(e.nextHref);
                    setItems(itemsTemp);
                } else {
                    setHasMoreItems(false);
                }
            });
    };

    const loader = <PanelSpinner key={0} size="large" />

    return (
        <Panel id={props.id}>
            {props.profileUser ?
                <PanelHeader separator={false}
                    left={<PanelHeaderButton onClick={() => { setPage('events', 'eventCreate'); }}>Создать</PanelHeaderButton>}>
                    Команды
                </PanelHeader> :
                <PanelHeader separator={false}>
                    Команды
                </PanelHeader>
            }
            <Search value={searchTerm} onChange={e => setSearchTerm(e.target.value)} after={null}
                icon={<Icon24Filter />}
                onIconClick={e => { props.onFiltersClick(e); }} />
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                {isSearching ? loader :
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadItems}
                        hasMore={hasMoreItems}
                        loader={loader}>
                        <CardGrid style={{ marginBottom: 10 }}>
                            {items && items.map(team => (
                                <Card size="l" mode="shadow" key={team.id}>
                                    <RichCell
                                        before={<Avatar size={64} src={team.photo100} />}
                                        text={team.description}
                                        caption={team.event && team.event.name}
                                        after={countConfirmed(team.userTeams) +
                                            '/' + team.numberRequiredMembers}
                                        onClick={() => { setPage('teams', 'teaminfo'); setTeam(team); setTeamsTeam(team) }}
                                    >
                                        {team.name}
                                    </RichCell>
                                </Card>
                            ))}
                        </CardGrid>
                    </InfiniteScroll>
                }
            </PullToRefresh>
        </Panel>
    )
};

const mapStateToProps = (state) => {
    return {
        teamsEventFilter: state.event.teamsEventFilter,
        profileUser: state.user.profileUser
    }
};

const mapDispatchToProps = {
    setPage,
    setTeam,
    setTeamsTeam,
    goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(Teams);