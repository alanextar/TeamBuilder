import {
    SET_TEAM, SET_USER_TEAM, SET_USERS_TEAM, SET_TEAMS_TEAM, SET_EVENTS_TEAM
} from './actionTypes';

const initialState = {
    activeTeam: null
};

export const teamReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_TEAM: {
            let Team = action.payload.activeTeam;

            return {
                ...state,
                activeTeam: Team
            };
        }
        case SET_USER_TEAM: {
            let Team = action.payload.activeTeam;

            return {
                ...state,
                userTeam: Team
            };
        }
        case SET_USERS_TEAM: {
            let Team = action.payload.activeTeam;

            return {
                ...state,
                usersTeam: Team
            };
        }
        case SET_EVENTS_TEAM: {
            let Team = action.payload.activeTeam;

            return {
                ...state,
                eventsTeam: Team
            };
        }
        case SET_TEAMS_TEAM: {
            let Team = action.payload.activeTeam;

            return {
                ...state,
                TeamsTeam: Team
            };
        }

        default: {
            return state;
        }
    }
};
