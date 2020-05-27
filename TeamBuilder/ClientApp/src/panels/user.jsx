import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Button, Div, PanelHeaderBack,
    Tabs, TabsItem, Separator, Checkbox, List, Header, Title, Link
} from '@vkontakte/vkui';
import { Typeahead } from 'react-bootstrap-typeahead';
import { } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28MailOutline from '@vkontakte/icons/dist/28/mail_outline';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import Icon28Send from '@vkontakte/icons/dist/28/send';
import UserTeams from './userTeams'
import bridge from '@vkontakte/vk-bridge';
import { Api, Urls } from '../infrastructure/api';
import { goBack, setPage } from '../store/router/actions';
import { setUser, setProfileUser } from '../store/user/actions';

class User extends React.Component {
    constructor(props) {
        super(props);

        let selectedSkills = props.user && props.user.userSkills && props.user.userSkills.map(function (userSkill) {
            return { id: userSkill.skillId, label: userSkill.skill.name };
        })
        let isSearchable = props.user && props.user.isSearchable;

        this.state = {
            allSkills: null,
            vkUser: null,
            vkProfile: props.profile,
            profileUser: props.profileUser,
            user: props.user,
            activeTabProfile: 'main',
            selected: false,
            selectedSkills: selectedSkills,
            isConfirmed: false,
            isSearchable: isSearchable,
            readOnlyMode: props.activeStory != 'user',
            recruitTeams: []
        }

        this.confirmUser = this.confirmUser.bind(this);

    }

    componentDidMount() {
        this.populateSkills();
        this.state.user && this.fetchVkUser();
        this.state.user && this.fetchUserData(this.state.user.id);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.user !== prevProps.user) {
            this.setState({ user: this.props.user });
        }
    }

    fetchUserData(id) {
        fetch(`/api/user/get/?id=${id}`)
            .then(response => response.json())
            .then(data => { setUser(data); this.setState({ user: data }) });

        if (this.state.profileUser && this.state.profileUser.ownerAnyTeam && this.state.user.isSearchable) {
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
        const { setUser, setProfileUser } = this.props;
        let skillsIds = this.state.selectedSkills.map((s, i) => s.id);

        var isSearchable = this.state.user.isSearchable;
        var profileViewModel = { id, skillsIds, isSearchable };

        let saveOrConfirm = await fetch('/api/user/confirm', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileViewModel),
        });

        let user = await saveOrConfirm.json()
        setUser(user);
        setProfileUser(user);
    }

    onSkillsChange(selectedSkills) {

        this.setState({
            selectedSkills: selectedSkills
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

    async populateSkills() {
        const result = await fetch('/api/skill/getall');
        const allSkillsJson = await result.json();

        var options = allSkillsJson && allSkillsJson.map(function (skill) {
            return { id: skill.id, label: skill.name };
        });

        this.setState({ allSkills: options });
    }

    render() {
        const { setPage, goBack } = this.props;

        return (
            <Panel id="user">
                <PanelHeader separator={false} left={this.state.readOnlyMode &&
                    <PanelHeaderBack onClick={() => goBack()} />}> {this.state.readOnlyMode ? 'Информация об участнике' : 'Профиль'}</PanelHeader>
                {this.state.vkUser &&
                    <Group title="VK Connect">
                    <Link href={"https://m.vk.com/id" + this.state.user.id} target="_blank">
                        <Cell description={this.state.vkUser.city && this.state.vkUser.city.title ? this.state.vkUser.city.title : ''}
                            before={this.state.vkUser.photo_200 ? <Avatar src={this.state.vkUser.photo_200} /> : null}>
                            {`${this.state.vkUser.first_name} ${this.state.vkUser.last_name}`}
                        </Cell>
                    </Link>
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
                                    тел.: {this.state.user && <Link href={"tel:" + this.state.user.mobile}>{this.state.user.mobile}</Link>}
                                </Cell>
                                <Cell before={<Icon28Send />}>
                                    telegram: {this.state.user && <Link href={"tg://resolve?domain=" + this.state.user.telegram}>{this.state.user.telegram}</Link>}
                                </Cell>
                                <Cell before={<Icon28MailOutline />}>
                                    email: {this.state.user && <Link href={"mailto:" + this.state.user.email}>{this.state.user.email}</Link>}
                                </Cell>
                                <Cell before={<Icon28ArticleOutline />}>
                                    дополнительно: {this.state.user && this.state.user.about}
                                </Cell>
                            </List>
                            <Div>
                                <Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
                                <Typeahead id="skills"
                                    clearButton
                                    onChange={(e) => {
                                        this.onSkillsChange(e)
                                    }}
                                    options={this.state.allSkills}
                                    selected={this.state.selectedSkills}
                                    top="Skills"
                                    multiple
                                    className="Select__el skillsInput"
                                    disabled={this.state.readOnlyMode}
                                />
                            </Div>
                        </Group> :
                        <Group>
                            <UserTeams userTeams={this.state.user && this.state.user.userTeams} readOnlyMode={this.state.readOnlyMode} />
                        </Group>
                }
                <Div>
                    <Checkbox disabled={this.state.readOnlyMode} onChange={(e) => this.handleCheckboxClick(e)}
                        checked={this.state.user && this.state.user.isSearchable ? 'checked' : ''}>в поиске команды</Checkbox>
                    {this.state.user && !this.state.readOnlyMode && <Button mode={this.state.user ? "primary" : "destructive"} size='xl'
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
        profileUser: state.user.profileUser,
        profile: state.user.profile
    };
};

const mapDispatchToProps = {
    setPage,
    setUser,
    setProfileUser,
    goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
