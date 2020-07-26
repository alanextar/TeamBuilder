import * as api from "./apiBase";

export function pagingSearch(url, value, filter) {
    console.log(`common.search ${value}`);
    let search = value && {search: value};
    return api.get(url, {...search, ...filter});
};

export function get(url, id) {
    console.log(`common.get id: '${id}'`);
    return api.get(url, {id: id});
};

export function create(url, data) {
    console.log(`common.create`);
    return api.post(url, data);
};

export function edit(url, data) {
    console.log(`common.edit`);
    return api.post(url, data);
};

export function Delete(url, id) {
    console.log(`common.Delete id: '${id}'`);
    return api.Delete(url, {id: id});
};