import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, FormLayoutGroup } from '@vkontakte/vkui';
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
            fetchedUser: props.fetchedUser
        }

    }

    render() {
        return (
            <Panel id="userEdit">
                {/* <PanelHeader>Редактирование профиля {this.state.vkId}</PanelHeader>
                {this.state.fetchedUser &&
                    <Group title="VK Connect">
                        <Cell description={this.state.fetchedUser.city && this.state.fetchedUser.city.title ? this.state.fetchedUser.city.title : ''}
                            before={this.state.fetchedUser.photo_200 ? <Avatar src={this.state.fetchedUser.photo_200} /> : null}>
                            {`${this.state.fetchedUser.first_name} ${this.state.fetchedUser.last_name}`}
                        </Cell>
                    </Group>} */}
                <Separator />
                <FormLayout>
                    <FormLayoutGroup top="Фамилия">
                        <Input top="город" type="text" />
                        <Input top="телефон" type="text" />
                        <Input top="дополнительно" />
                    </FormLayoutGroup>
                </FormLayout>
                <Div>
                    <Button mode="commerce">Принять</Button>
                    <Button onClick={this.state.goUserEdit} data-to='user' data-id={this.state.fetchedUser.id} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

export default UserEdit;