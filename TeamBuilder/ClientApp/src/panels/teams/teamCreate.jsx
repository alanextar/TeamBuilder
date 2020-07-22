import React from 'react';

import { connect } from 'react-redux';
import { goBack, goToPage } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";

import {
	Panel, PanelHeader, PanelHeaderBack, Group,
	Div, Button, Textarea, FormLayout, SelectMimicry, Input, Link
} from '@vkontakte/vkui';
import { Api } from '../../infrastructure/api';
import { GetRandomPicUrl as GetRandomPic } from '../../infrastructure/utils';

class TeamCreate extends React.Component {
	constructor(props) {
		super(props);

		this.eventsPage = 'eventsListToTeam';
		this.bindingId = props.id;
		this.defaultInputData = {
			name: '',
			description: '',
			eventId: '',
			numberRequiredMembers: 2,
			descriptionRequiredMembers: ''
		};

		this.state = {
			events: [],
			id: props.id,
			inputData: props.inputData[this.bindingId] || this.defaultInputData
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

		this.prepareCancelForm = () => {
			this.cleanFormData();
			//Отчистка поиска в панели выбора события
			props.setFormData(`${this.props.activeView}_${this.eventsPage}`, null);
		};

		this.backClickHandler = () => {
			this.prepareCancelForm();
			props.goBack();
		};

		this.cleanFormData = () => {
			this.setState({
				inputData: this.defaultInputData
			});
		}

		this.clearEvent = () => {
			this.setState({
				inputData: {
					...this.state.inputData,
					event: null,
					eventId: null
				}
			})
		};

		this.postCreate = this.postCreate.bind(this);
	}

	componentDidMount() {
		this.getAllEvents();
	}

	// Для того чтобы получать актуальную inputData\activeTab если редактируем эту же форму на другой story
	componentDidUpdate(prevProps) {
		if (this.props.inputData[this.bindingId] !== prevProps.inputData[this.bindingId]) {
			this.setState({
				inputData: this.props.inputData[this.bindingId] || this.defaultInputData
			});
		}
	}

	componentWillUnmount() {
		const { setFormData } = this.props;
		setFormData(this.bindingId, this.state.inputData);
	}

	async getAllEvents() {
		Api.Events.getAll()
			.then(result => this.setState({ events: result }));
	}

	async postCreate() {
		if (!this.state.inputData?.name)
			return;
		let createTeamViewModel = {
			...this.state.inputData,
			imageAsDataUrl: await GetRandomPic()
		}
		let result = await Api.Teams.create(createTeamViewModel);
		this.prepareCancelForm();
		this.props.goToPage('teamInfo', result.id, true);
	}

	render() {
		const { goToPage } = this.props;
		var inputData = this.state.inputData;

		return (
			<Panel id={this.state.id}>
				<PanelHeader separator={false} left={<PanelHeaderBack onClick={this.backClickHandler} />}>
					Создание
				</PanelHeader>
				<Group>
					<FormLayout>
						<Input top="Название команды" type="text" placeholder="Введите название команды"
							onChange={this.handleInput}
							name="name"
							value={inputData?.name}
							status={inputData?.name ? 'valid' : 'error'} />
						<Textarea top="Описание команды" type="text" placeholder="Краткое описание команды"
							onChange={this.handleInput}
							name="description"
							value={inputData?.description} />
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
										<Link style={{ color: '#99334b' }} onClick={this.clearEvent}>Отчистить</Link>
									</p>
									<p style={{ float: 'right', margin: 0 }}>
										<Link style={{ color: 'rebeccapurple' }} onClick={() => goToPage('eventCreate')}>Создать событие</Link>
									</p>
									<div style={{ clear: 'both' }}></div>
								</div>
							}>
							{inputData.event?.name}
						</SelectMimicry>
						<Input top="Количество участников" type="number" placeholder="Введите количество участников"
							onChange={this.handleInput}
							name="numberRequiredMembers"
							value={inputData?.numberRequiredMembers} />
						<Textarea top="Описание участников и их задач" type="text" placeholder="Опишите какие роли в команде вам нужны"
							onChange={this.handleInput}
							name="descriptionRequiredMembers"
							value={inputData?.descriptionRequiredMembers} />
					</FormLayout>
					<Div>
						<Button
							stretched
							size='xl'
							onClick={() => this.postCreate()}>
							Создать Команду
						</Button>
					</Div>
				</Group>
			</Panel>
		);
	}

};


const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		profileUser: state.user.profileUser
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack,
	setFormData
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamCreate);