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
	{ id: 1, title: "Вас добавили туда" },
	{ id: 2, title: "Вас исключили отсюда" },
	{ id: 3, title: "В вашу команду поступил запрос" },
	{ id: 4, title: "Из вашей команды вышел юзер" }
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

			this.state.hubConnection.on("sendNotify", notify => {
				console.log('А вот и я')
				let nots = this.state.nots || [];
				nots.push(notify);
				this.setState({ nots })
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
						<Cell description={'вчера в 16:53'}>
							{item.title}
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
