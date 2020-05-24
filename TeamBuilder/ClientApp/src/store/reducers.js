import {combineReducers} from "redux";
import {routerReducer} from './router/reducers';
import {vkuiReducer} from './vk/reducers';
import {formDataReducer} from "./formData/reducers";
import { teamReducer } from "./teams/reducers";
import { userReducer } from "./user/reducers";

export default combineReducers({
    vkui: vkuiReducer,
    router: routerReducer,
    formData: formDataReducer,
    team: teamReducer,
    user: userReducer
});