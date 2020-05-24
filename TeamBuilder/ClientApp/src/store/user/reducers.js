import {
    SET_USER, SET_PROFILE, SET_PROFILE_USER, SET_EVENT_USER, SET_TEAM_USER, SET_PARTICIPANT_USER
} from './actionTypes';

const initialState = {
    user: null
};

export const userReducer = (state = initialState, action) => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!action.type', action.type);
    switch (action.type) {
        case SET_USER: {

            return {
                ...state,
                user: action.payload.user
            };
        }
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
        case SET_EVENT_USER: {
            return {
                ...state,
                eventUser: action.payload.eventUser
            };
        }
        case SET_TEAM_USER: {
            return {
                ...state,
                teamUser: action.payload.teamUser
            };
        }
        case SET_PARTICIPANT_USER: {
            return {
                ...state,
                participantUser: action.payload.participantUser
            };
        }

        default: {
            return state;
        }
    }
};
