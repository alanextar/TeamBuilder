import { SET_TEAMS_EVENT_FILTER } from './actionTypes';

export const setTeamsEventFilter = (event) => {
	return {
		type: SET_TEAMS_EVENT_FILTER,
		payload: {
			teamsEventFilter: event
		}
	}
};