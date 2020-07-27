import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import { Separator, Button, Cell, Group, List, Placeholder, RichCell, PanelSpinner } from '@vkontakte/vkui';
import * as Alerts from "../components/Alerts.js";
import '@vkontakte/vkui/dist/vkui.css';
import React from 'react';
import { connect } from 'react-redux';
import { Api } from '../../infrastructure/api';
import { countMyActiveTeams, countForeignActiveTeams } from '../../infrastructure/utils';
import { longOperationWrapper } from "../../services/_functions";
import { goToPage } from '../../store/router/actions';
import * as SignalR from '@aspnet/signalr'

const mockNotification = [
	{ id: -1, message: "Вас добавили туда" },
	{ id: -2, message: "Вас исключили отсюда" },
	{ id: -3, message: "В вашу команду поступил запрос" },
	{ id: -4, message: "Из вашей команды вышел юзер" }
]

class UserNotifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			nots: mockNotification || [],
			hubConnection: null
		}
	}

	componentDidMount = () => {
		const hubConnection = new SignalR.HubConnectionBuilder()
			.configureLogging(SignalR.LogLevel.Debug)
			.withUrl(`/hub/notifications`, { accessTokenFactory: () => 252814030 })
			.build();

		this.setState({ hubConnection }, () => {
			this.state.hubConnection
				.start()
				.then(() => console.log('Connection started!'))
				.catch(error => console.log(`Error while establishing connection :(. Details: ${error}`));

			this.state.hubConnection.on("notify", notice => {
				console.log('А вот и я')
				let noticesTemp = this.state.nots || [];

				noticesTemp.push(notice)
				this.setState({ nots: noticesTemp })
				this.state.hubConnection
					.invoke('NotificationsReceived', notice.id)
					.catch(error => console.log(`Error while invoke hub method "NotificationsReceived". Details: ${error}`))
			})
		});
	}

	clickHandler = () => {
		this.state.hubConnection
			.invoke('SendNotify')
			.catch(error => console.log(`Error while invoke hum method :(. Details: ${error}`))
	}

	render() {
		return (
			<List>
				<Button key={0} onClick={() => this.clickHandler()}>ОТПРАВИТЬ!</Button>
				{this.state.nots.map(item => (
					<React.Fragment key={item.id}>
						<Cell description={item.dateTimeNotify || null}>
							{item.message}
						</Cell>
						<Separator style={{ margin: '5px 0' }} />
					</React.Fragment>
				))}
			</List>
		);
	}

}

const mapDispatchToProps = {
	goToPage
}

export default connect(null, mapDispatchToProps)(UserNotifications);
