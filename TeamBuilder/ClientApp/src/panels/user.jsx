import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div } from '@vkontakte/vkui';
import { Tabs, TabsItem, Separator,  Checkbox, List, Header } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import TeamSet from './userTeams'
import UserSkills from './userSkills'

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            skills: null,
            userSkills: null,
            skillIds: null,
            fetchedUser: props.fetchedUser,
            activeTabProfile: 'main',
            showMain: true,
            selected: false,
            selectedSkills: null
        }

        this.confirmUser = this.confirmUser.bind(this);
    }

    async confirmUser(vkId, skillIds) {
        
        console.log('in confirm user', skillIds);

        let response = await fetch('/user/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: { vkId, skillIds }
        });

        let result = await response.json();
    }

    handleClick(event, selectedSkills) {

        this.setState({skillIds: selectedSkills.map(function(s,i) {
            return s.id;
        })})
        //event.preventDefault();
    };

    componentDidMount() {
        console.log("user componentDidMount()");
    }

    render() {
        console.log("user render");
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
                    {
                    this.state.activeTabProfile === 'main' ?
                        <Group header={<Header mode="secondary">Информация о профиле участника</Header>}>
                            <List>
                                <Cell expandable before={<Icon20HomeOutline height={28} width={28} />}>
                                    город:
                                </Cell>
                                <Cell expandable before={<Icon28PhoneOutline />}>
                                        тел.:
                                </Cell>
                                <Cell expandable before={<Icon28ArticleOutline />}>
                                        дополнительно:
                                </Cell>
                            </List>
                            <UserSkills handleClick={this.handleClick.bind(this, this.state.selectedSkills)} id={this.state.fetchedUser && this.state.fetchedUser.id} />
                        </Group> :
                        <Group>
                            <TeamSet />
                        </Group>
                }
                <Div>
                    <Checkbox>в поиске команды</Checkbox>
                    <Button mode="destructive" size='xl' onClick={() => this.confirmUser(this.state.fetchedUser && this.state.fetchedUser.id, this.state.skillIds)}>
                        Подтвердить
                    </Button>
                </Div>
            </Panel>
        )
    }
}

export default User;