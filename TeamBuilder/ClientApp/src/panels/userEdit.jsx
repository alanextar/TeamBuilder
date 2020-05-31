import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack } from "../store/router/actions";
//import { setFormData } from "../store/formData/actions";
import { setUser, setProfileUser } from "../store/user/actions";

import {
    Panel, PanelHeader, Group, Cell, Avatar, Button, Div, Input,
    FormLayoutGroup, Textarea, Separator, FormLayout, PanelHeaderBack
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Api, Urls } from '../infrastructure/api';

class UserEdit extends React.Component {
    constructor(props) {
        super(props);

        let defaultInputData = {
            about: '',
            mobile: '',
            email: '',
            telegram: '',

            checkboxInSearch: 0
        };

        this.state = {
            vkProfile: props.profile,
            user: props.user || defaultInputData,
            lastSavedUser: props.user
        }

        this.handleInput = (e) => {
            let value = e.currentTarget.value;

            if (e.currentTarget.type === 'checkbox') {
                value = e.currentTarget.checked;
            }

            this.setState({
                user: {
                    ...this.state.user,
                    [e.currentTarget.name]: value
                }
            })
        }

        this.cancelForm = () => {
            setProfileUser(this.state.lastSavedUser);
            goBack();
        };

        this.postEdit = this.postEdit.bind(this);
        const { setProfileUser, goBack } = this.props;
    }

    componentWillUnmount() {
        const { setProfileUser } = this.props;
        console.log('componentWillUnmount()', this.state.user);
        setProfileUser(this.state.user);
    }

    async postEdit() {
        let updatedUser = await Api.post(Urls.Users.Edit, this.state.user);
        const { setProfileUser } = this.props;
        //setUser(updatedUser);
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
                        <Input name="mobile" value={this.state.user.mobile} onChange={this.handleInput} type="text" placeholder="тел" />
                        <Input name="telegram" value={this.state.user.telegram} onChange={this.handleInput} type="text" placeholder="telegram" />
                        <Input name="email" value={this.state.user.email} onChange={this.handleInput} type="text" placeholder="email" />
                        <Textarea name="about" value={this.state.user.about} onChange={this.handleInput} placeholder="дополнительно" />
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
        profile: state.user.profile
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ goBack, setUser, setProfileUser }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);