//import VKConnect from "@vkontakte/vk-connect";
import bridge from '@vkontakte/vk-bridge';
import { Api } from '../infrastructure/api';

import { store } from "../index";

import { setColorScheme, setAccessToken } from "../store/vk/actions";
import { setProfile, setUser } from "../store/user/actions";

const APP_ID = 7448436;
const API_VERSION = '5.92';

export const initApp = () => (dispatch) => {
    const VKConnectCallback = (e) => {
        if (e.detail.type === 'VKWebAppUpdateConfig') {
            bridge.unsubscribe(VKConnectCallback);

            dispatch(setColorScheme(e.detail.data.scheme));
        }
    };

    bridge.subscribe(VKConnectCallback);
    return bridge.send('VKWebAppInit', {}).then(data => {
        return data;
    }).catch(error => {
        return error;
    });
};

export const initProfile = () => async (dispatch) => {
    const userInfo = await bridge.send('VKWebAppGetUserInfo');
    const personalCard = {}
    if (bridge.supports("VKWebAppGetPersonalCard")) {
        personalCard = await bridge.send('VKWebAppGetPersonalCard', {"type": ["phone", "email"]});
    }

    const user = await Api.Users.get(userInfo.id);

    if (user === null) {
        let profile = {
            id: userInfo.id,
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            city: userInfo.city.title,
            photo100: userInfo.photo_100,
            photo200: userInfo.photo_200,
            mobile: personalCard.phone,
            email: personalCard.email,
            isSearchable: true,
            isNew: true
        };
        console.log(`user.first ${JSON.stringify(profile, null, 4)}`);
        dispatch(setProfile(profile));
        dispatch(setUser(profile));
        return;
    }

    console.log(`user.beforeCompare ${JSON.stringify(user, null, 4)}`);

    if (needUpdate(userInfo, user)){
        let profileViewModel = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            photo100: user.photo100,
            photo200: user.photo200,
            mobile: user.phone,
            email: user.email,
            isSearchable: true,
        };
        await Api.Users.saveOrConfirm(profileViewModel);
    }

    dispatch(setProfile(user));
    dispatch(setUser(user));
}

const needUpdate = (userInfo, user) => {
    var isEqual = true;
    compareProp(userInfo, user, "first_name", "firstName", isEqual);
    compareProp(userInfo, user, "last_name", "lastName", isEqual);
    compareProp(userInfo, user, "photo_100", "photo100", isEqual);
    compareProp(userInfo, user, "photo_200", "photo200", isEqual);
    // if (true){
    //     compare(userInfo, user, "phone", "mobile", isEqual);
    //     compare(userInfo, user, "email", "email", isEqual);
    // }
    if (userInfo.city.title !== user['city']){
        user['city'] = userInfo.city.title;
        isEqual = false;
    }
    return !isEqual;
}

//СЫЛКИ НА аватар почему то всегда "различаются" (не равны). по факту одинаковые
const compareProp = (vk, bd, vkProp, bdProp, isEqual) => {
    if (vk[vkProp] !== bd[bdProp]){
        bd[bdProp] = vk[vkProp];
        isEqual = false;
    }
}

//export const getAuthToken = (scope) => (dispatch) => {
//    VKConnect.send("VKWebAppGetAuthToken", {
//        "app_id": APP_ID,
//        "scope": scope.join(',')
//    }).then(data => {
//        dispatch(setAccessToken(data.access_token));
//    }).catch(() => {
//        dispatch(setAccessToken(null));
//    });
//};

export const closeApp = () => {
    return bridge.send("VKWebAppClose", {
        "status": "success"
    }).then(data => {
        return data;
    }).catch(error => {
        return error;
    });
};

//export const swipeBackOn = () => {
//    return VKConnect.send("VKWebAppEnableSwipeBack", {}).then(data => {
//        return data;
//    }).catch(error => {
//        return error;
//    });
//};

//export const swipeBackOff = () => {
//    return VKConnect.send("VKWebAppDisableSwipeBack", {}).then(data => {
//        return data;
//    }).catch(error => {
//        return error;
//    });
//};

export const APICall = (method, params) => {
    params['access_token'] = store.getState().vkui.accessToken;
    params['v'] = params['v'] === undefined ? API_VERSION : params['v'];

    return bridge.send("VKWebAppCallAPIMethod", {
        "method": method,
        "params": params
    }).then(data => {
        return data.response;
    }).catch(error => {
        return error;
    });
};
