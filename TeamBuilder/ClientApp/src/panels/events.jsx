import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { goBack, setPage } from '../store/router/actions';
import { setEvent } from "../store/events/actions";

import debounce from 'lodash.debounce';
import {
    Panel, PanelHeader, Group, Search, List, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card, Div
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import { Api, Urls } from '../infrastructure/api';

const Events = props => {
    const [fetching, setFetching] = useState(false);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);
    const [events, setEvents] = useState([]);

    const [search, setSearch] = useState('');

    //#region Search

    const searchEvents = value => {
        Api.Events.pagingSearch(value)
            .then(json => {
                setEvents(json.collection);
                setNextHref(json.nextHref);
                setHasMoreItems(json.nextHref ? true : false);
            });
    }

    const delayedSearchEvents = debounce(searchEvents, 250);

    const onChangeSearch = e => {
        setSearch(e.target.value);
        setNextHref(null);
        delayedSearchEvents(e.target.value);
    }

    //#endregion

    const getEvents = () => {
        Api.Events.GetPage()
            .then(json => setEvents(json.collection));
    }

    // const onRefresh = () => {
    //     setFetching(true);
    //     search.length === 0 ? getEvents() : searchEvents(search);
    //     setFetching(false);
    // };

    //#region Scroll

    const loadItems = page => {
        var url = `${Urls.Events.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }

        console.log(`event.loadItems.url: ${url}`);

        Api.get(url)
            .then(e => {
                var eventsTemp = events;
                e.collection.map((event) => {
                    eventsTemp.push(event);
                });

                if (e.nextHref) {
                    setNextHref(e.nextHref);
                    setEvents(eventsTemp);
                } else {
                    setHasMoreItems(false);
                }
            })
            .catch((error) => console.log(`Error for get events page. Details: ${error}`));
    };

    const loader = <div key={0}>Loading ...</div>;

    const getItems = () => {
        var items = [];
        events && events.map((event, i) => {
            items.push(
                <Card size="l" mode="shadow" key={event.id}>
                    <RichCell
                        bottom={`${Math.floor(Math.random() * (+50 - +0)) + +0} команд`}
                        caption={`${event.startDate} - ${event.startDate}`}
                        onClick={() => { setPage('events', 'eventInfo') }}
                    >
                        {event.name}
                    </RichCell>
                </Card>
            );
        });

        return items;
    }

    //#endregion

    const { setPage } = props;

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={
                    <PanelHeaderButton>
                        <Icon28AddOutline onClick={() => { setPage('events', 'eventCreate'); }} />
                    </PanelHeaderButton>}>
                Мероприятия
                </PanelHeader>
            <Search value={search} onChange={onChangeSearch} after={null} />
            {/*<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>*/}
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadItems}
                    hasMore={hasMoreItems}
                    loader={loader}>
                    <CardGrid style={{ marginBottom: 10 }}>
                        {getItems()}
                    </CardGrid>
                </InfiniteScroll>
                {/*</PullToRefresh>*/}
        </Panel>
    );
};

const mapDispatchToProps = {
    setPage,
    setEvent,
    goBack
};

export default connect(null, mapDispatchToProps)(Events);