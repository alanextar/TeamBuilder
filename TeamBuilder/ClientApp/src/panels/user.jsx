import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, PanelHeaderBack,
    Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell
} from '@vkontakte/vkui';
import { } from '@vkontakte/vkui';
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
import { Api, Urls } from '../infrastructure/api';
import { goBack, setPage } from '../store/router/actions';
import { setUser } from '../store/user/actions';

class User extends React.Component {
    constructor(props) {
        super(props);

        let userSkills = props.user && props.user.userSkills && props.user.userSkills.map(function (userSkill) {
            return { id: userSkill.skillId, label: userSkill.skill.name };
        })
        let selectedSkills = userSkills;

        this.state = {
            skills: null,
            vkUser: null,
            vkProfile: props.profile,
            user: props.user,
            userSkills: userSkills,
            activeTabProfile: 'main',
            selected: false,
            selectedSkills: selectedSkills,
            isConfirmed: false,
            isSearchable: props.user.isSearchable ? props.user.isSearchable : false,
            readOnlyMode: props.activeStory != 'user',
            recruitTeams: []
        }

        this.confirmUser = this.confirmUser.bind(this);

    }

    componentDidMount() {
        this.fetchVkUser();
        if (this.state.user != null && this.state.user != undefined) {
            this.isUserConfirmed(this.state.user.id);
		}
    }

    isUserConfirmed(id) {
        console.log('into isUserConfirmed');
        if (this.state.user && this.state.user.isSearchable) {
            fetch(`/api/user/getRecruitTeams?vkProfileId=${this.state.vkProfile.id}&&id=${id}`)
                .then(response => response.json())
                .then(data => this.setState({ recruitTeams: data }));
        }

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
        this.setState({ vkUser: request.response[0] });
    }

    async confirmUser(id) {
        let skillsIds = this.state.userSkills.map((s, i) => s.id);
        console.log('into confirm user', skillsIds);

        var isSearchable = this.state.user.isSearchable;
        var profileViewModel = { id, skillsIds, isSearchable };

        let saveOrConfirm = await fetch('/api/user/confirm', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileViewModel),
        });

        let user = await saveOrConfirm.json()

        console.log('updated user', user);

        this.props.setUser(user);
    }

    onSkillsChange(event, selectedSkills) {
        console.log('onSkillsChange', selectedSkills);

        this.setState({
            userSkills: selectedSkills
        })
        //event.preventDefault();
    };

    handleCheckboxClick(event) {
        if (this.state.user != null && this.state.user != undefined) {
            var user = { ...this.state.user }
            user.isSearchable = event.target.checked;
            this.setState({ user });
		}
    };

    render() {
        const { setPage, setUser, goBack } = this.props;

        return (
            <Panel id="user">
                <PanelHeader separator={false} left={this.state.readOnlyMode &&
                    <PanelHeaderBack onClick={() => goBack()} />}>Профиль</PanelHeader>
                {this.state.vkUser &&
                    <Group title="VK Connect">
                        <Cell description={this.state.vkUser.city && this.state.vkUser.city.title ? this.state.vkUser.city.title : ''}
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
                                        <Icon24Write onClick={() => setPage('user', 'userEdit')} />
                                    }>
                                </Cell>}
                                <Cell before={<Icon28PhoneOutline />}>
                                    тел.:
                                </Cell>
                                <Cell before={<Icon28ArticleOutline />}>
                                    дополнительно: {this.state.user && this.state.user.about}
                                </Cell>
                            </List>
                            <UserSkills userSkills={this.state.userSkills}
                                readOnlyMode={this.state.readOnlyMode}
                                onSkillsChange={this.onSkillsChange.bind(this, this.state.selectedSkills)}
                            />
                        </Group> :
                        <Group>
                            <UserTeams userTeams={this.state.user && this.state.user.userTeams}
                                goUserEdit={this.state.goUserEdit} readOnlyMode={this.state.readOnlyMode} />
                        </Group>
                }
                <Div>
                    <Checkbox disabled={this.state.readOnlyMode} onChange={(e) => this.handleCheckboxClick(e)}
                        checked={this.state.user && this.state.user.isSearchable ? 'checked' : ''}>в поиске команды</Checkbox>
                    {!this.state.readOnlyMode && <Button mode={this.state.user ? "primary" : "destructive"} size='xl'
                        onClick={() => this.confirmUser(this.state.user && this.state.user.id, this.state.user.userSkills)}>
                        {this.state.user ? "Сохранить" : "Подтвердить"}
                    </Button>}
                </Div>
                <Div>
                    {this.state.recruitTeams && this.state.recruitTeams.length > 0 && < Button mode="primary" size='xl'
                        onClick={() => setPage('teams', 'setUserTeam')}
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
