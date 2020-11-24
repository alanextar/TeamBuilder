import { store } from "../index";
import { goBack } from "../store/router/actions";
import { setNotifications, setConnection, setErrorMessage } from "../store/notifications/actions";
import { Api } from '../infrastructure/api';
import * as SignalR from '@aspnet/signalr';

export const initHubConnection = () => {
	let hubConnection = new SignalR.HubConnectionBuilder()
		.configureLogging(SignalR.LogLevel.Debug)
		.withUrl(`/hub/notifications`, { accessTokenFactory: () => window.location.search })
		// .withAutomaticReconnect()
		.build();

	hubConnection.start()
		.then(() => console.log('Connection started!'))
		.catch(error => console.log(`Error while establishing connection :(. Details: ${error}`));

	hubConnection.on("notify", notices => {
		store.dispatch(setNotifications(notices));
		hubConnection.invoke('NotificationsReceived', notices.map(n => n.id))
			.catch(error => console.log(`Error while invoke hub method "NotificationsReceived". Details: ${error}`))
	});

	// hubConnection.onreconnecting(error => {
	// 	console.log(`Connection lost due to error "${error}". Reconnecting.`)
	// 	store.dispatch(setErrorMessage("Проблемы с соединением. Переподключаемся..."));
	// });

	// hubConnection.onreconnected(connectionId => {
	// 	console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`)
	// 	store.dispatch(setErrorMessage(null));
	// });

	hubConnection.onclose(error => {
		console.log(`Connection closed due to error "${error}". Try refreshing this page to restart the connection.`)
		store.dispatch(setErrorMessage(`Соединение потеряно. Пожалуйста обновите страницу`));
	});

	store.dispatch(setConnection(hubConnection));
};