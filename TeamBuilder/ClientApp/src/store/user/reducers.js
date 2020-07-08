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

			return {
				...state,
				profileUser: {
					...state.profileUser,
					userTeams: [...existUt, newUt]
				}
			};
		}

		default: {
			return state;
		}
	}
};
