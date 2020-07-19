import React from 'react';
import { Api } from '../../infrastructure/api';

import { connect } from 'react-redux';
import { goBack, goToPage } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";

import {
	Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
	Div, Button, Textarea, FormLayout, Select, Input, Header, InfoRow, Avatar,
	RichCell, Link
} from '@vkontakte/vkui';

import { getActivePanel } from "../../services/_functions";

class TeamEdit extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId;
		this.bindingId = `teamEdit_${itemIdInitial}`;

		this.state = {
			itemId: itemIdInitial,

			inputData: props.inputData[this.bindingId],
			events: []
		};

		this.handleInput = (e) => {
			let value = e.currentTarget.value;

			if (e.currentTarget.type === 'checkbox') {
				value = e.currentTarget.checked;
			}

			this.setState({
				inputData: {
					...this.state.inputData,
					[e.currentTarget.name]: value
				}
			})
		}

		this.cancelForm = () => {
			this.setState({
				inputData: null
			})
			props.goBack();
		};
	}

	componentDidMount() {
		this.state.inputData || this.fetchTeams(); // Если есть inputData брать её, если нет - загрузить с сервера
		this.populateEventsData();
	}

	// Для того чтобы получать актуальную inputData если редактируем эту же форму на другой story
	componentDidUpdate(prevProps) {
		if (this.props.inputData[this.bindingId] !== prevProps.inputData[this.bindingId]) {
			this.setState({ inputData: this.props.inputData[this.bindingId] });
		}
	}

	componentWillUnmount() {
		const { setFormData } = this.props;
		setFormData(this.bindingId, this.state.inputData);
	}

	fetchTeams() {
		Api.Teams.get(this.state.itemId)
			.then(user => this.setState({ inputData: user }))
	}

	populateEventsData() {
		Api.Events.getAll()
			.then(events => this.setState({ events: events }));
	}

	async postEdit() {
		const { goBack } = this.props;

		if (!this.state.inputData.name)
			return;

		await Api.Teams.edit(this.state.inputData);
		goBack();
	};

	render() {
		const { goToPage } = this.props;
		var inputData = this.state.inputData;

		return (
			<Panel id={this.props.id}>
				<PanelHeader separator={false} left={<PanelHeaderBack onClick={this.cancelForm} />}>
					Редактировать
                </PanelHeader>
				<Group>
					{inputData &&
						<FormLayout >
							<Input name="name" top="Название команды" type="text" value={inputData.name}
								onChange={this.handleInput} status={inputData.name ? 'valid' : 'error'} placeholder='Введите название команды' />
							<Textarea top="Описание команды" name="description" value={inputData.description} onChange={this.handleInput} />
							<Select
								top='Выберете событие'
								placeholder="Событие"
								onChange={this.handleInput}
								name="eventId"
								value={inputData.eventId || ''}
								bottom={<Link style={{ color: 'rebeccapurple', textAlign: "right" }} onClick={() => goToPage('eventCreate')}>Создать событие</Link>}>
								{this.state.events?.map(ev => {
									return (
										<option value={ev.id} key={ev.id}>
											{ev.name}
										</option>
									)
								})}
							</Select>
							<Input top="Количество требуемых участников"
								name="numberRequiredMembers"
								value={String(inputData.numberRequiredMembers)}
								onChange={this.handleInput}
								type="number" />
							<Textarea
								top="Описание участников и их задач"
								name="descriptionRequiredMembers"
								value={inputData.descriptionRequiredMembers}
								onChange={this.handleInput} />
						</FormLayout>}
					<Div>
						<Button
							size="xl"
							stretched
							onClick={() => this.postEdit()}>
							Сохранить
                        </Button>
					</Div>
				</Group>
			</Panel>
		);
	}

};

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		inputData: state.formData.forms
	};
};


const mapDispatchToProps = {
	goToPage,
	goBack,
	setFormData
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamEdit);