import { SET_PARTICIPANT } from './actionTypes';

export const setParticipant = (participant) => {

    return {
        type: SET_PARTICIPANT,
        payload: {
            participant: participant
        }
    }
};
