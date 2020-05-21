import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, PanelHeaderBack,
    Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell
} from '@vkontakte/vkui';
import {  } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import UserTeams from './userTeams'
import UserSkills from './userSkills'
import bridge from '@vkontakte/vk-bridge';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            skills: null,
            userSkills: null,
             //TO-DO получить юзера из апи вконтакте
            vkUser: props.vkUser,
            user: props.user,
            activeTabProfile: 'main',
            selected: false,
            selectedSkills: null,
            isConfirmed: false,
            goUserEdit: props.goUserEdit,
            goSetUserTeam: props.goSetUserTeam,
            isProfile: props.activeStory != 'user',
            recruitTeams: []
        }

        this.confirmUser = this.confirmUser.bind(this);

    }

    componentDidMount() {
        useEffect(() => {
            async function fetchData() {
                const user = await bridge.send("VKWebAppCallAPIMethod", {
                    "method": "users.get", "request_id": "32test", "params":
                        { "user_ids": "1", "v": "5.103", "access_token": "your_token" }
                });
                console.log(user);
            }
            fetchData();
        }, []);

        this.isUserConfirmed(this.state.vkUser.id);
    }

    isUserConfirmed(id) {
        console.log('into isUserConfirmed');
        fetch(`/api/user/checkconfirmation?id=${id}`)
            .then((response) => {
                this.setState({ isConfirmed: response })

                console.log('before user fetch', id);
                var fetchedUserId = this.state.vkUser.id;
                var fetchedProfileId = this.state.user.id;
                console.log('profileId = ', fetchedProfileId);

                this.state.isProfile && fetch(`/api/user/get?fetchedProfileId=${fetchedProfileId}&&fetchedUserId=${fetchedUserId}`)
                    .then(response => response.json())
                    .then(data => this.setState({ user: data }));

                this.state.isProfile && fetch(`/api/user/getRecruitTeams?fetchedProfileId=${fetchedProfileId}&&fetchedUserId=${fetchedUserId}`)
                    .then(response => response.json())
                    .then(data => this.setState({ recruitTeams: data }));
            } 
        );

	}

    async confirmUser(id) {
        console.log('into confirm user', this.state.user.isSearchable);
        let skillsIds;

        if (this.state.userSkills == null) {
            skillsIds = this.state.user.userSkills.map((s, i) => s.skillId);
        }
		else {
            skillsIds = this.state.userSkills.map((s, i) => s.id);
        }

        var isSearchable = this.state.user.isSearchable;
        var profileViewModel = { id, skillsIds, isSearchable };

        let response = await fetch('/api/user/confirm', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileViewModel),
        });

        this.setState({ isConfirmed: true });
    }

    handleClick(event, selectedSkills) {
        this.setState({
            userSkills: selectedSkills
        })
        //event.preventDefault();
    };

    handleCheckboxClick(event) {
        console.log('checkbox clicked value', event.target.checked);
        var user = { ...this.state.user }
        user.isSearchable = event.target.checked;
        this.setState({ user });
    };

    render() {
        //console.log('render user readOnlyMode', this.props.activeStory != 'user');
        return (
            <Panel id="user">
                <PanelHeader separator={false} left={this.state.isProfile &&
                    <PanelHeaderBack onClick={this.state.goUserEdit}
                    data-to={this.props.return} />}>Профиль</PanelHeader>
                {this.state.vkUser &&
                    <Group title="VK Connect">
                        <Cell description={ this.state.vkUser.city && this.state.vkUser.city.title ? this.state.vkUser.city.title : ''}
                            before={this.state.vkUser.photo_200 ? <Avatar src={this.state.vkUser.photo_200} /> : null}>
                            {`${this.state.vkUser.first_name} ${this.state.vkUser.last_name}`}
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
                            {/* <List>
                                {!this.state.readOnlyMode && <Cell asideContent=
                                    {
                                        <Icon24Write onClick={this.state.goUserEdit}
                                            data-to='userEdit'
                                            data-id={this.state.vkProfile && this.state.vkProfile.id}
                                            data-user={JSON.stringify(this.state.user)} />
                                    }>
                                </Cell>}
                                <Cell before={<Icon20HomeOutline height={28} width={28} />}>
                                    город: {this.state.user && this.state.user.city}
                                </Cell>
                                <Cell before={<Icon28PhoneOutline />}>
                                    тел.:
                                </Cell>
                                <Cell before={<Icon28ArticleOutline />}>
                                    дополнительно: {this.state.user && this.state.user.about}
                                </Cell>
                            </List> */}
                            <UserSkills userSkills={this.state.userSkills} readOnlyMode={this.state.isProfile}
                                handleClick={this.handleClick.bind(this, this.state.selectedSkills)}
                                id={this.state.vkUser && this.state.vkUser.id} />
                        </Group> :
                        <Group>
                            <UserTeams userTeams={this.state.user && this.state.user.userTeams}
                                goUserEdit={this.state.goUserEdit} readOnlyMode={this.state.isProfile} />
                        </Group>
                }
                <Div>
                    <Checkbox disabled={this.state.isProfile} onChange={(e) => this.handleCheckboxClick(e)}
                        checked={this.state.user && this.state.user.isSearchable ? 'checked' : ''}>в поиске команды</Checkbox>
                    {!this.state.isProfile && <Button mode={this.state.isConfirmed ? "primary" : "destructive"} size='xl'
                        onClick={() => this.confirmUser(this.state.vkUser && this.state.vkUser.id, this.state.userSkills)}>
                        {this.state.isConfirmed ? "Сохранить" : "Подтвердить"}
                    </Button>}
                </Div>
                <Div>
                    {this.state.recruitTeams.length && < Button mode="primary" size='xl'
                        onClick={this.state.goSetUserTeam}
                        data-to='setUserTeam'
                        data-user={JSON.stringify(this.state.user)}
                        recruitTeams={this.state.recruitTeams}
                        >
                        Завербовать
                    </Button>}
                </Div>
            </Panel>
        )
    }
}

export default User;