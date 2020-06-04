import * as api from "./apiBase";
import { Urls } from "./api"

export function pagingSearch(value) {
    console.log(`events.pagingSearch ${value}`);
    return api.get(Urls.Events.PagingSearch, { search: value });
};

export function getPage(params = {}) {
    console.log(`events.getPage`);
    return api.get(Urls.Events.GetPage, params);
};

export function getAll() {
    console.log(`events.getAll`);
    return api.get(Urls.Events.GetAll);
};

export function get(id) {
    console.log(`events.get`);
    return api.get(Urls.Events.Get, {id: id});
};

export function create(data) {
    console.log(`events.create`);
    return api.post(Urls.Events.Create, data);
};

export function edit(data) {
    console.log(`events.edit`);
    return api.post(Urls.Events.Edit, data);
};

export function Delete(id) {
    console.log(`events.Delete`);
    return api.Delete(Urls.Events.Delete, {id: id});
};