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
import { setEvent } from "../store/events/actions"

import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Filter from '@vkontakte/icons/dist/24/filter';

const Teams = props => {
    const { setPage, setTeam, setTeamsTeam, setEvent, event } = props;

    const [isSearching, setIsSearching] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);
    const [filtredEvent, setFiltredEvent] = useState(props.event && props.event.id);

    const [items, setItems] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(
        () => {
            console.log("search if")
            console.log("search filtredEvent", props)
            console.log(`search.debouncedSearchTerm ${debouncedSearchTerm}`)
            setIsSearching(true);
            Api.Teams.pagingSearch(debouncedSearchTerm, { eventId: props.event && props.event.id })
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setIsSearching(false);
                });
        },
        [debouncedSearchTerm]
    )

    const onRefresh = () => {
        setFetching(true);
        if (searchTerm) {
            console.log(`Refresh if`)
            Api.Teams.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                });
        }
        else {
            console.log(`Refresh else`)
            Api.Teams.getPage()
                .then(result => {

                    console.log(`Refresh result.collection ${result.collection.length}`)
                    console.log(`Refresh result.nextHref ${result.nextHref}`)
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                })
        }
    };

    const loadItems = page => {
        var url = `${Urls.Teams.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }
        console.log(`teams.loadItems.url: ${url}`)
        console.log(`teams.loadItems.items: ${items.length}`)
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
            <PanelHeader separator={false}
                left={
                    <PanelHeaderButton>
                        <Icon28AddOutline onClick={() => { setPage('teams', 'teamCreate'); }} />
                    </PanelHeaderButton>}>
                Команды
                </PanelHeader>
            <Search value={searchTerm} onChange={e => setSearchTerm(e.target.value)} after={null}
                icon={<Icon24Filter />}
                onIconClick={e => { console.log('in oniconclick'); props.onFiltersClick(e);  }} />
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
                                        after={team.userTeams.length + '/' + team.numberRequiredMembers}
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
        event: state.event.event
    }
};

const mapDispatchToProps = {
    setPage,
    setTeam,
    setTeamsTeam,
    goBack, 
    setEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(Teams);