import { store } from "../index";
import { goBack } from "../store/router/actions";
import { setNotifications, setConnection } from "../store/notifications/actions";
import { Api } from '../infrastructure/api';
import * as SignalR from '@aspnet/signalr';

export const initHubConnection = () => {
	let hubConnection = new SignalR.HubConnectionBuilder()
		.configureLogging(SignalR.LogLevel.Debug)
		.withUrl(`/hub/notifications`, { accessTokenFactory: () => window.location.search })
		.build();

	hubConnection.start()
		.then(() => console.log('Connection started!'))
		.catch(error => console.log(`Error while establishing connection :(. Details: ${error}`));

	hubConnection.on("notify", notice => {
		store.dispatch(setNotifications(notice));
		hubConnection.invoke('NotificationsReceived', notice.id)
			.catch(error => console.log(`Error while invoke hub method "NotificationsReceived". Details: ${error}`))
	});
	
	store.dispatch(setConnection(hubConnection));
};