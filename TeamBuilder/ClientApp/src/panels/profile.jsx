import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Group, Cell, PanelHeaderBack, Spinner, Avatar, Search, Button, Div } from '@vkontakte/vkui';
import { Tabs, TabsItem, Separator, CellButton, FormLayout, Checkbox, Link, Select } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import bridge from '@vkontakte/vk-bridge';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Typeahead } from 'react-bootstrap-typeahead';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: props.fetchedUser,
            activeTabProfile: 'main',
            showMain: true,
            selected: false
        }
    }

    //async componentDidMount() {
    //    const user = await bridge.send('VKWebAppGetUserInfo');
    //    this.setState({ fetchedUser: user });
    //    console.log(JSON.stringify(user));
    //}

    render() {
        //console.log('--------', 1, this.state.showMain)
        return (
            <Panel id="profile">
                <PanelHeader>Профиль</PanelHeader>
                {this.state.fetchedUser &&
                    <Group title="VK Connect">
                        <Cell description={this.state.fetchedUser.city && this.state.fetchedUser.city.title ? this.state.fetchedUser.city.title : ''}
                            before={this.state.fetchedUser.photo_200 ? <Avatar src={this.state.fetchedUser.photo_200} /> : null}>
                            {`${this.state.fetchedUser.first_name} ${this.state.fetchedUser.last_name}`}
                        </Cell>
                    </Group>}
                <Separator />
                <Tabs>
                    <TabsItem
                        onClick={() => this.setState({ activeTabProfile: 'main', showMain: true })}
                        selected={this.state.activeTabProfile === 'main'}>
                        Основное
                        </TabsItem>
                    <TabsItem
                        onClick={() => this.setState({ activeTabProfile: 'teams', showMain: false })}
                        selected={this.state.activeTabProfile === 'teams'}>
                        Команды
                        </TabsItem>
                </Tabs>
                <Div className="mainContent">
                    <Div id="main" style={{ display: this.state.showMain ? 'block' : 'none' }}>
                        Информация о профиле участника
                            <Cell before={<Icon20HomeOutline height={28} width={28} />}>
                            город:
                            </Cell>
                        <Cell before={<Icon28PhoneOutline />}>
                            тел.:
                            </Cell>
                        <Cell before={<Icon28ArticleOutline />}>
                            дополнительно:
                            </Cell>
                        <FormLayout>
                            <Select top="Обычный Select" placeholder="выберите пол">
                                <option value="m">М</option>
                                <option value="f">Ж</option>
                            </Select>
                        </FormLayout>
                        <FormLayout>
                            <Div>
                                <Typeahead
                                    onChange={(selected) => {
                                        // Handle selections...
                                    }}
                                    options={[
                                        'John',
                                        'Miles',
                                        'Charles',
                                        'Herbie'
                                    ]}
                                    multiple
                                    className="Select__el skillsInput"
                                />
                            </Div>
                        </FormLayout>
                    </Div>
                    <Div style={{ display: !this.state.showMain ? 'block' : 'none' }}>�������</Div>
                    <Div className="profileBottom" >
                        <FormLayout>
                            <Checkbox>в поиске команды</Checkbox>
                        </FormLayout>
                        <Div>
                            <Button mode="destructive" size='xl'>Подтвердить</Button>
                        </Div>
                    </Div>
                </Div>
            </Panel>
        )
    }
}

export default Profile;