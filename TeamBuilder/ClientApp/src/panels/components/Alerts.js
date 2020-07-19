import React from 'react';

import { Alert, ScreenSpinner } from '@vkontakte/vkui';

import { store } from "../../index";
import { goBack, openPopout, closePopout, goToPage } from "../../store/router/actions";
import * as TeamManagement from '../../services/teamManagement';

export const DeleteTeamPopout = (teamId, teamName) => {
	store.dispatch(openPopout(
		<Alert
			actionsLayout="vertical"
			actions={[{
				title: 'Удалить команду',
				autoclose: true,
				mode: 'destructive',
				action: () => TeamManagement.deleteTeam(teamId),
			}, {
				title: 'Отмена',
				autoclose: true,
				mode: 'cancel'
			}]}
			onClose={() => store.dispatch(closePopout())}
		>
			<h2>Подтвердите действие</h2>
			<p>Вы уверены, что хотите удалить команду «{teamName}»?`</p>
		</Alert>
	));
};

export const LeaveTeamPopout = (teamName, leaveTeamHandler) => {
	store.dispatch(openPopout(
		<Alert
			actionsLayout="vertical"
			actions={[{
				title: 'Выйти из команды',
				autoclose: true,
				mode: 'destructive',
				action: () => leaveTeamHandler(),
			}, {
				title: 'Отмена',
				autoclose: true,
				mode: 'cancel'
			}]}
			onClose={() => store.dispatch(closePopout())}
		>
			<h2>Подтвердите действие</h2>
			<p>Вы уверены, что хотите выйти из команды «{teamName}»?</p>
		</Alert>
	));
};

export const DeclineTeamInvitePopout = (teamName, declineTeamInviteHandler) => {
	store.dispatch(openPopout(
		<Alert
			actionsLayout="vertical"
			actions={[{
				title: 'Отклонить приглашение',
				autoclose: true,
				mode: 'destructive',
				action: () => declineTeamInviteHandler(),
			}, {
				title: 'Отмена',
				autoclose: true,
				mode: 'cancel'
			}]}
			onClose={() => store.dispatch(closePopout())}
		>
			<h2>Подтвердите действие</h2>
			<p>Вы уверены, что хотите отклонить приглашение команды «{teamName}»?</p>
		</Alert>
	));
};

export const CanselRequestToTeamPopout = (teamName, canselRequestToTeamHandler) => {
	store.dispatch(openPopout(
		<Alert
			actionsLayout="vertical"
			actions={[{
				title: 'Отозвать заявку',
				autoclose: true,
				mode: 'destructive',
				action: () => canselRequestToTeamHandler(),
			}, {
				title: 'Отмена',
				autoclose: true,
				mode: 'cancel'
			}]}
			onClose={() => store.dispatch(closePopout())}
		>
			<h2>Подтвердите действие</h2>
			<p>Вы уверены, что хотите отозвать заявку в команду «{teamName}»?</p>
		</Alert>
	));
};

export const BlockScreen = () => {
	store.dispatch(openPopout(
		<ScreenSpinner />
	));
}

export const UnblockScreen = () => {
	store.dispatch(closePopout())
}