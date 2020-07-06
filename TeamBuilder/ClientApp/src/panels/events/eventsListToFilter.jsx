import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack } from '../../store/router/actions';
import { setTeamsEventFilter } from "../../store/events/actions";

import {
	Panel, PanelHeader, RichCell,
	PanelHeaderBack, CardGrid, Card
} from '@vkontakte/vkui';

import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

import { Api, Urls } from '../../infrastructure/api';
import { renderEventDate } from "../../infrastructure/utils";

const EventsListToFilter = props => {
	const { goBack, setTeamsEventFilter } = props;

	const itemClickHandler = (event) => {
		goBack();
		setTeamsEventFilter(event);
		props.openFilter();
	}

	const backClickHandler = () => {
		goBack();
		props.openFilter();
	}

	const renderItems = items => {
		return (
			<CardGrid>
				{items?.map(event => (
					<Card size="l" mode="shadow" key={event.id}>
						<RichCell
							bottom={`Участвуют ${event.teams?.length} команд`}
							caption={renderEventDate(event)}
							onClick={() => itemClickHandler(event)}>
							{event.name}
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
				getPageHandler={Api.Events.getPage}
				pagingSearchHandler={Api.Events.pagingSearch}
				getPageUrl={Urls.Events.GetPage}
				header=
				{<PanelHeader separator={false} left={<PanelHeaderBack onClick={() => backClickHandler()} />} >
					Выберите мероприятие
                </PanelHeader>}>
				{renderItems}
			</SearchWithInfiniteScroll>
		</Panel>
	);
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ setTeamsEventFilter, goBack }, dispatch)
	}
}

export default connect(null, mapDispatchToProps)(EventsListToFilter);