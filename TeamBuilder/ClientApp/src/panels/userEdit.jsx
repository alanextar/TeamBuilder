import React from 'react';
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
            goUserEdit: props.goUserEdit,
            fetchedUser: props.fetchedUser,
            //about: props.user.about,
            //city: props.user.city,
            about: props.about,
            city: props.city,
            user: props.user
        }

        this.handleAboutChange = this.handleAboutChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.postEdit = this.postEdit.bind(this);
    }

    handleAboutChange(event) {
        this.setState({ about: event.target.value });
    }

    handleCityChange(event) {
        this.setState({ city: event.target.value });
    }

    async postEdit() {
        //console.log('city ', this.state.user.city);
        //let city = this.state.city;
        //let vkId = this.state.fetchedUser.id;
        let vkId = this.state.fetchedUser.id;
        let city = this.state.city;
        let about = this.state.about;
        var user = { vkId, city, about };

        let response = await fetch('/user/edit', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

    }

    render() {
        console.log(this.state.fetchedUser);
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
                        <Input value={this.state.city} onChange={this.handleCityChange} type="text" top="город" />
                        <Textarea value={this.state.about} onChange={this.handleAboutChange} top="Дополнительно" placeholder="О себе" />
                    </FormLayoutGroup>
                </FormLayout>
                <Div>
                    <Button onClick={(e) => { this.postEdit(); this.state.goUserEdit(e) }} data-to='user' data-id={this.state.fetchedUser.id} mode="commerce">Принять</Button>
                    <Button onClick={this.state.goUserEdit} data-to='user' data-id={this.state.fetchedUser.id} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

export default UserEdit;