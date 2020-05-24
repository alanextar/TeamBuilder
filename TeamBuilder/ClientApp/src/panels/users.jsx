import React, { useState, useEffect } from 'react';
import useDebounce from '../infrastructure/use-debounce';
import {
    Panel, PanelHeader, Avatar, Search, PanelSpinner, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card, Div, SimpleCell
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Work from '@vkontakte/icons/dist/24/work';
import { Api } from '../infrastructure/api';

const Users = props => {
    const [isSearching, setIsSearching] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);

    const [items, setItems] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(
        () => {
            if (debouncedSearchTerm) {
                setIsSearching(true);
                searchItems(debouncedSearchTerm)
                    .then(result => {
                        setItems(result.collection);
                        setNextHref(result.nextHref);
                        setHasMoreItems(result.nextHref ? true : false);
                        setIsSearching(false);
                    });
            }
            else {
                setIsSearching(true);
                getItems().then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setIsSearching(false);
                })
            }
        },
        [debouncedSearchTerm]
    )

    //#region Search

    const onRefresh = () => {
        setFetching(true);
        if (searchTerm) {
            searchItems(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setFetching(false);
                });
        }
        else {
            getItems().then(result => {
                setItems(result.collection);
                setNextHref(result.nextHref);
                setFetching(false);
            })
        }
    };

    //#endregion

    //#region Scroll

    const loadItems = page => {
        var url = `${Api.Users.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }
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

    const loader = <PanelSpinner key={0} size="large" />

    const stringfySkills = (skills) => {
        var joined = skills && skills.map(s => s.name).join(", ");
        var max = 30;
        var result = joined.length > max ? `${joined.substring(0, max)}...` : joined;
        return result;
    }

    const stringfyTeams = (teams) => {
        var confirmedTeams = teams && teams.filter(ut => ut.isConfirmed);
        var result = confirmedTeams.length !== 0 && <Icon24Work />
        return result;
    }

    //#endregion

    return (
        <Panel id={props.id}>
            <PanelHeader>Пользователи</PanelHeader>
            <Search value={searchTerm} onChange={e => setSearchTerm(e.target.value)} after={null} />
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                {isSearching ? loader :
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadItems}
                        hasMore={hasMoreItems}
                        loader={loader}>
                        <CardGrid style={{ marginBottom: 10 }}>
                            {items && items.map(user => (
                                <Card size="l" mode="shadow" key={user.id}>
                                    <RichCell
                                        before={<Avatar size={48} src={user.photo100} />}
                                        after={stringfyTeams(user.userTeams)} //count
                                        caption={user.city ? user.city : 'Ekaterinburg'} // city 
                                        bottom={stringfySkills(user.skills)} // skills
                                        text={user.about ? user.about : 'Хороший человек'} //descr 
                                        onClick={props.go}
                                        data-to='user'
                                        data-from={props.id}>
                                        {user.firstName} {user.lastName}
                                    </RichCell>
                                </Card>
                            ))}
                        </CardGrid>
                    </InfiniteScroll>}
            </PullToRefresh>
        </Panel>
    );
};

function searchItems(value) {
    console.log(`users.search ${value}`);
    return fetch(`${Api.Users.PagingSearch}?search=${value}`)
        .then(resp => resp.json())
        .then(json => json)
        .catch(error => {
            console.error(`Error for get filtered users page. Details: ${error}`);
            return {};
        });
}


function getItems() {
    return fetch(`${Api.Users.GetPage}`)
        .then(resp => resp.json())
        .then(json => json)
        .catch(error => {
            console.log(`Error for get users page. Details: ${error}`);
            return {};
        });
}

export default Users;