import { SET_NOTIFICATIONS, SET_AS_READ, SET_CONNECTION, SET_ERRORMESSAGE } from './actionTypes';

export const setNotifications = (notifications) => {
	return {
		type: SET_NOTIFICATIONS,
		payload: {
			notifications
		}
	}
};

export const setAsRead = (notificationIds) => {
	return {
		type: SET_AS_READ,
		payload: {
			notificationIds
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

export const setErrorMessage = (errorMessage) => {
	return {
		type: SET_ERRORMESSAGE,
		payload: {
			errorMessage
		}
	}
};