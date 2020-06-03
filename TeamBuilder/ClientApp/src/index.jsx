import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './store/reducers';
import { setStory } from "./store/router/actions";
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';

import bridge from '@vkontakte/vk-bridge';

import './css/main.css';
import App from './App'
import * as VK from './services/VK';

bridge.send("VKWebAppInit", {});

export const store = createStore(
    rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
    applyMiddleware(logger)
));

store.dispatch(VK.initProfile());

store.dispatch(setStory('user', 'user'));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
if (process.env.NODE_ENV === "development") {
    import("eruda").then(({ default: eruda }) => { }); //runtime download
}