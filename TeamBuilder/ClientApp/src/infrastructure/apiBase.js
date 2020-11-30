// import * as secrets from './secret.js';
import { store } from "../index";
import { goToPage } from "../store/router/actions";
import { setError } from "../store/formData/actions";

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
	store.dispatch(setError(error));
}