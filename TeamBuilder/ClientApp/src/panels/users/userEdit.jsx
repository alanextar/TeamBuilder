import React from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { goBack } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";
import { setProfileUser } from "../../store/user/actions";

import {
	Panel,
	PanelHeader,
	Group,
	Cell,
	Avatar,
	Button,
	Div,
	Input,
	Title,
	FormLayoutGroup,
	Textarea,
	Separator,
	FormLayout,
	PanelHeaderBack,
	Switch,
} from "@vkontakte/vkui";
import CreatableMulti from "../components/CreatableMulti";
import { ValidInput } from "../components/ValidInput";
import "@vkontakte/vkui/dist/vkui.css";

import { Api } from "../../infrastructure/api";
import * as Utils from "../../infrastructure/utils";
import { longOperationWrapper } from "../../services/_functions";
import * as Validation from "../../helpers/validation";

class UserEdit extends React.Component {
	constructor(props) {
		super(props);

		this.bindingId = `profile`;
		this.state = {
			inputData: props.inputData[this.bindingId],
			allSkills: [],
			errors: {},
		};

		this.cancelForm = () => {
			this.setState({
				inputData: null,
			});
			goBack();
		};

		const { goBack } = this.props;
	}

	componentDidMount() {
		this.state.inputData || this.fetchUser();
		this.populateSkills();
	}

	componentDidUpdate(prevProps) {
		console.log("componentDidUpdate");
		if (this.props.inputData[this.bindingId] !== prevProps.inputData[this.bindingId]) {
			this.setState({ inputData: this.props.inputData[this.bindingId] });
		}
		if (this.props.errors !== prevProps.errors) {
			this.setState({ errors: this.props.errors });
		}
	}

	componentWillUnmount() {
		this.props.setFormData(this.bindingId, this.state.inputData);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.inputData !== null;
	}

	async postEdit(e) {
		const formData = new FormData(e.currentTarget);
		e.preventDefault();
		debugger;

		const dto = {};
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
			dto[key] = value;
		}

		if (!this.validateForms()) {
			return;
		}

		const { setProfileUser, goBack } = this.props;

		let action = async () => {
			let editUserViewModel = {
				...dto,
				skillsIds: this.state.inputData.selectedSkills.map((s) => s.id),
			};
			delete editUserViewModel.userSkills;
			delete editUserViewModel.selectedSkills;

			let updatedUser = await Api.Users.edit(editUserViewModel);
			setProfileUser(updatedUser);
		};
		let postAction = () => goBack();

		await longOperationWrapper({ action, postAction });
	}

	validateForms() {
		this.setState({ errors: null });
		let errors = {};
		errors = {
			...Validation.validateEmail(this.state.inputData.email),
			...Validation.validatePhoneNumber(this.state.inputData.mobile),
			...Validation.validateTelegram(this.state.inputData.telegram),
		};

		this.setState({ errors: errors });

		return Utils.isEmpty(errors);
	}

	handleInput(e) {
		let value = e.currentTarget.value;
		let name = e.currentTarget.name;
		if (name == "about") {
			if (500 - value.length < 0) return;
		}

		if (e.currentTarget.type === "checkbox") {
			value = e.currentTarget.checked;
		}

		this.setState({
			inputData: {
				...this.state.inputData,
				[name]: value,
			},
		});
	}

	fetchUser() {
		Api.Users.get(this.props.profile.id)
			.then((user) => {
				this.setState({
					inputData: {
						...user,
						selectedSkills: Utils.convertUserSkills(user?.userSkills),
					},
				});
			})
			.catch((error) => {});
	}

	populateSkills() {
		Api.Skills.getAll().then((allSkillsJson) => this.setState({ allSkills: Utils.convertSkills(allSkillsJson) }));
	}

	handleInputSkills = (newValue, actionMeta) => {
		this.setState({
			inputData: {
				...this.state.inputData,
				selectedSkills: newValue,
			},
		});
	};

	getOrEmpty = (name) => {
		return this.state.inputData && this.state.inputData[name] ? this.state.inputData[name] : "";
	};

	render() {
		return (
			<Panel id={this.props.id}>
				<PanelHeader left={<PanelHeaderBack onClick={() => this.cancelForm()} />}>Профиль</PanelHeader>
				{this.props.profile && (
					<Group title="VK Connect">
						<Cell
							description={this.props.profile.city && this.props.profile.city.title ? this.props.profile.city.title : ""}
							before={this.props.profile.photo_200 ? <Avatar src={this.props.profile.photo_200} /> : null}
						>
							{`${this.props.profile.first_name} ${this.props.profile.last_name}`}
						</Cell>
					</Group>
				)}
				<Separator />
				<FormLayout onSubmit={(e) => this.postEdit(e)}>
					<FormLayoutGroup>
						<ValidInput
							needValidation={true}
							type={Validation.INPUT_TYPES.PHONE}
							val={this.getOrEmpty("mobile")}
							bindingId={this.bindingId}
							name="mobile"
							maxLength="10"
							placeholder="Телефон"
						></ValidInput>
						{/* <Input name="mobile" maxLength="15" value={this.getOrEmpty('mobile')} onChange={e => this.handleInput(e)} type="text" placeholder="Телефон" />
						<Div className="error" style={{ color: 'red' }}>{this.state.errors && this.state.errors["mobile"]}</Div>
						<Input name="telegram" maxLength="32" value={this.getOrEmpty('telegram')} onChange={e => this.handleInput(e)} type="text" placeholder="Telegram" />
						{this.state.errors["telegram"] && <Div className="error" style={{ color: 'red' }}>{this.state.errors["telegram"]}</Div>}
						<Input name="email" maxLength="255" value={this.getOrEmpty('email')} onChange={e => this.handleInput(e)} type="text" placeholder="Email" />
						{this.state.errors["email"] && <Div className="error" style={{ color: 'red' }}>{this.state.errors["email"]}</Div>}
						<Textarea name="about" value={this.getOrEmpty('about')} onChange={e => this.handleInput(e)} placeholder="Дополнительно" />
						<div style={{ margin: "12px", display: "flex", justifyContent: "end", fontSize: "11px", color: "var(--text_secondary)" }}>
							<span weight="regular">осталось {500 - this.getOrEmpty('about').length} символов</span>
						</div>
						<Div>
							<Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
							<CreatableMulti
								name="userSkills"
								data={this.state.allSkills}
								selectedSkills={this.getOrEmpty('selectedSkills')}
								onChange={this.handleInputSkills}
							/>
						</Div>
						<Div>
							<Cell asideContent={
								<Switch
									name="isSearchable"
									onChange={this.validateForms}
									checked={this.getOrEmpty('isSearchable')} />}>
								Ищу команду
                                    </Cell>
						</Div>*/}
						<Div style={{ display: "flex" }}>
							<Button size="l" type="submit" stretched>
								Принять
							</Button>
							<Button size="l" onClick={this.cancelForm} stretched mode="secondary">
								Отменить
							</Button>
						</Div>
					</FormLayoutGroup>
				</FormLayout>
			</Panel>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		inputData: state.formData.forms,
		activeView: state.router.activeView,
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ goBack, setProfileUser, setFormData }, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);
