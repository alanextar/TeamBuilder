import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import 'core-js/es6/map';
import 'core-js/es6/set';
import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { setStory } from "./store/router/actions";

import bridge from '@vkontakte/vk-bridge';

import App from './App'

bridge.send("VKWebAppInit", {});

export const store = createStore(
    rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
    applyMiddleware(logger)
));

store.dispatch(setStory('events', 'events'));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
if (process.env.NODE_ENV === "development") {
    import("eruda").then(({ default: eruda }) => { }); //runtime download
}