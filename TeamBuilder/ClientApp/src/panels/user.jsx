import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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
import { goBack, setPage } from '../store/router/actions';
import { setUser } from '../store/user/actions';

class User extends React.Component {
    constructor(props) {
        super(props);

        console.log('user constructor', props.user);

        this.state = {
            skills: null,
            userSkills: null,
            vkUser: null,
            vkProfile: props.profile,
            user: props.user,
            activeTabProfile: 'main',
            selected: false,
            selectedSkills: null,
            isConfirmed: false,
            goUserEdit: props.goUserEdit,
            goSetUserTeam: props.goSetUserTeam,
            readOnlyMode: props.activeStory != 'user',
            recruitTeams: []
        }

        this.confirmUser = this.confirmUser.bind(this);

    }

    componentDidMount() {
        this.fetchVkUser();
        this.isUserConfirmed(this.state.user.id);
    }

    isUserConfirmed(id) {
        console.log('into isUserConfirmed');
        fetch(`/api/user/checkconfirmation?id=${id}`)
            .then((response) => {
                this.setState({ isConfirmed: response })

                var vkProfileId = this.state.vkProfile.id;
                console.log('before user fetch', id);
                console.log('profileId = ', vkProfileId);

                fetch(`/api/user/get/?id=${id}`)
                    .then(response => response.json())
                    .then(data => this.setState({ user: data }));

                fetch(`/api/user/getRecruitTeams?vkProfileId=${vkProfileId}&&id=${id}`)
                    .then(response => response.json())
                    .then(data => this.setState({ recruitTeams: data }));
            } 
        );

    }

    async fetchVkUser() {
        const t = await bridge.send("VKWebAppGetAuthToken",
            { "app_id": 7448436, "scope": "" });

        let params = {
            user_id: this.state.user.id,
            fields: 'city,photo_200,contacts',
            v: '5.103',
            access_token: t.access_token
        };

        const request = await bridge.send("VKWebAppCallAPIMethod", { "method": "users.get", "request_id": "32test", "params": params });
        console.log('fetched vk user -----------------', request.response[0].first_name);
        this.setState({ vkUser: request.response[0] });
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

        const { setPage, setUser } = this.props;
        console.log('lalalalalalalalalalalalalalalalalalalalalalalalala');

        return (
            <Panel id="user">
                <PanelHeader separator={false} left={this.state.readOnlyMode &&
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
                            <List>
                                {!this.state.readOnlyMode && <Cell asideContent=
                                    {
                                    <Icon24Write onClick={() => setPage('user', 'userEdit')}
                                            data-to='userEdit'
                                            data-id={this.state.vkProfile && this.state.vkProfile.id}
                                            data-user={JSON.stringify(this.state.user)} />
                                    }>
                                </Cell>}
                                <Cell before={<Icon28PhoneOutline />}>
                                    тел.:
                                </Cell>
                                <Cell before={<Icon28ArticleOutline />}>
                                    дополнительно: {this.state.user && this.state.user.about}
                                </Cell>
                            </List>
                            <UserSkills userSkills={this.state.userSkills} readOnlyMode={this.state.readOnlyMode}
                                handleClick={this.handleClick.bind(this, this.state.selectedSkills)}
                                id={this.state.user.id} />
                        </Group> :
                        <Group>
                            <UserTeams userTeams={this.state.user && this.state.user.userTeams}
                                goUserEdit={this.state.goUserEdit} readOnlyMode={this.state.readOnlyMode} />
                        </Group>
                }
                <Div>
                    <Checkbox disabled={this.state.readOnlyMode} onChange={(e) => this.handleCheckboxClick(e)}
                        checked={this.state.user && this.state.user.isSearchable ? 'checked' : ''}>в поиске команды</Checkbox>
                    {this.state.user && !this.state.readOnlyMode && <Button mode={this.state.isConfirmed ? "primary" : "destructive"} size='xl'
                        onClick={() => this.confirmUser(this.state.vkUser && this.state.vkUser.id, this.state.userSkills)}>
                        {this.state.isConfirmed ? "Сохранить" : "Подтвердить"}
                    </Button>}
                </Div>
                <Div>
                    {this.state.recruitTeams && this.state.recruitTeams.length > 0 && < Button mode="primary" size='xl'
                        onClick={this.state.goSetUserTeam}
                        data-to='setUserTeam'
                        data-user={JSON.stringify(this.state.user)}
                        data-id={this.state.user.id}
                        recruitTeams={this.state.recruitTeams}
                        >
                        Завербовать
                    </Button>}
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

const mapDispatchToProps = {
    setPage,
    setUser,
    goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(User);