import {SET_FORM_DATA, SET_ERROR, SET_SNACKBAR} from './actionTypes';

const initialState = {
    forms: []
};

export const formDataReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_FORM_DATA: {
            return {
                ...state,
                forms: {
                    ...state.forms,
                    [action.payload.form]: action.payload.data
                }
            };
        }
		case SET_ERROR: {
            return {
                ...state,
				error: action.payload.error
            };
        }
		case SET_SNACKBAR: {
            return {
                ...state,
				snackbar: action.payload.snackbar
            };
        }

        default: {
            return state;
        }

    }

};