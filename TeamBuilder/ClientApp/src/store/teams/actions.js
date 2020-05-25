import { SET_TEAM, CREATE_TEAM } from './actionTypes';

export const setTeam = (activeTeam) => {
    console.log('setTeam activeTeam', activeTeam);

    return {
        type: SET_TEAM,
        payload: {
            activeTeam: activeTeam
        }
    }
};

export const createTeam = () => {
    console.log('actions createTeam');

    return {
        type: CREATE_TEAM,
        payload: {
            createTeam: createTeam
        }
    }
};
