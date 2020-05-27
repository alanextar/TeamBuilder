import {
    SET_TEAM, SET_TEAMS_TEAM, SET_USERS_TEAM,
    SET_USER_TEAM, SET_EVENTS_TEAM, CREATE_TEAM
} from './actionTypes';

export const setTeam = (activeTeam) => {

    return {
        type: SET_TEAM,
        payload: {
            activeTeam: activeTeam
        }
    }
};
export const setTeamsTeam = (teamsTeam) => {

    return {
        type: SET_TEAMS_TEAM,
        payload: {
            teamsTeam: teamsTeam
        }
    }
};
export const setUserTeam = (userTeam) => {

    return {
        type: SET_USER_TEAM,
        payload: {
            userTeam: userTeam
        }
    }
};
export const setUsersTeam = (usersTeam) => {

    return {
        type: SET_USERS_TEAM,
        payload: {
            usersTeam: usersTeam
        }
    }
};
export const setEventsTeam = (eventsTeam) => {

    return {
        type: SET_EVENTS_TEAM,
        payload: {
            eventsTeam: eventsTeam
        }
    }
};

export const createTeam = () => {

    return {
        type: CREATE_TEAM,
        payload: {
            createTeam: createTeam
        }
    }
};
