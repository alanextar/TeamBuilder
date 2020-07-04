import React from 'react';
import { connect } from 'react-redux';

import {
	Panel, PanelHeader, RichCell,
	PanelHeaderButton, CardGrid, Card
} from '@vkontakte/vkui';

import { Api, Urls } from '../../infrastructure/api';

import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

import { goToPage } from '../../store/router/actions';

const Events = props => {
	const { goToPage } = props;

	const renderHeader = (
		props.profileUser
			?
			<PanelHeader
				separator={false}
				left={<PanelHeaderButton onClick={() => goToPage('eventCreate')}>Создать</PanelHeaderButton>}>
				События
					</PanelHeader>
			:
			<PanelHeader separator={false}>
				События
					</PanelHeader>
	);


	const renderItems = items => {
		return (
			<CardGrid>
				{items?.map(event => (
					<Card size="l" mode="shadow" key={event.id}>
						<RichCell
							bottom={`Участвуют ${event.teams?.length} команд`}
							caption={`${event.startDate} - ${event.startDate}`}
							onClick={() => goToPage('eventInfo', event.id)}>
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
				getPageHandler={Api.Events.getPage}
				pagingSearchHandler={Api.Events.pagingSearch}
				getPageUrl={Urls.Events.GetPage}
				header={renderHeader}>
				{renderItems}
			</SearchWithInfiniteScroll>
		</Panel>
	);
};

const mapStateToProps = (state) => {
	return {
		profileUser: state.user.profileUser
	}
};

const mapDispatchToProps = {
	goToPage
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);