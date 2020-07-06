﻿import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, goToPage, openPopout, closePopout } from "../../store/router/actions";

import {
	Panel, PanelHeader, Group, SimpleCell, InfoRow, Header, Avatar, Alert,
	PanelHeaderBack, Cell, List, PanelHeaderContent, PanelHeaderContext
} from '@vkontakte/vkui';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import { countConfirmed } from "../../infrastructure/utils";
import { getActivePanel } from "../../services/_functions";
import { Api } from '../../infrastructure/api';

const EventInfo = props => {
	const { goBack, goToPage } = props;

	const [itemId] = useState(getActivePanel(props.activeView).itemId);
	const [event, setEvent] = useState(null);
	const [contextOpened, setContextOpened] = useState(false);

	useEffect(() => {
		populateEventData();
	}, [])

	const toggleContext = () => {
		setContextOpened(!contextOpened);
	};

	const populateEventData = () => {
		Api.Events.get(itemId)
			.then(result => setEvent(result));
	}

	const canEdit = () => {
		let isOwner = event && props.profile?.id === event.ownerId;
		let isModerator = props.profileUser?.isModerator;
		return isOwner || isModerator;
	};

	const deleteEvent = () => {
		Api.Events.delete(event.id);
		goBack();
	};

	const openPopoutDeleteEvent = () => {
		props.openPopout(
			<Alert
				actionsLayout="vertical"
				actions={[{
					title: 'Удалить событие',
					autoclose: true,
					mode: 'destructive',
					action: () => deleteEvent(),
				}, {
					title: 'Отмена',
					autoclose: true,
					mode: 'cancel'
				}]}
				onClose={() => props.closePopout()}
			>
				<h2>Подтвердите действие</h2>
				<p>Вы уверены, что хотите удалить событие?</p>
			</Alert>
		);
	};

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={() => goBack()} />}>
				{canEdit()
					?
					<PanelHeaderContent
						aside={<Icon16Dropdown style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}
						onClick={toggleContext}>
						Событие
                    </PanelHeaderContent>
					:
					`Событие`
				}
			</PanelHeader>
			<PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
				<List>
					<Cell
						onClick={() => goToPage('eventEdit', itemId)}>
						Редактировать событие
                        </Cell>
					<Cell
						onClick={() => openPopoutDeleteEvent()}>
						Удалить событие
                        </Cell>
				</List>
			</PanelHeaderContext>
			<Group>
				<SimpleCell multiline>
					<InfoRow header="Название">
						{event?.name}
					</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Ссылка">
						<a href={event?.link}>{event?.link}</a>
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow header="Описание">
						{event?.description}
					</InfoRow>
				</SimpleCell>
				<SimpleCell>
					<InfoRow header="Время проведения">
						{event?.startDate} - {event?.finishDate}
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group>
				<Header mode="secondary">Участвующие команды</Header>
				{event?.teams?.map(team => {
					return (
						<Cell
							key={team.id}
							expandable
							indicator={countConfirmed(team.userTeams) + '/' + team.numberRequiredMembers}
							onClick={() => goToPage('teamInfo', team.id)}
							before={<Avatar size={48} src={team.photo100} />}>
							{team.name}
						</Cell>
					)
				}
				)}
			</Group>
		</Panel>
	);
}

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		profileUser: state.user.profileUser,
		activeView: state.router.activeView
	};
};


function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ goToPage, goBack, openPopout, closePopout }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);
