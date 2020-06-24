import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import {
	PanelSpinner, Search, PullToRefresh, Div, FixedLayout
} from '@vkontakte/vkui';

import { Api } from '../../infrastructure/api';
import useDebounce from '../../infrastructure/use-debounce';

const SearchWithInfiniteScroll = ({ getPageHandler, pagingSearchHandler, getPageUrl, header, children }) => {

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
			pagingSearchHandler(debouncedSearchTerm)
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
			pagingSearchHandler(debouncedSearchTerm)
				.then(result => {
					setItems(result.collection);
					setNextHref(result.nextHref);
					setHasMoreItems(result.nextHref ? true : false);
					setFetching(false);
				});
		}
		else {
			getPageHandler()
				.then(result => {
					setItems(result.collection);
					setNextHref(result.nextHref);
					setHasMoreItems(result.nextHref ? true : false);
					setFetching(false);
				})
		}
	};

	const loadItems = page => {
		var url = `${getPageUrl}`;
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
		<Div style={{ padding: 0 }}>
			{header()}
			<FixedLayout vertical="top">
				<Search value={searchTerm} onChange={e => setSearchTerm(e.target.value)} after={null} />
			</FixedLayout>
			<PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{ paddingTop: 60, paddingBottom: 10 }}>
				{isSearching ? loader :
					<InfiniteScroll
						pageStart={0}
						loadMore={loadItems}
						hasMore={hasMoreItems}
						loader={loader}
						>
						{children(items)}
					</InfiniteScroll>
				}
			</PullToRefresh>
		</Div>
	);
};

SearchWithInfiniteScroll.propTypes = {
	getPageHandler: PropTypes.func.isRequired,
	pagingSearchHandler: PropTypes.func.isRequired,
	getPageUrl: PropTypes.string.isRequired,
	header: PropTypes.func.isRequired,
	children: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
	return {
		profileUser: state.user.profileUser
	}
};

export default connect(mapStateToProps, null)(SearchWithInfiniteScroll);