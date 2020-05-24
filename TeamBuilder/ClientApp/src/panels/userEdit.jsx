import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack, setPage } from "../store/router/actions";
import * as VK from '../services/VK';

import {
    Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input,
    FormLayoutGroup, Textarea, Separator, FormLayout, Select, RichCell, PanelHeaderBack
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
        this.handleCityChange = this.handleCityChange.bind(this);
        this.postEdit = this.postEdit.bind(this);
    }

    handleAboutChange(event) {
        var user = { ...this.state.user }
        user.about = event.target.value;
        this.setState({ user });
    }

    handleCityChange(event) {
        var user = { ...this.state.user };
        user.city = event.target.value;
        this.setState({ user })
    }

    async postEdit() {
        let id = this.state.vkProfile.id;
        let city = this.state.user.city;
        let about = this.state.user.about;
        var user = { id, city, about };

        await Api.post(Urls.Users.Edit, user);
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
                        <Input value={this.state.user && this.state.user.city} onChange={this.handleCityChange} type="text" top="город" />
                        <Textarea value={this.state.user && this.state.user.about} onChange={this.handleAboutChange} top="Дополнительно" placeholder="О себе" />
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
        ...bindActionCreators({ goBack }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);