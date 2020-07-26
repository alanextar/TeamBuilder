import React from 'react';
import { connect } from 'react-redux';

import { goBack } from '../../store/router/actions';
import { setTeamsEventFilter } from "../../store/events/actions";

import {
	Panel, PanelHeader, RichCell,
	PanelHeaderBack, CardGrid, Card
} from '@vkontakte/vkui';

import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

import { Api, Urls } from '../../infrastructure/api';
import { renderEventDate } from "../../infrastructure/utils";

const EventsListBase = props => {
	const renderItems = items => {
		return (
			<CardGrid style={{ marginTop: 10, marginBottom: 10 }}>
				{items?.map(event => (
					<Card size="l" mode="shadow" key={event.id}>
						<RichCell
							bottom={`Участвуют ${event.teams?.length} команд`}
							caption={renderEventDate(event)}
							onClick={() => props.itemClickHandler(event)}>
							{event.name}
						</RichCell>
					</Card>
				))}
			</CardGrid>
		);
	}

	return (
		<Panel id={props.id}>
			<SearchWithInfiniteScroll
				id={props.id}
				pagingSearchHandler={Api.Events.pagingSearch}
				getPageUrl={Urls.Events.PagingSearch}
				header=
				{<PanelHeader separator={false} left={<PanelHeaderBack onClick={() => props.backClickHandler()} />} >
					Выберите мероприятие
                </PanelHeader>}>
				{renderItems}
			</SearchWithInfiniteScroll>
		</Panel>
	);
};

const mapDispatchToProps = {
	setTeamsEventFilter,
	goBack
}

export default connect(null, mapDispatchToProps)(EventsListBase);