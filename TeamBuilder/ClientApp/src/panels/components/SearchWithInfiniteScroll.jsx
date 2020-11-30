import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setFormData } from "../../store/formData/actions";
import InfiniteScroll from 'react-infinite-scroller';

import {
	PanelSpinner, Search, PullToRefresh, FixedLayout, Div, Placeholder
} from '@vkontakte/vkui';
import Icon24Filter from '@vkontakte/icons/dist/24/filter';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

import IconIndicator from './IconIndicator';

import { Api } from '../../infrastructure/api';
import useDebounce from '../../infrastructure/use-debounce';
import { isNoContentResponse } from "../../infrastructure/utils";

const SearchWithInfiniteScroll =
	({ id, pagingSearchHandler, getPageUrl, onFiltersClickHandler, filterValue, header, ...props }) => {

		const [isSearching, setIsSearching] = useState(false);
		const [fetching, setFetching] = useState(false);

		const [hasMoreItems, setHasMoreItems] = useState(true);
		const [nextHref, setNextHref] = useState(null);

		const [items, setItems] = useState([]);

		const bindingId = `${props.activeView}_${id}`;
		const [searchTerm, setSearchTerm] = useState(props.inputData[bindingId] || '');
		const searchTermRef = useRef();
		const debouncedSearchTerm = useDebounce(searchTerm, 500);

		useEffect(() => {
			searchTermRef.current = debouncedSearchTerm;
			populateItems(setIsSearching);
		}, [debouncedSearchTerm, filterValue]);

		useEffect(() => {
			return () => {
				props.setFormData(bindingId, searchTermRef.current);
			};
		}, []);

		const onRefresh = () => {
			populateItems(setFetching);
		};

		const populateItems = (dataWaiter) => {
			dataWaiter(true);
			pagingSearchHandler(debouncedSearchTerm, getNotEmptyAttr() || {})
				.then(result => {
					updateItems(result);
					dataWaiter(false);
				})
				.catch((error) => { dataWaiter(false); setHasMoreItems(false); })
		}

		const updateItems = (result) => {
			setItems(result.collection);
			setNextHref(result.nextHref);
			setHasMoreItems(!!result.nextHref);
		}

		const loadItems = () => {
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

		const countNotEmptyAttr = () => {
			let filtered = getNotEmptyAttr();
			return filtered
				? Object.keys(filtered).length
				: 0;
		}

		const getNotEmptyAttr = () => {
			if (filterValue) {
				const filtered = Object.keys(filterValue)
					.filter(key => filterValue[key])
					.reduce((obj, key) => {
						obj[key] = filterValue[key];
						return obj;
					}, {});

				return filtered;
			}
		}

		const loader = <PanelSpinner key={0} size="large" />

		return (
			<React.Fragment>
				{header}
				<FixedLayout vertical="top">
					<Search
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						after={null}
						icon={onFiltersClickHandler &&
							<IconIndicator counter={countNotEmptyAttr()}>
								<Icon24Filter />
							</IconIndicator>}
						onIconClick={() => onFiltersClickHandler()}
					/>
				</FixedLayout>
				<PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{ paddingTop: 45 }}>
					{isSearching ? loader :
						<InfiniteScroll
							pageStart={0}
							initialLoad={false}
							loadMore={loadItems}
							hasMore={hasMoreItems}
							loader={loader}
						>
							{props.children(items)}
						</InfiniteScroll>
					}
				</PullToRefresh>
				{props.snackbar}
			</React.Fragment>
		);
	};

SearchWithInfiniteScroll.propTypes = {
	id: PropTypes.string.isRequired,
	pagingSearchHandler: PropTypes.func.isRequired,
	getPageUrl: PropTypes.string.isRequired,
	onFiltersClickHandler: PropTypes.func,
	filterValue: PropTypes.object,
	header: PropTypes.node.isRequired,
	children: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		inputData: state.formData.forms,
		snackbar: state.formData.snackbar,
		error: state.formData.error
	}
};

const mapDispatchToProps = {
	setFormData
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchWithInfiniteScroll);