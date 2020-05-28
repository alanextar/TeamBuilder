import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack } from '../store/router/actions';
import { setEvent, setTeamsEventFilter } from "../store/events/actions";

import useDebounce from '../infrastructure/use-debounce';
import {
    Panel, PanelHeader, PanelSpinner, Search, RichCell, PullToRefresh,
    PanelHeaderBack, CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import { Api, Urls } from '../infrastructure/api';

const EventsFilter = props => {
    const { goBack, setTeamsEventFilter } = props;

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
            Api.Events.pagingSearch(debouncedSearchTerm)
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
            Api.Events.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                });
        }
        else {
            Api.Events.getPage()
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                })
        }
    };

    const loadItems = page => {
        var url = `${Urls.Events.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }
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
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />} >
                Выберите мероприятие
                </PanelHeader>
            <Search value={searchTerm} onChange={e => setSearchTerm(e.target.value)} after={null} />
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                {isSearching ? loader :
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadItems}
                        hasMore={hasMoreItems}
                        loader={loader}>
                        <CardGrid style={{ marginBottom: 10 }}>
                            {items && items.map(event => (
                                <Card size="l" mode="shadow" key={event.id}>
                                    <RichCell
                                        bottom={`Участвуют ${event.teams && event.teams.length} команд`}
                                        caption={`${event.startDate} - ${event.startDate}`}
                                        onClick={(e) => {
                                            goBack();
                                            setTeamsEventFilter(event);
                                            props.openFilter(e)
                                        }}
                                    >
                                        {event.name}
                                    </RichCell>
                                </Card>
                            ))}
                        </CardGrid>
                    </InfiniteScroll>
                }
            </PullToRefresh>
        </Panel>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setTeamsEventFilter, goBack }, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(EventsFilter);