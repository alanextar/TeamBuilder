import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack, setPage } from "../store/router/actions";
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
            user: props.user
        }

        this.handleAboutChange = this.handleAboutChange.bind(this);
        this.handleMobileChange = this.handleMobileChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleTelegramChange = this.handleTelegramChange.bind(this);
        this.postEdit = this.postEdit.bind(this);
    }

    handleAboutChange(event) {
        var user = { ...this.state.user }
        user.about = event.target.value;
        this.setState({ user });
    }
    handleEmailChange(event) {
        var user = { ...this.state.user };
        user.email = event.target.value;
        this.setState({ user })
    }
    handleMobileChange(event) {
        var user = { ...this.state.user };
        user.mobile = event.target.value;
        this.setState({ user })
    }
    handleTelegramChange(event) {
        var user = { ...this.state.user };
        user.telegram = event.target.value;
        this.setState({ user })
    }

    async postEdit() {
        const { setUser, setProfileUser } = this.props;
        let id = this.state.vkProfile.id;
        let mobile = this.state.user.mobile;
        let email = this.state.user.email;
        let about = this.state.user.about;
        let telegram = this.state.user.telegram;
        var user = { id, email, about, mobile, telegram };

        let updatedUser = await Api.post(Urls.Users.Edit, user);

        setUser(updatedUser);
        setProfileUser(updatedUser);
    }

    render() {

        const { id, goBack, setPage } = this.props;

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
                        <Input value={this.state.user && this.state.user.mobile} onChange={this.handleMobileChange} type="text" top="телефон" placeholder="тел" />
                        <Input value={this.state.user && this.state.user.telegram} onChange={this.handleTelegramChange} type="text" top="telegram" placeholder="telegram" />
                        <Input value={this.state.user && this.state.user.email} onChange={this.handleEmailChange} type="text" top="почта" placeholder="email" />
                        <Textarea value={this.state.user && this.state.user.about} onChange={this.handleAboutChange} top="Дополнительно" placeholder="дополнительно" />
                    </FormLayoutGroup>
                </FormLayout>
                <Div>
                    <Button onClick={() => {
                        this.state.vkProfile && this.postEdit();
                        goBack()
                    }}
                        mode="commerce"
                    >
                        Принять
                     </Button>
                    <Button onClick={() => goBack()} mode="destructive">Отменить</Button>
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
        setPage,
        dispatch,
        ...bindActionCreators({ goBack, setUser, setProfileUser }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);