import React from 'react';
import { Api } from '../../infrastructure/api';

import { connect } from 'react-redux';
import { goBack, goToPage } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";

import {
	Panel, PanelHeader, PanelHeaderBack, SelectMimicry, Group,
	Div, Button, Textarea, FormLayout, Input, Link, Placeholder
} from '@vkontakte/vkui';

import { getActivePanel, longOperationWrapper } from "../../services/_functions";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import { isNoContentResponse } from "../../infrastructure/utils";
import * as Validation from "../../helpers/validation";
import * as Utils from '../../infrastructure/utils';

class TeamEdit extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId;
		this.bindingId = `${props.id}_${itemIdInitial}`;
		this.eventsPage = 'eventsListToTeam';

		this.state = {
			itemId: itemIdInitial,

			inputData: props.inputData[this.bindingId],
			events: [],
			errors: {}
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

			//Отчистка поиска в панели выбора события
			props.setFormData(`${this.props.activeView}_${this.eventsPage}`, null);
			props.goBack();
		};

		this.clearEvent = () => {
			this.setState({
				inputData: {
					...this.state.inputData,
					event: null,
					eventId: null
				}
			})
		};

		this.postEdit = this.postEdit.bind(this);
	}

	componentDidMount() {
		// Если есть inputData брать её, если нет - загрузить с сервера
		this.state.inputData || this.fetchTeams();
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
			.catch(error => { });
	}

	populateEventsData() {
		Api.Events.getAll()
			.then(events => this.setState({ events: events }))
			.catch(error => { });
	}

	async postEdit() {
		if (!this.state.inputData.name)
			return;

		let action = async () => await Api.Teams.edit(this.state.inputData);
		let postAction = () => this.cancelForm();
		await longOperationWrapper({ action, postAction });
	};

	validateForms() {
		this.setState({ errors: null });
		let errors = {};
		errors = {
			...Validation.validateNumberTypeInput(this.state.inputData[Validation.TEAM_CREATE.MEMBERS_COUNT]),
			...Validation.validateNotEmptyString(this.state.inputData[Validation.TEAM_CREATE.NAME])
		};

		this.setState({ errors: errors });

		return Utils.isEmpty(errors);
	}

	getOrEmpty = (name) => {
		return this.state.inputData && this.state.inputData[name] ? this.state.inputData[name] : '';
	}

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
						<FormLayout>
							<Input name={Validation.TEAM_CREATE.NAME} top="Название команды" type="text" value={inputData.name}
							onChange={this.handleInput} status={inputData.name ? 'valid' : 'error'} placeholder='Введите название команды' />
						{this.state.errors[Validation.TEAM_CREATE.NAME] && <Div className="error" style={{ color: 'red' }}>{this.state.errors[Validation.TEAM_CREATE.MEMBERS_COUNT]}</Div>}
						<Textarea top="Описание команды" name="description" value={inputData.description} onChange={this.handleInput} />
						<div style={{ margin: "12px", display: "flex", justifyContent: "end", fontSize: "11px", color: "var(--text_secondary)" }}>
							<span weight="regular">осталось {500 - this.getOrEmpty('description').length} символов</span>
						</div>
						<SelectMimicry
							top="Событие"
							placeholder="Не выбрано"
							onClick={() => goToPage(this.eventsPage, this.bindingId)}
							onChange={this.handleInput}
							name="event"
							value={inputData.event || ''}
							defaultValue
							bottom=
							{
								<div>
									<p style={{ float: 'left', margin: 0 }}>
										<Link style={{ color: '#99334b' }} onClick={this.clearEvent}>Очистить</Link>
									</p>
									<p style={{ float: 'right', margin: 0 }}>
										<Link style={{ color: 'rebeccapurple' }} onClick={() => goToPage('eventCreate')}>Создать событие</Link>
									</p>
									<div style={{ clear: 'both' }}></div>
								</div>
							}>
							{inputData.event?.name}
						</SelectMimicry>
						<Input top="Количество требуемых участников"
							name={Validation.TEAM_CREATE.MEMBERS_COUNT}
							value={String(inputData[Validation.TEAM_CREATE.MEMBERS_COUNT])}
							onChange={this.handleInput}
							type="number" />
						{this.state.errors[Validation.TEAM_CREATE.MEMBERS_COUNT] && <Div className="error" style={{ color: 'red' }}>{this.state.errors[Validation.TEAM_CREATE.MEMBERS_COUNT]}</Div>}
						<Textarea
							top="Описание участников и их задач"
							name="descriptionRequiredMembers"
							value={inputData.descriptionRequiredMembers}
							onChange={this.handleInput} />
						<div style={{ margin: "12px", display: "flex", justifyContent: "end", fontSize: "11px", color: "var(--text_secondary)" }}>
							<span weight="regular">осталось {500 - this.getOrEmpty('descriptionRequiredMembers').length} символов</span>
						</div>
					</FormLayout>}
					<Div>
						<Button
							size="xl"
							stretched
							onClick={this.postEdit}>
							Сохранить
                        </Button>
					</Div>
				</Group>
				{this.props.snackbar}
				{
					isNoContentResponse(this.props.error) &&
					<Placeholder icon={<Icon56UsersOutline />} header="Создайте мероприятие">
						И пригласите туда любого из участников в активном поиске, кто подходит вам по интересам
					</Placeholder>
				}
			</Panel>
		);
	}

};

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		inputData: state.formData.forms,
		snackbar: state.formData.snackbar,
		error: state.formData.error,
	};
};


const mapDispatchToProps = {
	goToPage,
	goBack,
	setFormData
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamEdit);