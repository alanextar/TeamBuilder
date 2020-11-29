import { SET_FORM_DATA, SET_ERROR_MSG} from './actionTypes';

export const setFormData = (formName, inputData) => (
    {
        type: SET_FORM_DATA,
        payload: {
            form: formName,
            data: inputData,
        }
    }
);

export const setErrorMsg = (msg) => (
    {
		type: SET_ERROR_MSG,
        payload: {
            error: msg
        }
    }
);