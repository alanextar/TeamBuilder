import { SET_NOTIFICATIONS, SET_CONNECTION } from './actionTypes';

export const setNotifications = (notifications) => {
	return {
		type: SET_NOTIFICATIONS,
		payload: {
			notifications
		}
	}
};

export const setConnection = (hubConnection) => {
	return {
		type: SET_CONNECTION,
		payload: {
			hubConnection
		}
	}
};