import React from 'react';
import { connect } from 'react-redux';
import { setPage } from "../../store/router/actions";
import { setTeamsEventFilter } from "../../store/events/actions";

import {
	ModalRoot, ModalPage, ModalPageHeader, PanelHeaderButton, FormLayout, SelectMimicry
} from '@vkontakte/vkui';

class TeamFilters extends React.Component {
	constructor(props) {
		super(props);
	}

	reset = () => {
		this.props.setTeamsEventFilter(null);
		this.hideModal();
	}
	
	chooseEvent = () => {
		this.props.setPage('teams', 'eventsFilter');
		this.hideModal();
	}

	hideModal = () => {
		this.props.setActiveModal(null);
	}

	render() {
		return (
			<ModalRoot activeModal={this.props.activeModal}>
				<ModalPage
					id="filters"
					onClose={() => this.hideModal()}
					header={
						<ModalPageHeader
							left={<PanelHeaderButton onClick={() => this.reset()}>Сбросить</PanelHeaderButton>}
							right={<PanelHeaderButton onClick={() => this.hideModal()}>Готово</PanelHeaderButton>}>
							Фильтры
							</ModalPageHeader>
					}>
					{!this.props.eventsIsEmpty &&
						<FormLayout>
							<SelectMimicry top="События" placeholder="Не выбрано"
								onClick={() => this.chooseEvent()}>
								{this.props.teamsEventFilter && this.props.teamsEventFilter.name}
							</SelectMimicry>
						</FormLayout>}
				</ModalPage>
			</ModalRoot>
		);
	}

};

const mapStateToProps = (state) => {
	return {
		teamsEventFilter: state.event.teamsEventFilter
	};
};

const mapDispatchToProps = {
	setPage,
	setTeamsEventFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamFilters);
