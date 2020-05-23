import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import {
    Panel, PanelHeader, Avatar, Search, List, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card, Div, SimpleCell
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import { Api } from '../infrastructure/api';

const Users = props => {
    const [fetching, setFetching] = useState(false);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);
    const [items, setItems] = useState([]);

    const [search, setSearch] = useState('');

    //#region Search

    const searchItems = value => {
        fetch(`${Api.Users.PagingSearch}?search=${value}`)
            .then((resp) => resp.json())
            .then(json => {
                setItems(json.collection);
                setNextHref(json.nextHref);
                setHasMoreItems(json.nextHref ? true : false);
            })
            .catch((error) => console.log(`Error for get filtered users page. Details: ${error}`));
    }

    const delayedSearchItems = debounce(searchItems, 250);

    const onChangeSearch = e => {
        setSearch(e.target.value);
        setNextHref(null);
        delayedSearchItems(e.target.value);
    }

    const getItems = () => {
        fetch(`${Api.Users.GetPage}`)
            .then((resp) => resp.json())
            .then(json => setItems(json.collection))
            .catch((error) => console.log(`Error for get users page. Details: ${error}`));
    }

    const onRefresh = () => {
        setFetching(true);
        search.length === 0 ? getItems() : searchItems(search);
        setFetching(false);
    };

    //#endregion

    //#region Scroll

    const loadItems = page => {
        var url = `${Api.Users.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }

        console.log(`user.url: ${url}`)
        console.log(`user.nextHref: ${nextHref}`)
        console.log(`user.hasMoreItems: ${hasMoreItems}`)
        console.log(`user.items: ${items.length}`)

        fetch(url)
            .then(resp => resp.json())
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
            })
            .catch((error) => console.log(`Error for get users page. Details: ${error}`));
    };

    const loader = <div key={0}>Loading ...</div>;

    const stringfySkills = (skills) => 
    {
        var joined = skills && skills.map(s => s.name).join(", ");
        var result = joined.length > 15 ? `${joined.substring(0, 15)}...` : joined;
        return result;
    } 

    const stringfyTeams = (teams) => 
    {
        var confirmedTeams = teams && teams.filter(ut => ut.isConfirmed);
        var result = confirmedTeams.length !== 0 ? `В ${confirmedTeams.length} командах` : `В творческом поиске`;
        return result;
    } 

    const convertItemsToHtml = () => {
        var htmlItems = [];
        items && items.map((user, i) => {
            htmlItems.push(
                <Card size="l" mode="shadow" key={user.id}>
                    <SimpleCell
                        before={<Avatar size={48} src={user.photo100} />}
                        after={stringfySkills(user.skills)}
                        description={stringfyTeams(user.userTeams)}
                        onClick={props.go}
                        data-to='user'
                        data-from={props.id}>
                        {user.firstName} {user.lastName}
                    </SimpleCell>
                </Card>
            );
        });

        return htmlItems;
    }

    //#endregion

    return (
        <Panel id={props.id}>
            <PanelHeader>Пользователи</PanelHeader>
            <Search value={search} onChange={onChangeSearch} after={null} />
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadItems}
                    hasMore={hasMoreItems}
                    loader={loader}>
                    <CardGrid style={{ marginBottom: 10 }}>
                        {convertItemsToHtml()}
                    </CardGrid>
                </InfiniteScroll>
            </PullToRefresh>
        </Panel>
    );
};

export default Users;