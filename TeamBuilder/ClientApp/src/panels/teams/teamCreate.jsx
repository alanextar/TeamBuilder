import React from 'react';

import { connect } from 'react-redux';
import { goBack, goToPage } from "../../store/router/actions";
import { setActiveTab } from "../../store/vk/actions";
import { setFormData } from "../../store/formData/actions";

import {
	Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
	Div, Button, Textarea, FormLayout, Select, Input, Link
} from '@vkontakte/vkui';
import { Api } from '../../infrastructure/api';
import { GetRandomPicUrl as GetRandomPic } from '../../infrastructure/utils';

class TeamCreate extends React.Component {
	constructor(props) {
		super(props);

		this.bindingId = props.id;
		this.defaultActiveTab = 'teamDescription';
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
			activeTab: props.activeTab[this.bindingId] || this.defaultActiveTab,
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

		this.cancelForm = () => {
			this.cleanFormData();
			props.goBack();
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
		if (this.props.activeTab[this.bindingId] !== prevProps.activeTab[this.bindingId]) {
			this.setState({
				activeTab: this.props.activeTab[this.bindingId] || this.defaultActiveTab
			});
		}
	}

	componentWillUnmount() {
		const { setActiveTab, setFormData } = this.props;
		setActiveTab(this.bindingId, this.state.activeTab);
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
		this.cleanFormData();
		this.props.goToPage('teamInfo', result.id, true);
	}

	cleanFormData() {
		this.setState({
			inputData: this.defaultInputData,
			activeTab: this.defaultActiveTab
		});
	}

	render() {
		const { goToPage } = this.props;
		var inputData = this.state.inputData;

		return (
			<Panel id={this.state.id}>
				<PanelHeader separator={false} left={<PanelHeaderBack onClick={this.cancelForm} />}>
					Создание
				</PanelHeader>
				<Tabs>
					<TabsItem
						onClick={() => this.setState({ activeTab: 'teamDescription' })}
						selected={this.state.activeTab === 'teamDescription'}>
						Описание
					</TabsItem>
					<TabsItem
						onClick={() => this.setState({ activeTab: 'teamUsers' })}
						selected={this.state.activeTab === 'teamUsers'}>
						Участники
					</TabsItem>
				</Tabs>
				<Group>
					{this.state.activeTab === 'teamDescription' ?
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
							<Select
								top="Выберете событие"
								placeholder="Событие"
								onChange={this.handleInput}
								value={inputData?.eventId}
								name="eventId"
								bottom={<Link style={{ color: 'rebeccapurple', textAlign: "right" }} onClick={() => goToPage('eventCreate')}>Создать событие</Link>}>
								{this.state.events?.map(ev => {
									return (
										<option value={ev.id} key={ev.id}>
											{ev.name}
										</option>
									)
								})}
							</Select>
						</FormLayout>
						:
						<FormLayout>
							<Input top="Количество участников" type="number" placeholder="Введите количество участников"
								onChange={this.handleInput}
								name="numberRequiredMembers"
								value={inputData?.numberRequiredMembers} />
							<Textarea top="Описание участников и их задач" type="text" placeholder="Опишите какие роли в команде вам нужны"
								onChange={this.handleInput}
								name="descriptionRequiredMembers"
								value={inputData?.descriptionRequiredMembers} />
						</FormLayout>}
					<Div>
						<Button
							stretched={true}
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
		activeTab: state.vkui.activeTab,
		inputData: state.formData.forms,
		profileUser: state.user.profileUser
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack,
	setActiveTab,
	setFormData
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamCreate);