import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input } from '@vkontakte/vkui';
import { Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import TeamSet from './userTeams'
import UserSkills from './userSkills'

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            skills: null,
            userSkills: null,
            fetchedUser: props.fetchedUser,
            activeTabProfile: 'main',
            selected: false,
            selectedSkills: null,
            isConfirmed: false,
            goUserEdit: props.goUserEdit
        }

        this.confirmUser = this.confirmUser.bind(this);
    }

    componentDidMount() {
        this.isUserConfirmed(this.state.fetchedUser.id);
    }

    isUserConfirmed(vkId) {
        fetch(`/user/checkconfirmation?vkId=${vkId}`)
            .then((response) => /*console.log('confirmation status ', response)*/
                this.setState({ isConfirmed: response })
            );
	}

    async confirmUser(vkId, userSkills) {

        var skillsIds = userSkills.map((s, i) => s.id);
        var userDto = { vkId, skillsIds };

        let response = await fetch('/user/confirm', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDto),
        });

        this.setState({ isConfirmed: true });
    }

    handleClick(event, selectedSkills) {
        console.log(selectedSkills);
        this.setState({
            userSkills: selectedSkills
        })
        //event.preventDefault();
    };

    render() {
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
                                <Cell before={<Icon20HomeOutline height={28} width={28} />}
                                    asideContent={
                                        <Icon24Write onClick={this.state.goUserEdit} data-to='userEdit'
                                            data-id={this.state.fetchedUser && this.state.fetchedUser.vkId} />
                                    }>
                                </Cell>
                                <Cell before={<Icon20HomeOutline height={28} width={28} />}>
                                    город: <Input type="text" defaultValue="Екатеринбург" />
                                </Cell>
                                <Cell before={<Icon28PhoneOutline />}>
                                    тел.:
                                </Cell>
                                <Cell before={<Icon28ArticleOutline />}>
                                    дополнительно:
                                </Cell>
                            </List>
                            <UserSkills userSkills={this.state.userSkills}
                                handleClick={this.handleClick.bind(this, this.state.selectedSkills)}
                                id={this.state.fetchedUser && this.state.fetchedUser.id} />
                        </Group> :
                        <Group>
                            <TeamSet />
                        </Group>
                }
                <Div>
                    <Checkbox>в поиске команды</Checkbox>
                    <Button mode={this.state.isConfirmed ? "primary" : "destructive"} size='xl'
                        onClick={() => this.confirmUser(this.state.fetchedUser && this.state.fetchedUser.id, this.state.userSkills)}>
                        {this.state.isConfirmed ? "Сохранить" : "Подтвердить"}
                    </Button>
                </Div>
            </Panel>
        )
    }
}

export default User;