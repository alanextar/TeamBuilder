const initGet = {
    method: 'GET',
    headers: {
        'Launch-Params': window.location.search
    },
    mode: 'cors',
    cache: 'default'
};

const initPost = {
    method: 'POST',
    headers: {
        'Launch-Params': window.location.search,
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default'
};

export function get(url, params = {}) {
    var searchParams = new URLSearchParams(params).toString();
    if (searchParams){
        url = `${url}?${searchParams}`;
    }
    return fetch(url, initGet)
        .then(resp => resp.json())
        .then(json => json)
        .catch(error => {
            console.log(`Error for get request '${url}'. Details: ${error}`);
            return {};
        });
}

export function post(url, data = {}) {
    var init = initPost;
    init.body = JSON.stringify(data);
    return fetch(url, init)
        .then(resp => resp.json())
        .then(json => json)
        .catch(error => {
            console.log(`Error for post request '${url}' with body ${JSON.stringify(data)}.  Details: ${error}`);
            return {};
        });
}
