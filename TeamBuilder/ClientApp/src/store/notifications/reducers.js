import {
	SET_NOTIFICATIONS, SET_CONNECTION
} from './actionTypes';


// const notification = {
// 	id,
// 	dateTimeNotify,
// 	message,
// 	notifyType, // 0 None, 1 Regular, 2 Destructive, 3 Important, 4 Service
// 	items,
// 	isNew
// }

const initialState = {
	hubConnection: null,
	notifications: []
};

export const noticeReducer = (state = initialState, action) => {

	switch (action.type) {
		case SET_NOTIFICATIONS: {
			return {
				...state,
				notifications: [...state.notifications, ...action.payload.notifications]
			};
		}

		case SET_CONNECTION: {
			return {
				...state,
				hubConnection: action.payload.hubConnection
			};
		}

		default: {
			return state;
		}
	}
};
