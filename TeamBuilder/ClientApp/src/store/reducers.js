import {combineReducers} from "redux";
import {routerReducer} from './router/reducers';
import {vkuiReducer} from './vk/reducers';
import {formDataReducer} from "./formData/reducers";
import { teamReducer } from "./teams/reducers";
import { userReducer } from "./user/reducers";
import { participantReducer } from "./participants/reducers";
import { eventReducer } from "./events/reducers";

export default combineReducers({
    vkui: vkuiReducer,
    router: routerReducer,
    formData: formDataReducer,
    team: teamReducer,
    user: userReducer,
    participant: participantReducer,
    event: eventReducer
});