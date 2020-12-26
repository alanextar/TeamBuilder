// import * as secrets from './secret.js';
import React from 'react';
import { store } from "../index";
import { setError, setSnackbar } from "../store/formData/actions";
import { Snackbar, Avatar } from "@vkontakte/vkui";
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import * as Alerts from "../panels/components/Alerts.js";

const getVkId = () => {
	const params = new URLSearchParams(window.location.search)
	return params.get("vk_user_id");
}

const commonHeaders = {
	'Launch-Params': window.location.search,// === "" ? secrets.launchParams : window.location.search
	'X-ClientId': getVkId()
}

const initGet = {
	method: 'GET',
	headers: {
		...commonHeaders
	},
	mode: 'cors',
	cache: 'default'
};

const initPost = {
	method: 'POST',
	headers: {
		...commonHeaders,
		'Content-Type': 'application/json'
	},
	mode: 'cors',
	cache: 'default'
};

const initDelete = {
	method: 'DELETE',
	headers: {
		...commonHeaders
	},
	mode: 'cors',
	cache: 'default'
};

export async function get(url, params = {}) {
	//reset error before each request
	store.dispatch(setError(null));

	try {
		var searchParams = new URLSearchParams(params).toString();
		url = searchParams ? `${url}?${searchParams}` : url;
		console.log(`get request: ${url}`);
		const resp = await fetch(url, initGet);
		const json = await resp.json();

		if (resp.ok){
			return json;
		}
		else {
			throw { ...json, code:resp.status };
		}

	}
	catch (error) {
		console.log(`Error for get request '${url}'. Details: ${error}`);
		ShowError(error);
		throw error;
	}
	
}

export async function post(url, data = {}) {
	store.dispatch(setError(null));

	var init = initPost;
	init.body = JSON.stringify(data);
	try {
		console.log(`post request: ${url}`);
		const resp = await fetch(url, init);
		const json = await resp.json();
		if (resp.ok)
			return json;
		else {
			
			throw {...json, code : resp.status};
		}
			
	}
	catch (error) {
		console.log(`Error for post request '${url}' with body ${JSON.stringify(data)}.  Details: ${error}`);
		ShowError(error);
		throw error;
	}
}

export async function Delete(url, params = {}) {
	store.dispatch(setError(null));

	try {
		var searchParams = new URLSearchParams(params).toString();
		if (searchParams) {
			url = `${url}?${searchParams}`;
		}
		console.log(`delete request: ${url}`);
		const resp = await fetch(url, initDelete);
		const json = await resp.json();

		if (resp.ok)
			return json;
		else {
			throw { ...json, code: resp.status };
		}

	}
	catch (error) {
		console.log(`Error for delete request '${url}'. Details: ${error}`);
		ShowError(error);
		Alerts.UnblockScreen();
		throw error;
	}
}

export function ShowError(error) {
	let message = error?.message;
	if (error.code == 429) {
		message = "Упс. Кажется, Вы слишком часто повторяете какое-то действие, попробуйте позже"
	}

	if (error.code != 204) {
		let snackbar = <Snackbar
			layout="vertical"
			onClose={() => store.dispatch(setSnackbar(null))}
			before={<Avatar size={24}><Icon20CancelCircleFillRed /></Avatar>}
		>
			<p>Код ошибки: {error.code ? error.code : 500}</p>
			<p>{message ? message : "Ничего страшного, бывает и хуже.Скоро устраним ;)"}</p>
		</Snackbar>
		store.dispatch(setSnackbar(snackbar));
	}

	store.dispatch(setError(error));
}