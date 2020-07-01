import {
	GO_TO_PAGE,
	SET_PAGE,
	GO_BACK,
	OPEN_POPOUT,
	CLOSE_POPOUT,
	OPEN_MODAL,
	CLOSE_MODAL,
	SET_STORY
} from './actionTypes';

import * as VK from "../../services/VK";
import { smoothScrollToTop } from "../../services/_functions";

const initialState = {
	activeStory: null,
	activeView: null,
	activePanel: null,

	activeUserId: null,
	activeTeamId: null,
	activeEventsId: null,

	storiesHistory: [],
	viewsHistory: [],
	panelsHistory: [],

	activeModals: [],
	modalHistory: [],
	popouts: [],

	scrollPosition: []
};

export const routerReducer = (state = initialState, action) => {

	switch (action.type) {

		case GO_TO_PAGE: {
			let Panel = action.payload.panel + "_" + action.payload.itemId;
			let View = state.activeView;
			
			// let ItemId = action.payload.itemId;

			// let userId = state.activeUserId;
			// let teamId = state.activeTeamId;
			// let eventId = state.activeEventsId;

			// if (ItemId) {
			// 	if (Panel = 'user') {
			// 		userId = ItemId;
			// 	}
			// 	if (Panel = 'teaminfo') {
			// 		teamId = ItemId
			// 	}
			// 	if (Panel = 'eventinfo') {
			// 		eventId = ItemId
			// 	}
			// }

			window.history.pushState(null, null); // Это вопрос конечно, стоит ли это делать

			let panelsHistory = state.panelsHistory[View] || [];
			panelsHistory = [...panelsHistory, Panel];

			if (panelsHistory.length > 1) {
				VK.swipeBackOn();
			}

			return {
				...state,
				activePanel: Panel,

				// activeUserId: userId,
				// activeTeamId: teamId,
				// activeEventsId: eventId,

				panelsHistory: {
					...state.panelsHistory,
					[View]: panelsHistory,
				},

				scrollPosition: {
					...state.scrollPosition,
					[state.activeStory + "_" + state.activeView + "_" + state.activePanel]: window.pageYOffset
				}
			};
		}

		case SET_PAGE: {
			let View = action.payload.view;
			let Panel = action.payload.panel;

			window.history.pushState(null, null);

			let panelsHistory = state.panelsHistory[View] || [];
			let viewsHistory = state.viewsHistory[state.activeStory] || [];

			const viewIndexInHistory = viewsHistory.indexOf(View);

			if (viewIndexInHistory !== -1) {
				viewsHistory.splice(viewIndexInHistory, 1);
			}

			if (panelsHistory.indexOf(Panel) === -1) {
				panelsHistory = [...panelsHistory, Panel];
			}

			if (panelsHistory.length > 1) {
				VK.swipeBackOn();
			}

			return {
				...state,
				activeView: View,
				activePanel: Panel,

				panelsHistory: {
					...state.panelsHistory,
					[View]: panelsHistory,
				},
				viewsHistory: {
					...state.viewsHistory,
					[state.activeStory]: [...viewsHistory, View]
				},
				scrollPosition: {
					...state.scrollPosition,
					[state.activeStory + "_" + state.activeView + "_" + state.activePanel]: window.pageYOffset
				}
			};
		}

		case SET_STORY: {
			window.history.pushState(null, null);

			let viewsHistory = state.viewsHistory[action.payload.story] || [action.payload.story];

			let storiesHistory = state.storiesHistory;
			let activeView = viewsHistory[viewsHistory.length - 1];
			let panelsHistory = state.panelsHistory[activeView] || [action.payload.initial_panel];
			let activePanel = panelsHistory[panelsHistory.length - 1];

			if (action.payload.story === state.activeStory) {
				if (panelsHistory.length > 1) {
					let firstPanel = panelsHistory.shift();
					panelsHistory = [firstPanel];

					activePanel = panelsHistory[panelsHistory.length - 1];
				} else if (viewsHistory.length > 1) {
					let firstView = viewsHistory.shift();
					viewsHistory = [firstView];

					activeView = viewsHistory[viewsHistory.length - 1];
					panelsHistory = state.panelsHistory[activeView];
					activePanel = panelsHistory[panelsHistory.length - 1];
				}
			}

			if (action.payload.story === state.activeStory && panelsHistory.length === 1 && window.pageYOffset > 0) {
				window.scrollTo(0, 30);

				smoothScrollToTop();
			}

			const storiesIndexInHistory = storiesHistory.indexOf(action.payload.story);

			if (storiesIndexInHistory === -1 || (storiesHistory[0] === action.payload.story && storiesHistory[storiesHistory.length - 1] !== action.payload.story)) {
				storiesHistory = [...storiesHistory, action.payload.story];
			}

			return {
				...state,
				activeStory: action.payload.story,
				activeView: activeView,
				activePanel: activePanel,

				storiesHistory: storiesHistory,
				viewsHistory: {
					...state.viewsHistory,
					[activeView]: viewsHistory
				},
				panelsHistory: {
					...state.panelsHistory,
					[activeView]: panelsHistory
				},

				scrollPosition: {
					...state.scrollPosition,
					[state.activeStory + "_" + state.activeView + "_" + state.activePanel]: window.pageYOffset
				}
			};
		}

		case GO_BACK: {
			let setView = state.activeView;
			let setPanel = state.activePanel;
			let setStory = state.activeStory;

			let popoutsData = state.popouts;

			if (popoutsData[setView]) {
				popoutsData[setView] = null;

				return {
					...state,
					popouts: {
						...state.popouts, popoutsData
					}
				};
			}

			let viewModalsHistory = state.modalHistory[setView];

			if (viewModalsHistory !== undefined && viewModalsHistory.length !== 0) {
				let activeModal = viewModalsHistory[viewModalsHistory.length - 2] || null;

				if (activeModal === null) {
					viewModalsHistory = [];
				} else if (viewModalsHistory.indexOf(activeModal) !== -1) {
					viewModalsHistory = viewModalsHistory.splice(0, viewModalsHistory.indexOf(activeModal) + 1);
				} else {
					viewModalsHistory.push(activeModal);
				}

				return {
					...state,
					activeModals: {
						...state.activeModals,
						[setView]: activeModal
					},
					modalHistory: {
						...state.modalHistory,
						[setView]: viewModalsHistory
					}
				};
			}

			let panelsHistory = state.panelsHistory[setView] || [];
			let viewsHistory = state.viewsHistory[state.activeStory] || [];
			let storiesHistory = state.storiesHistory;

			if (panelsHistory.length > 1) {
				panelsHistory.pop();

				setPanel = panelsHistory[panelsHistory.length - 1];
			} else if (viewsHistory.length > 1) {
				viewsHistory.pop();

				setView = viewsHistory[viewsHistory.length - 1];
				let panelsHistoryNew = state.panelsHistory[setView];

				setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
			} else if (storiesHistory.length > 1) {
				storiesHistory.pop();

				setStory = storiesHistory[storiesHistory.length - 1];
				setView = state.viewsHistory[setStory][state.viewsHistory[setStory].length - 1];

				let panelsHistoryNew = state.panelsHistory[setView];

				if (panelsHistoryNew.length > 1) {
					setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
				} else {
					setPanel = panelsHistoryNew[0];
				}
			} else {
				VK.closeApp();
			}

			if (panelsHistory.length === 1) {
				VK.swipeBackOff();
			}

			return {
				...state,
				activeView: setView,
				activePanel: setPanel,
				activeStory: setStory,

				viewsHistory: {
					...state.viewsHistory,
					[state.activeView]: viewsHistory
				},
				panelsHistory: {
					...state.panelsHistory,
					[state.activeView]: panelsHistory
				}
			};
		}

		case OPEN_POPOUT: {
			window.history.pushState(null, null);

			return {
				...state,
				popouts: {
					...state.popouts,
					[state.activeView]: action.payload.popout
				}
			};
		}

		case CLOSE_POPOUT: {
			return {
				...state,
				popouts: {
					...state.popouts,
					[state.activeView]: null
				}
			};
		}

		case OPEN_MODAL: {
			window.history.pushState(null, null);

			let activeModal = action.payload.id || null;
			let modalsHistory = state.modalHistory[state.activeView] ? [...state.modalHistory[state.activeView]] : [];

			if (activeModal === null) {
				modalsHistory = [];
			} else if (modalsHistory.indexOf(activeModal) !== -1) {
				modalsHistory = modalsHistory.splice(0, modalsHistory.indexOf(activeModal) + 1);
			} else {
				modalsHistory.push(activeModal);
			}

			return {
				...state,
				activeModals: {
					...state.activeModals,
					[state.activeView]: activeModal
				},
				modalHistory: {
					...state.modalHistory,
					[state.activeView]: modalsHistory
				}
			};
		}

		case CLOSE_MODAL: {
			let activeModal = state.modalHistory[state.activeView][state.modalHistory[state.activeView].length - 2] || null;
			let modalsHistory = state.modalHistory[state.activeView] ? [...state.modalHistory[state.activeView]] : [];

			if (activeModal === null) {
				modalsHistory = [];
			} else if (modalsHistory.indexOf(activeModal) !== -1) {
				modalsHistory = modalsHistory.splice(0, modalsHistory.indexOf(activeModal) + 1);
			} else {
				modalsHistory.push(activeModal);
			}

			return {
				...state,
				activeModals: {
					...state.activeModals,
					[state.activeView]: activeModal
				},
				modalHistory: {
					...state.modalHistory,
					[state.activeView]: modalsHistory
				}
			};
		}

		default: {
			return state;
		}
	}
};
