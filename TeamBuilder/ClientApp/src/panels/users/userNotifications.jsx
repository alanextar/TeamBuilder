import { Separator, Button, Cell, Group, List, Placeholder, RichCell, PanelSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import React from 'react';
import { connect } from 'react-redux';
import { goToPage } from '../../store/router/actions';

const mockNotification = [
	{ id: -1, message: "Вас добавили туда" },
	{ id: -2, message: "Вас исключили отсюда" },
	{ id: -3, message: "В вашу команду поступил запрос" },
	{ id: -4, message: "Из вашей команды вышел юзер" }
]


//TODO уведомления хранить в storage браузера
class UserNotifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	clickHandler = () => {
		this.props.hubConnection
			.invoke('SendNotify')
			.catch(error => console.log(`Error while invoke hum method :(. Details: ${error}`))
	}

	render() {
		var notifications = this.props.notifications || mockNotification;

		return (
			<List>
				<Button key={0} onClick={() => this.clickHandler()}>ОТПРАВИТЬ!</Button>
				{notifications.map(item => (
					<React.Fragment key={item.id}>
						<Cell description={item.dateTime || null}>
							{item.message}
						</Cell>
						<Separator style={{ margin: '5px 0' }} />
					</React.Fragment>
				))}
			</List>
		);
	}

}

const mapStateToProps = (state) => {

	return {
		notifications: state.notice.notifications,
		hubConnection: state.notice.hubConnection
	};
};

const mapDispatchToProps = {
	goToPage
}

export default connect(mapStateToProps, mapDispatchToProps)(UserNotifications);
