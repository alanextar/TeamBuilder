// import * as secrets from './secret.js';

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

export async function get(url, params = {}) {
    var searchParams = new URLSearchParams(params).toString();
    if (searchParams){
        url = `${url}?${searchParams}`;
    }
    console.log(`get request: ${url}`);
    return fetch(url, initGet)
        .then(resp => resp.json())
        .then(json => json)
        .catch(error => {
            console.log(`Error for get request '${url}'. Details: ${error}`);
            return {};
        });
}

export async function post(url, data = {}) {
    var init = initPost;
    init.body = JSON.stringify(data);
    try {
		console.log(`post request: ${url}`);
        const resp = await fetch(url, init);
        const json = await resp.json();
        return json;
    }
    catch (error) {
        console.log(`Error for post request '${url}' with body ${JSON.stringify(data)}.  Details: ${error}`);
        return {};
    }
}

export async function Delete(url, params = {}) {
    var searchParams = new URLSearchParams(params).toString();
    if (searchParams){
        url = `${url}?${searchParams}`;
    }
    console.log(`delete request: ${url}`);
    return fetch(url, initDelete)
        .then(resp => resp.json())
        .then(json => json)
        .catch(error => {
            console.log(`Error for delete request '${url}'. Details: ${error}`);
            return {};
        });
}