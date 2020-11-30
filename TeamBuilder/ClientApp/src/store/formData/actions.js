import { SET_FORM_DATA, SET_ERROR,  SET_SNACKBAR} from './actionTypes';

export const setFormData = (formName, inputData) => (
    {
        type: SET_FORM_DATA,
        payload: {
            form: formName,
            data: inputData,
        }
    }
);

export const setError = (error) => (
    {
		type: SET_ERROR,
        payload: {
            error: error
        }
    }
);

export const setSnackbar = (snackbar) => (
    {
		type: SET_SNACKBAR,
        payload: {
			snackbar: snackbar
        }
    }
);