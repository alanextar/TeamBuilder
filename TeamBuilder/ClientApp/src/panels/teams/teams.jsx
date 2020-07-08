import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { goToPage, goBack } from '../../store/router/actions';
import {
	Panel, PanelHeader, Avatar, RichCell,
	PanelHeaderButton, CardGrid, Card
} from '@vkontakte/vkui';

import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

import { Api, Urls } from '../../infrastructure/api';
import { countConfirmed } from "../../infrastructure/utils";

const Teams = props => {
	const { goToPage } = props;

	const [filteredEventId, setFilteredEventId] = useState({ eventId: props.teamsEventFilter?.id });

	// Для того чтобы лишний раз не вызывать useEffect в SearchWithInfiniteScroll
	//TODO ещё бы выяснить почему обновляется props.teamsEventFilter?.id
	useEffect(() => {
		if (props.teamsEventFilter?.id !== filteredEventId.eventId) {
			setFilteredEventId({ eventId: props.teamsEventFilter?.id })
		}
	}, [props.teamsEventFilter?.id])

	const renderHeader = (
		props.profileUser ?
			<PanelHeader separator={false}
				left={<PanelHeaderButton onClick={() => goToPage('teamCreate')}>Создать</PanelHeaderButton>}>
				Команды
	            </PanelHeader> :
			<PanelHeader separator={false}>
				Команды
	            </PanelHeader>

	)

	const renderItems = items => {
		return (
			<CardGrid style={{ marginTop: 10, marginBottom: 10 }}>
				{items?.map(team => (
					<Card size="l" mode="shadow" key={team.id}>
						<RichCell
							before={<Avatar size={64} src={team.image?.dataURL} />}
							text={team.description}
							caption={team.event?.name}
							after={countConfirmed(team.userTeams) +
								'/' + team.numberRequiredMembers}
							onClick={() => goToPage('teamInfo', team.id)}
						>
							{team.name}
						</RichCell>
					</Card>
				))}
			</CardGrid>
		)
	}

	return (
		<Panel id={props.id}>
			<SearchWithInfiniteScroll
				id={props.id}
				pagingSearchHandler={Api.Teams.pagingSearch}
				getPageUrl={Urls.Teams.PagingSearch}
				onFiltersClickHandler={props.onFiltersClick}
				filterValue={filteredEventId}
				header={renderHeader}>
				{renderItems}
			</SearchWithInfiniteScroll>
		</Panel>
	);

	// const [isSearching, setIsSearching] = useState(false);
	// const [fetching, setFetching] = useState(false);

	// const [hasMoreItems, setHasMoreItems] = useState(true);
	// const [nextHref, setNextHref] = useState(null);

	// const [items, setItems] = useState([]);

	// const [searchTerm, setSearchTerm] = useState('');
	// const debouncedSearchTerm = useDebounce(searchTerm, 500);

	// useEffect(
	// 	() => {
	// 		setIsSearching(true);
	// 		Api.Teams.pagingSearch(debouncedSearchTerm, { eventId: props.teamsEventFilter && props.teamsEventFilter.id })
	// 			.then(result => {
	// 				setItems(result.collection);
	// 				setNextHref(result.nextHref);
	// 				setHasMoreItems(result.nextHref ? true : false);
	// 				setIsSearching(false);
	// 			});
	// 	},
	// 	[debouncedSearchTerm, props.teamsEventFilter]
	// )

	// const onRefresh = () => {
	// 	setFetching(true);
	// 	if (searchTerm) {
	// 		Api.Teams.pagingSearch(debouncedSearchTerm, { eventId: props.teamsEventFilter && props.teamsEventFilter.id })
	// 			.then(result => {
	// 				setItems(result.collection);
	// 				setNextHref(result.nextHref);
	// 				setHasMoreItems(result.nextHref ? true : false);
	// 				setFetching(false);
	// 			});
	// 	}
	// 	else {
	// 		Api.Teams.getPage()
	// 			.then(result => {
	// 				setItems(result.collection);
	// 				setNextHref(result.nextHref);
	// 				setHasMoreItems(result.nextHref ? true : false);
	// 				setFetching(false);
	// 			})
	// 	}
	// };

	// const loadItems = page => {
	// 	var url = `${Urls.Teams.PagingSearch}?eventId=${props.teamsEventFilter && props.teamsEventFilter.id}`;
	// 	if (nextHref) {
	// 		url = nextHref;
	// 	}

	// 	Api.get(url)
	// 		.then(e => {
	// 			var itemsTemp = items;
	// 			e.collection.map((item) => {
	// 				itemsTemp.push(item);
	// 			});
	// 			if (e.nextHref) {
	// 				setNextHref(e.nextHref);
	// 				setItems(itemsTemp);
	// 			} else {
	// 				setHasMoreItems(false);
	// 			}
	// 		});
	// };

	// const loader = <PanelSpinner key={0} size="large" />

	// return (
	// 	<Panel id={props.id}>
	// 		{props.profileUser ?
	// 			<PanelHeader separator={false}
	// 				left={<PanelHeaderButton onClick={() => goToPage('teamCreate')}>Создать</PanelHeaderButton>}>
	// 				Команды
	//             </PanelHeader> :
	// 			<PanelHeader separator={false}>
	// 				Команды
	//             </PanelHeader>
	// 		}
	// 		<Search value={searchTerm} onChange={e => setSearchTerm(e.target.value)} after={null}
	// 			icon={<Icon24Filter />}
	// 			onIconClick={() => props.onFiltersClick()} />
	// 		<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
	// 			{isSearching ? loader :
	// 				<InfiniteScroll
	// 					pageStart={0}
	// 					loadMore={loadItems}
	// 					hasMore={hasMoreItems}
	// 					loader={loader}>
	// 					<CardGrid style={{ marginBottom: 10 }}>
	// 						{items && items.map(team => (
	// 							<Card size="l" mode="shadow" key={team.id}>
	// 								<RichCell
	// 									before={<Avatar size={64} src={team.photo100} />}
	// 									text={team.description}
	// 									caption={team.event && team.event.name}
	// 									after={countConfirmed(team.userTeams) +
	// 										'/' + team.numberRequiredMembers}
	// 									onClick={() => goToPage('teamInfo', team.id)}
	// 								>
	// 									{team.name}
	// 								</RichCell>
	// 							</Card>
	// 						))}
	// 					</CardGrid>
	// 				</InfiniteScroll>
	// 			}
	// 		</PullToRefresh>
	// 	</Panel>
	// )
};

const mapStateToProps = (state) => {
	return {
		teamsEventFilter: state.event.teamsEventFilter,
		profileUser: state.user.profileUser
	}
};

const mapDispatchToProps = {
	goToPage,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(Teams);