import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import qwest from 'qwest';

import bridge from '@vkontakte/vk-bridge';

import App from './App'
import reducer from './reducers/reducer'
import * as types from './constants/ActionTypes'

const store = createStore(reducer)

store.dispatch({
    type: types.SET_STATE,
    state: {
        phones: ["iPhone 7 Plus", "Samsung Galaxy A5"]
    }
});

bridge.send("VKWebAppInit", {});

qwest.setDefaultOptions({
    headers: {
        'Launch-Params': window.location.search
    }
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
if (process.env.NODE_ENV === "development") {
    import("eruda").then(({ default: eruda }) => { }); //runtime download
}