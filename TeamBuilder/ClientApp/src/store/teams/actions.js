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
export const setTeamsTeam = (activeTeam) => {

    return {
        type: SET_TEAMS_TEAM,
        payload: {
            activeTeam: activeTeam
        }
    }
};
export const setUserTeam = (activeTeam) => {

    return {
        type: SET_USER_TEAM,
        payload: {
            activeTeam: activeTeam
        }
    }
};
export const setUsersTeam = (activeTeam) => {

    return {
        type: SET_USERS_TEAM,
        payload: {
            activeTeam: activeTeam
        }
    }
};
export const setEventsTeam = (activeTeam) => {

    return {
        type: SET_EVENTS_TEAM,
        payload: {
            activeTeam: activeTeam
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
