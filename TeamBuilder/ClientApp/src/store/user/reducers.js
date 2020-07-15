import { SET_PROFILE, SET_PROFILE_USER, ADD_TEAM_TO_PROFILE } from './actionTypes';

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
		case ADD_TEAM_TO_PROFILE: {
			let newUt = action.payload.userTeam;
			let existUt = state.profileUser.userTeams || [];

			let existUtIndexForNewUt = existUt.findIndex(ut => ut.teamId === newUt.teamId);

			let result;
			if (existUtIndexForNewUt === -1) {
				result = [...existUt, newUt];
			}
			else {
				existUt[existUtIndexForNewUt] = newUt;
				result = existUt;
			}

			return {
				...state,
				profileUser: {
					...state.profileUser,
					userTeams: result
				}
			};
		}

		default: {
			return state;
		}
	}
};
