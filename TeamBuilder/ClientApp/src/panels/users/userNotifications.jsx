import { Separator, SimpleCell , Cell, List, Placeholder, RichCell, Avatar } from '@vkontakte/vkui';
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
				{this.props.notifications?.map(notice => (
					<React.Fragment key={notice.id}>
						<SimpleCell 
							before={<Avatar style={{ background: 'var(--accent)' }} size={28} shadow={false}><Icon16Add fill="var(--white)" /></Avatar>}
							description={notice.dateTimeNotify}
							multiline>
							{notice.renderedMessage}
							{/* Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. */}
						</SimpleCell>
						{/* <Separator style={{ margin: '5px 0' }} /> */}
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
