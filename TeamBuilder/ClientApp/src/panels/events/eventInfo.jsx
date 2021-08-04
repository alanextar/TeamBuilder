import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { goBack, goToPage } from "../../store/router/actions";

import {
	Panel, PanelHeader, Group, SimpleCell, InfoRow, Header, Avatar, PullToRefresh,
	PanelHeaderBack, Cell, List, PanelHeaderContent, PanelHeaderContext, Placeholder
} from '@vkontakte/vkui';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import * as Alerts from "../components/Alerts.js";

import { countConfirmed } from "../../infrastructure/utils";
import { getActivePanel, longOperationWrapper } from "../../services/_functions";
import { Api } from '../../infrastructure/api';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

const EventInfo = props => {
	const { goBack, goToPage } = props;

	const [itemId] = useState(getActivePanel(props.activeView).itemId);
	const [fetching, setFetching] = useState(false);
	const [event, setEvent] = useState(null);
	const [contextOpened, setContextOpened] = useState(false);

	useEffect(() => {
		populateEventData();
	}, [])

	const onRefresh = async () => {
		setFetching(true);
		await populateEventData();
		setFetching(false);
	};

	const toggleContext = () => {
		setContextOpened(!contextOpened);
	};

	const populateEventData = async () => {
		let event = await Api.Events.get(itemId);
		setEvent(event);
	}

	const canEdit = () => {
		let isOwner = event && props.profile?.id === event.ownerId;
		let isModerator = props.profileUser?.isModerator;
		return isOwner || isModerator;
	};

	const deleteEvent = () => {
		let action = async () => await Api.Events.delete(event.id);
		let postAction = () => goBack();
		let handler = () => longOperationWrapper({action, postAction});

		Alerts.DeleteEventPopout(event.name, handler);
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
						onClick={() => deleteEvent()}>
						Удалить событие
                        </Cell>
				</List>
			</PanelHeaderContext>
			<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
				<Group>
					<SimpleCell multiline>
						<InfoRow header="Название">
							{event?.name}
						</InfoRow>
					</SimpleCell>
					<SimpleCell>
						<InfoRow header="Ссылка">
							<a style={{ color: 'rgb(0, 125, 255)' }} href={event?.link}>{event?.link}</a>
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
					{event && event.teams && event.teams.length ? event.teams.map(team => {
							return (
								<Cell
									key={team.id}
									expandable
									indicator={countConfirmed(team.userTeams) + '/' + team.numberRequiredMembers}
									onClick={() => goToPage('teamInfo', team.id)}
									before={<Avatar size={48} src={team.image?.dataURL} />}>
									{team.name}
								</Cell>
							)
						})
					:
						<Placeholder icon={<Icon56UsersOutline />} header="Нет заявок от команд">
							Мероприятие создано, но ни одна из команд пока не вступила в него
						</Placeholder>
					}
				</Group>
			</PullToRefresh>
			{props.snackbar}
		</Panel>
	);
}

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		profileUser: state.user.profileUser,
		activeView: state.router.activeView,
		snackbar: state.formData.snackbar,
		error: state.formData.error
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack
}

export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);
