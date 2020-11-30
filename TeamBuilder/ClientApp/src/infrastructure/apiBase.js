// import * as secrets from './secret.js';
import React from 'react';
import { store } from "../index";
import { setSnackbar } from "../store/formData/actions";
import { Snackbar, Avatar } from "@vkontakte/vkui";
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';

const initGet = {
	method: 'GET',
	headers: {
		'Launch-Params': window.location.search// === "" ? secrets.launchParams : window.location.search
	},
	mode: 'cors',
	cache: 'default'
};

const initPost = {
	method: 'POST',
	headers: {
		'Launch-Params': window.location.search,// === "" ? secrets.launchParams : window.location.search,
		'Content-Type': 'application/json'
	},
	mode: 'cors',
	cache: 'default'
};

const initDelete = {
	method: 'DELETE',
	headers: {
		'Launch-Params': window.location.search// === "" ? secrets.launchParams : window.location.search,
	},
	mode: 'cors',
	cache: 'default'
};

//TODO Сделать нормальную обработку ошибок!!! 
export async function get(url, params = {}) {
	try {
		var searchParams = new URLSearchParams(params).toString();
		url = searchParams ? `${url}?${searchParams}` : url;
		console.log(`get request: ${url}`);
		const resp = await fetch(url, initGet);
		const json = await resp.json();

		if (resp.ok)
			return json;
		else {
			throw { code: resp.status, ...json };
		}

	}
	catch (error) {
		console.log(`Error for get request '${url}'. Details: ${error}`);
		ShowError(error);
		throw error;
	}
	
}

export async function post(url, data = {}) {
	var init = initPost;
	init.body = JSON.stringify(data);
	try {
		console.log(`post request: ${url}`);
		const resp = await fetch(url, init);
		const json = await resp.json();
		if (resp.ok)
			return json;
		else {
			throw { code: resp.status, ...json };
		}
			
	}
	catch (error) {
		console.log(`Error for post request '${url}' with body ${JSON.stringify(data)}.  Details: ${error}`);
		ShowError(error);
	}
}

export async function Delete(url, params = {}) {
	var searchParams = new URLSearchParams(params).toString();
	if (searchParams) {
		url = `${url}?${searchParams}`;
	}
	console.log(`delete request: ${url}`);
	return fetch(url, initDelete)
		.then(resp => {
			const json = resp.json();
			if (resp.ok)
				return json;
			else {
				throw { code: resp.status, ...json };
			}
				
		})
		.catch(error => {
			console.log(`Error for delete request '${url}'. Details: ${error}`);
			ShowError(error);
		});
}

export function ShowError(error) {
	let snackbar = <Snackbar
		layout="vertical"
		onClose={() => store.dispatch(setSnackbar(null))}
			before={<Avatar size={24}><Icon20CancelCircleFillRed /></Avatar>}
		>
			<p>Код ошибки: {error.code != null ? error.code : 500}</p>
			<p>{error.message != null ? error.message : "Ничего страшного, бывает и хуже.Скоро устраним ;)"}</p>
	</Snackbar>
	store.dispatch(setSnackbar(snackbar));
}