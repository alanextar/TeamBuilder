import {combineReducers} from "redux";

import {routerReducer} from './router/reducers';
import {vkuiReducer} from './vk/reducers';
import {formDataReducer} from "./formData/reducers";
import { userReducer } from "./user/reducers";
import { eventReducer } from "./events/reducers";

export default combineReducers({
    vkui: vkuiReducer,
    router: routerReducer,
    formData: formDataReducer,
    user: userReducer,
    event: eventReducer
});