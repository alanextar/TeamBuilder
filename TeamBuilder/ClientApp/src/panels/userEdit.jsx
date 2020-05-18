﻿import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, FormLayoutGroup, Textarea } from '@vkontakte/vkui';
import { Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import Icon24Write from '@vkontakte/icons/dist/24/write';

class UserEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goUser: props.goUser,
            fetchedUser: props.fetchedUser,
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
        let vkId = this.state.fetchedUser.id;
        let city = this.state.user.city;
        let about = this.state.user.about;
        var user = { vkId, city, about };

        let response = await fetch('/user/edit', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

    }

    render() {
        console.log(this.state.fetchedUser);
        console.log('userEdit render', this.state.user);
        return (
            <Panel id="userEdit">
                <PanelHeader>Профиль</PanelHeader>
                {this.state.fetchedUser &&
                    <Group title="VK Connect">
                        <Cell description={this.state.fetchedUser.city && this.state.fetchedUser.city.title ? this.state.fetchedUser.city.title : ''}
                            before={this.state.fetchedUser.photo_200 ? <Avatar src={this.state.fetchedUser.photo_200} /> : null}>
                            {`${this.state.fetchedUser.first_name} ${this.state.fetchedUser.last_name}`}
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
                    <Button onClick={(e) => { this.postEdit(); this.state.goUser(e) }}
                        data-user={JSON.stringify(this.state.user)} data-to='user'
                        data-id={this.state.fetchedUser.id} mode="commerce">Принять</Button>
                    <Button onClick={this.state.goUser} data-to='user'
                        data-user={JSON.stringify(this.state.user)}
                        data-id={this.state.fetchedUser.id} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

export default UserEdit;