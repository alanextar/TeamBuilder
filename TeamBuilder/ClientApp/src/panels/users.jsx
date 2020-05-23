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
        fetch(`${Api.User.GetPage}`)
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
        var url = `${Api.User.GetPage}`;
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

    const convertItemsToHtml = () => {
        var htmlItems = [];
        items && items.map((user, i) => {
            htmlItems.push(
                <Card size="l" mode="shadow" key={user.id}>
                    <SimpleCell
                        before={<Avatar size={48} src={user.photo100} />}
                        after={user.userSkills && user.userSkills.map(s => s.skill.name).join(", ")}
                        description={user.userTeams.length !== 0 ? `Состоит в ${user.userTeams.filter(ut => ut.isConfirmed).length} команд` : `В творческом поиске`}
                        onClick={props.go}
                        data-to='user'
                        data-from={props.id}>
                        {user.firstName} {user.secondName}
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