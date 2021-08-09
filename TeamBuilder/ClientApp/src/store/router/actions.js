import { GO_TO_PAGE, SET_STORY, GO_BACK, OPEN_POPOUT, CLOSE_POPOUT, OPEN_MODAL, CLOSE_MODAL } from './actionTypes';

export const goToPage = (panel, itemId = null, rmPrevPageFromHistory = false) => (
	{
		type: GO_TO_PAGE,
		payload: {
			panel: panel,
			itemId: itemId,
			rmPrevPageFromHistory: rmPrevPageFromHistory
		}
	}
);

export const setStory = (story, initial_panel) => (
	{
		type: SET_STORY,
		payload: {
			story: story,
			initial_panel: initial_panel,
		}
	}
);

export const goBack = () => (
	{
		type: GO_BACK
	}
);

export const openPopout = (popout) => (
	{
		type: OPEN_POPOUT,
		payload: {
			popout: popout
		}
	}
);

export const closePopout = () => (
	{
		type: CLOSE_POPOUT
	}
);

export const openModal = (id) => (
	{
		type: OPEN_MODAL,
		payload: {
			id
		}
	}
);

export const closeModal = () => (
	{
		type: CLOSE_MODAL
	}
);
