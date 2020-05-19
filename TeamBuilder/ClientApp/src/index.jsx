import React from 'react';
import ReactDOM from 'react-dom';
import qwest from 'qwest';

import bridge from '@vkontakte/vk-bridge';

import App from './App'

bridge.send("VKWebAppInit", {});

qwest.setDefaultOptions({
    dataType: 'json',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        'Launch-Params': window.location.search
    }
});

ReactDOM.render(<App />, document.getElementById('root'));
if (process.env.NODE_ENV === "development") {
    import("eruda").then(({ default: eruda }) => { }); //runtime download
}