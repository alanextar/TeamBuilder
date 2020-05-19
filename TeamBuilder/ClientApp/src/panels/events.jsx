import React, { useState } from 'react';
import {
    Panel, PanelHeader, Group, Search, List, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import { Api } from './../api';

const Events = props => {
    const [fetching, setFetching] = useState(false);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);
    const [events, setEvents] = useState([]);

    const populateEventsData = () => {
        fetch(`${Api.Events.GetPage}?pageSize=20`)
            .then((resp) => setEvents(resp.json()))
            .catch((error) => console.log(`Error for get events page. Details: ${error}`));
    }

    const onRefresh = () => {
        setFetching(true);
        populateEventsData();
        setFetching(false);
    };

    const loadItems = page => {
        var url = `${Api.Events.GetPage}?pageSize=20`;
        if (nextHref) {
            url = nextHref;
        }

        fetch(url)
            .then(resp => resp.json())
            .then(e => {
                console.log(`json: ${e}`);
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
                console.log(`events: ${events}`);
            })
            .catch((error) => console.log(`Error for get events page. Details: ${error}`));
    };

    const loader = <div>Loading ...</div>;

    const getItems = () => {
        var items = [];
        events && events.map((event, i) => {
            items.push(
                <CardGrid>
                    <Card size="l" mode="shadow">
                        <RichCell
                            key={event.id}
                            bottom={`${Math.floor(Math.random() * (+50 - +0)) + +0} команд`}
                            caption={`${event.startDate} - ${event.startDate}`}
                            onClick={props.go}
                            data-to='eventInfo'
                            data-id={event.id}
                            data-from={props.id}>
                            {event.name}
                        </RichCell>
                    </Card>
                </CardGrid>
            );
        });

        return items;
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={
                    <PanelHeaderButton>
                        <Icon28AddOutline onClick={props.go} data-to='eventCreate' data-from={props.id} />
                    </PanelHeaderButton>}>
                Мероприятия
                </PanelHeader>
            <Search />
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <Group>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadItems}
                        hasMore={hasMoreItems}
                        loader={loader}>
                        <List>
                            {getItems()}
                        </List>
                    </InfiniteScroll>
                </Group>
            </PullToRefresh>
        </Panel >
    );
};

export default Events;