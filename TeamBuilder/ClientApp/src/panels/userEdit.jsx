import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack } from "../store/router/actions";
import { setFormData } from "../store/formData/actions";
import { setUser, setProfileUser } from "../store/user/actions";

import {
    Panel, PanelHeader, Group, Cell, Avatar, Button, Div, Input,
    FormLayoutGroup, Textarea, Separator, FormLayout, PanelHeaderBack
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Api, Urls } from '../infrastructure/api';

class UserEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vkProfile: props.profile,
            user: props.user,
            inputData: props.inputData['profile_form'] ? props.inputData['profile_form'] : props.user
        }

        this.handleInput = (e) => {
            let value = e.currentTarget.value;

            if (e.currentTarget.type === 'checkbox') {
                value = e.currentTarget.checked;
            }

            this.setState({
                inputData: {
                    ...this.state.inputData,
                    [e.currentTarget.name]: value
                },
                user: {
                    ...this.state.user,
                    [e.currentTarget.name]: value
				}
            })
        }

        this.cancelForm = () => {
            this.setState({
                inputData: null
            })
            goBack();
        };

        this.postEdit = this.postEdit.bind(this);
        const { goBack } = this.props;
    }

    componentWillUnmount() {
        this.props.setFormData('profile_form', this.state.inputData);
    }

    async postEdit() {
        let updatedUser = await Api.post(Urls.Users.Edit, this.state.inputData);
        const { setProfileUser, setUser } = this.props;
        setUser(updatedUser);
        setProfileUser(updatedUser);
    }

    render() {
        const { goBack } = this.props;

        return (
            <Panel id="userEdit">
                <PanelHeader left={<PanelHeaderBack onClick={() => goBack()} />}>Профиль</PanelHeader>
                {this.state.vkProfile &&
                    <Group title="VK Connect">
                        <Cell description={this.state.vkProfile.city && this.state.vkProfile.city.title ? this.state.vkProfile.city.title : ''}
                            before={this.state.vkProfile.photo_200 ? <Avatar src={this.state.vkProfile.photo_200} /> : null}>
                            {`${this.state.vkProfile.first_name} ${this.state.vkProfile.last_name}`}
                        </Cell>
                    </Group>}
                <Separator />
                <FormLayout>
                    <FormLayoutGroup top="Редактирование">
                        <Input name="mobile" value={this.state.inputData && this.state.inputData.mobile} onChange={this.handleInput} type="text" placeholder="тел" />
                        <Input name="telegram" value={this.state.inputData && this.state.inputData.telegram} onChange={this.handleInput} type="text" placeholder="telegram" />
                        <Input name="email" value={this.state.inputData && this.state.inputData.email} onChange={this.handleInput} type="text" placeholder="email" />
                        <Textarea name="about" value={this.state.inputData && this.state.inputData.about} onChange={this.handleInput} placeholder="дополнительно" />
                    </FormLayoutGroup>
                </FormLayout>
                <Div>
                    <Button onClick={() => {
                        this.postEdit();
                        goBack()
                    }}
                        mode="commerce"
                    >
                        Принять
                     </Button>
                    <Button onClick={this.cancelForm} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.user.user,
        profile: state.user.profile,
        inputData: state.formData.forms,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ goBack, setUser, setProfileUser, setFormData }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);