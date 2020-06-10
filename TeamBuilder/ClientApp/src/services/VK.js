import bridge from '@vkontakte/vk-bridge';

import { store } from "../index";
import { setColorScheme } from "../store/vk/actions";
import { setProfile, setUser, setProfileUser } from "../store/user/actions";

import { Api } from '../infrastructure/api';

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

export const closeApp = () => {
	return bridge.send("VKWebAppClose", {
		"status": "success"
	}).then(data => {
		return data;
	}).catch(error => {
		return error;
	});
};

export const initProfile = () => async (dispatch) => {
	console.log(`initProfile`);
	var vk = await bridge.send('VKWebAppGetUserInfo');
	dispatch(setProfile(vk));

	var bd = await Api.Users.get(vk.id);
	dispatch(setUser(bd));
	dispatch(setProfileUser(bd));
}

export const swipeBackOn = () => {
    return bridge.send("VKWebAppEnableSwipeBack", {}).then(data => {
        return data;
    }).catch(error => {
        return error;
    });
};

export const swipeBackOff = () => {
    return bridge.send("VKWebAppDisableSwipeBack", {}).then(data => {
        return data;
    }).catch(error => {
        return error;
    });
};

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
