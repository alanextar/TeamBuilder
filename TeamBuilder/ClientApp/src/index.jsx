import React from 'react';
import ReactDOM from 'react-dom';

import 'core-js/es6/map';
import 'core-js/es6/set';
import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { setStory } from "./store/router/actions";

import qwest from 'qwest';

import bridge from '@vkontakte/vk-bridge';

import App from './App'

bridge.send("VKWebAppInit", {});

qwest.setDefaultOptions({
    headers: {
        'Launch-Params': window.location.search
    }
});

export const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
));

store.dispatch(setStory('events', 'events'));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
if (process.env.NODE_ENV === "development") {
    import("eruda").then(({ default: eruda }) => { }); //runtime download
}