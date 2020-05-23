import React from 'react';
import ReactDOM from 'react-dom';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, FormLayoutGroup, Textarea,
    Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class UserEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goUserEdit: props.goUserEdit,
            vkProfile: props.vkProfile,
            user: props.user
        }

        this.handleAboutChange = this.handleAboutChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.postEdit = this.postEdit.bind(this);
    }

    handleAboutChange(event) {
        console.log('original', this.state.user);
        var user = { ...this.state.user }
        console.log('spread ', user);
        user.about = event.target.value;
        this.setState({ user });
    }

    handleCityChange(event) {
        this.setState({ city: event.target.value });
        var user = { ...this.state.user }
        user.city = event.target.value;
        this.setState({ user })
    }

    async postEdit() {
        let id = this.state.vkProfile.id;
        let city = this.state.user.city;
        let about = this.state.user.about;
        var user = { id, city, about };

        let response = await fetch('/api/user/edit', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

    }

    render() {
        console.log(this.state.vkProfile);
        console.log('setUserEdit render', this.state.user);
        return (
            <Panel id="userEdit">
                <PanelHeader>Профиль</PanelHeader>
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
                    <Button onClick={(e) => { this.postEdit(); this.state.goUserEdit(e) }}
                        data-user={JSON.stringify(this.state.user)} data-to='user'
                        data-id={this.state.vkProfile.id} mode="commerce">Принять</Button>
                    <Button onClick={this.state.goUserEdit} data-to='user'
                        data-user={JSON.stringify(this.state.user)}
                        data-id={this.state.vkProfile.id} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

export default UserEdit;