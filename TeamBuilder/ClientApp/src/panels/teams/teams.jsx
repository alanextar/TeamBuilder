import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { goToPage, goBack } from '../../store/router/actions';
import {
	Panel, PanelHeader, Avatar, RichCell,
	PanelHeaderButton, CardGrid, Card, Placeholder
} from '@vkontakte/vkui';

import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

import { Api, Urls } from '../../infrastructure/api';
import { countConfirmed, isNoContentResponse } from "../../infrastructure/utils";

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
				left={<PanelHeaderButton className="pointer" onClick={() => goToPage('teamCreate')}>Создать</PanelHeaderButton>}>
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
							before={<Avatar size={64} src={team.imageDataUrl} />}
							text={team.description}
							caption={team.eventName}
							after={team.countConfirmedUser +
								'/' + team.numberRequiredMembers}
							onClick={() => goToPage('teamInfo', team.id)}
						>
							{team.title}
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
			{
				isNoContentResponse(props.error) &&
				<Placeholder icon={<Icon56UsersOutline />} header="Список команд пуст">
					Создавайте команду. Вступайте в существующие мероприятия <br />
					или создайте своё и пригласите туда участников
				</Placeholder>
			}
		</Panel>
	);
};

const mapStateToProps = (state) => {
	return {
		teamsEventFilter: state.event.teamsEventFilter,
		profileUser: state.user.profileUser,
		error: state.formData.error
	}
};

const mapDispatchToProps = {
	goToPage,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(Teams);