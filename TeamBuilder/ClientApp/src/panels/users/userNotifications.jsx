import { Separator, SimpleCell, Cell, List, Placeholder, RichCell, Avatar } from '@vkontakte/vkui';
import Icon16Add from '@vkontakte/icons/dist/16/add';
import '@vkontakte/vkui/dist/vkui.css';
import React from 'react';
import { connect } from 'react-redux';
import { setAsRead } from '../../store/notifications/actions';

class UserNotifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	componentDidMount() {
		this.markAsRead();
	}

	markAsRead = () => {
		const { setAsRead } = this.props;
		let newNoticeIds = this.props.notifications
			.filter(n => n.isNew === true)
			.map(n => n.id);

		if (newNoticeIds.length !== 0) {
			setAsRead(newNoticeIds);
			this.props.hubConnection
				.invoke('NoticesWasRead', newNoticeIds)
				.catch(error => console.log(`Error while invoke hum method :(. Details: ${error}`));
		}
	}

	render() {
		return (
			<List>
				{this.props.notifications
					?.sort((a, b) => new Date(b.dateTimeNotify) - new Date(a.dateTimeNotify))
					.map(notice => (
						<React.Fragment key={notice.id}>
							<SimpleCell
								before={<Avatar style={{ background: 'var(--accent)' }} size={28} shadow={false} src={notice.imageUrl} />}
								description={new Date(notice.dateTimeNotify).toLocaleString()}
								multiline>
								{notice.renderedMessage}
							</SimpleCell>
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
	setAsRead
}

export default connect(mapStateToProps, mapDispatchToProps)(UserNotifications);
