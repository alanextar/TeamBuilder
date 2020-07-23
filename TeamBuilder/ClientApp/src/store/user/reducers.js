import { SET_PROFILE, SET_PROFILE_USER } from './actionTypes';

const initialState = {
	profile: undefined,
	profileUser: undefined
};

export const userReducer = (state = initialState, action) => {

	switch (action.type) {
		case SET_PROFILE: {
			return {
				...state,
				profile: action.payload.profile
			};
		}
		case SET_PROFILE_USER: {
			return {
				...state,
				profileUser: action.payload.profileUser
			};
		}

		default: {
			return state;
		}
	}
};
