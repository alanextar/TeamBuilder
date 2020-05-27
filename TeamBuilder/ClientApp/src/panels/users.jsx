import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import useDebounce from '../infrastructure/use-debounce';
import {
    Panel, PanelHeader, Avatar, Search, PanelSpinner, RichCell, PullToRefresh,
    CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Work from '@vkontakte/icons/dist/24/work';
import { Api, Urls } from '../infrastructure/api';

import { setUser, setParticipantUser } from "../store/user/actions";
import { goBack, setPage } from '../store/router/actions';

const Users = props => {
    const { setParticipantUser, setUser, setPage } = props;
    
    const [isSearching, setIsSearching] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);

    const [items, setItems] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(
        () => {
            console.log("search if")
            setIsSearching(true);
            Api.Users.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setIsSearching(false);
                });
        },
        [debouncedSearchTerm]
    )

    //#region Search

    const onRefresh = () => {
        setFetching(true);
        if (searchTerm) {
            Api.Users.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                });
        }
        else {
            console.log("refresh")
            Api.Users.getPage()
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                })
        }
    };

    //#endregion

    //#region Scroll

    const loadItems = page => {
        var url = `${Urls.Users.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }
        console.log(`load.url: ${url}`);
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
            <PanelHeader separator={false}>Пользователи</PanelHeader>
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
                                        after={stringfyTeams(user.userTeams)}
                                        caption={user.city ? user.city : 'Ekaterinburg'}
                                        bottom={stringfySkills(user.skills)}
                                        text={user.about ? user.about : 'Хороший человек'}
                                        onClick={() => {
                                            setPage('users', 'user');
                                            setUser(user);
                                            setParticipantUser(user)
                                        }}
                                    >
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

const mapStateToProps = (state) => {
    return {
        participantUser: state.user.participantUser
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setUser, setParticipantUser }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
