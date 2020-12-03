import { combineReducers } from "redux";

import { routerReducer } from './router/reducers';
import { vkuiReducer } from './vk/reducers';
import { formDataReducer } from "./formData/reducers";
import { userReducer } from "./user/reducers";
import { eventReducer } from "./events/reducers";
import { noticeReducer } from "./notifications/reducers";

export default combineReducers({
	notice: noticeReducer,
	vkui: vkuiReducer,
	router: routerReducer,
	formData: formDataReducer,
	user: userReducer,
	event: eventReducer
});