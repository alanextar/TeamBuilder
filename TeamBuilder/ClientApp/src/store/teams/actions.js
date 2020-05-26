import { SET_TEAM, CREATE_TEAM } from './actionTypes';

export const setTeam = (activeTeam) => {

    return {
        type: SET_TEAM,
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
