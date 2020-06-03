import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Button, Div, PanelHeaderBack,
    Tabs, TabsItem, Separator, Checkbox, InfoRow, Header, Title, Link, Switch
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
import CreatableMulti from './CreatableMulti'
import bridge from '@vkontakte/vk-bridge';
import { Api, Urls } from '../infrastructure/api';
import { goBack, setPage } from '../store/router/actions';
import { setUser, setProfileUser, setRecruitTeams } from '../store/user/actions';
import { setActiveTab } from "../store/vk/actions";

class User extends React.Component {
    constructor(props) {
        super(props);

        let isSearchable = props.user && props.user.isSearchable;

        this.state = {
            allSkills: null,
            vkUser: null,
            vkProfile: props.profile,
            profileUser: props.profileUser,
            user: props.user,
            activeTab: props.activeTab["profile"] || "main",
            selected: false,
            selectedSkills: [],
            isConfirmed: false,
            isSearchable: isSearchable ? isSearchable : false,
            readOnlyMode: props.activeStory != 'user',
            recruitTeams: []
        }

        this.confirmUser = this.confirmUser.bind(this);

    }

    componentDidMount() {
        let id = this.state.readOnlyMode ? this.state.user.id : this.state.vkProfile.id;
        this.populateSkills();
        this.state.vkProfile && this.fetchVkUser(id);
        this.state.vkProfile && this.fetchUserData(id);
    }

    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            this.setState({ user: this.props.user });
        }
    }

    componentWillUnmount() {
        const { setActiveTab } = this.props;
        setActiveTab("profile", this.state.activeTab);
    }

    fetchUserData(id) {
        const { setRecruitTeams } = this.props;
        //TODO преобразовать в один запрос типа getProfileUserWithRelation - получить профиль с командами в которые можно вербовать юзера
        Api.Users.get(id).then(user => {
            setUser(user);
            let selectedSkills = user && user.userSkills && user.userSkills.map(function (userSkill) {
                return { id: userSkill.skillId, label: userSkill.skill.name };
            })
            this.setState({ user: user, selectedSkills: selectedSkills });
        });

        Api.Users.get(this.state.vkProfile.id).then(user => {
            setProfileUser(user);
        });

        if (this.state.profileUser && this.state.profileUser.anyTeamOwner && this.state.user.isSearchable) {
            Api.Users.getRecruitTeams(this.state.vkProfile.id, id)
                .then(data => { setRecruitTeams(data); this.setState({ recruitTeams: data }) });
        }

    }

    async fetchVkUser(id) {
        const t = await bridge.send("VKWebAppGetAuthToken",
            { "app_id": 7448436, "scope": "" });

        let params = {
            user_id: id,
            fields: 'city,photo_200,contacts',
            v: '5.103',
            access_token: t.access_token
        };

        const request = await bridge.send("VKWebAppCallAPIMethod", { "method": "users.get", "request_id": "32test", "params": params });
        this.setState({ vkUser: request.response[0] });
    }

    async confirmUser() {
        const { setUser, setProfileUser } = this.props;
        let id = this.state.vkProfile.id;
        let skillsIds = this.state.selectedSkills && this.state.selectedSkills.map((s, i) => s.id);
        let photo100 = !this.state.readOnlyMode ? this.state.vkProfile.photo_100 : "";
        let photo200 = !this.state.readOnlyMode ? this.state.vkProfile.photo_200 : "";
        let firstName = !this.state.readOnlyMode ? this.state.vkProfile.first_name : "";
        let lastName = !this.state.readOnlyMode ? this.state.vkProfile.last_name : "";

        var isSearchable = this.state.isSearchable;
        var profileViewModel = {
            id,
            firstName,
            lastName,
            skillsIds,
            isSearchable,
            photo100,
            photo200
        };

        Api.Users.saveOrConfirm(profileViewModel)
            .then(user => {
                setUser(user);
                setProfileUser(user);
            });
    }

    onSkillsChange(selectedSkills) {

        this.setState({
            selectedSkills: selectedSkills
        })
    };

    handleCheckboxClick(event) {
        this.setState({ isSearchable: !this.state.isSearchable })
    };

    populateSkills() {
        Api.Skills.getAll()
            .then(allSkillsJson => {
                var options = allSkillsJson && allSkillsJson.map(function (skill) {
                    return { id: skill.id, value:skill.name, label: skill.name };
                });

                this.setState({ allSkills: options });
            })
    }

    render() {
        const { setPage, goBack, activeView } = this.props;
        let id = this.state.readOnlyMode ? this.state.user.id : this.state.vkProfile.id;

        return (
            <Panel id="user">
                <PanelHeader separator={false} left={this.state.readOnlyMode &&
                    <PanelHeaderBack onClick={() => goBack()} />}>{this.state.readOnlyMode ? 'Участник' : 'Профиль'}</PanelHeader>
                {this.state.vkUser &&
                    <Group title="VK Connect">
                        <Link href={"https://m.vk.com/id" + id} target="_blank">
                            <Cell description={this.state.vkUser.city && this.state.vkUser.city.title ? this.state.vkUser.city.title : ''}
                                before={this.state.vkUser.photo_200 ? <Avatar src={this.state.vkUser.photo_200} /> : null}>
                                {`${this.state.vkUser.first_name} ${this.state.vkUser.last_name}`}
                            </Cell>
                        </Link>
                    </Group>}
                <Separator />
                <Tabs>
                    <TabsItem
                        onClick={() => this.setState({ activeTab: 'main' })}
                        selected={this.state.activeTab === 'main'}>
                        Основное
                        </TabsItem>
                    <TabsItem
                        onClick={() => this.setState({ activeTab: 'teams' })}
                        selected={this.state.activeTab === 'teams'}>
                        Команды
                    </TabsItem>
                </Tabs>
                {
                    this.state.activeTab === 'main' ?
                        <Group header={
                            <Header
                                mode="secondary"
                                aside={!this.state.readOnlyMode && this.state.user &&
                                    <Link style={{ color: "#3f8ae0" }} onClick={() => setPage('user', 'userEdit')}>Редактировать</Link>
                                }>
                                Информация
                                </Header>}>
                            {/* <List>
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
                            </List> */}
                            {this.state.user && this.state.user.mobile &&
                                <Cell>
                                    <InfoRow header="Телефон">
                                        <Link href={"tel:" + this.state.user.mobile}>{this.state.user.mobile}</Link>
                                    </InfoRow>
                                </Cell>}
                            {this.state.user && this.state.user.telegram &&
                                <Cell>
                                    <InfoRow header="Telegram">
                                        <Link href={"tg://resolve?domain=" + this.state.user.telegram}>@{this.state.user.telegram}</Link>
                                    </InfoRow>
                                </Cell>}
                            {this.state.user && this.state.user.email &&
                                <Cell>
                                    <InfoRow header="Email">
                                        <Link href={"mailto:" + this.state.user.email}>{this.state.user.email}</Link>
                                    </InfoRow>
                                </Cell>}
                            {this.state.user && this.state.user.about &&
                                <Cell>
                                    <InfoRow header="Дополнительно">
                                        {this.state.user.about}
                                    </InfoRow>
                                </Cell>}
                            <Div>
                                <Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
                                <Typeahead id="skills"
                                    clearButton
                                    onChange={(e) => {
                                        this.onSkillsChange(e)
                                    }}
                                    options={this.state.allSkills && this.state.allSkills}
                                    selected={this.state.selectedSkills}
                                    top="Skills"
                                    multiple
                                    className="Select__el"
                                    disabled={this.state.readOnlyMode}
                                />

                                {/*<CreatableMulti data={this.state.allSkills && this.state.allSkills} />*/}
                            </Div>
                            <Div>
                                <Cell asideContent={
                                    <Switch disabled={this.state.readOnlyMode}
                                        onChange={(e) => this.handleCheckboxClick(e)}
                                        checked={this.state.isSearchable ? 'checked' : ''} />}>
                                    Ищу команду
                                    </Cell>
                                {!this.state.readOnlyMode && <Button mode={this.state.user ? "primary" : "destructive"} size='xl'
                                    onClick={() => this.state.vkProfile && this.confirmUser()}>
                                    {this.state.user ? "Сохранить" : "Подтвердить"}
                                </Button>}
                            </Div>
                        </Group> :
                        <Group>
                            <UserTeams userTeams={this.state.user && this.state.user.userTeams} readOnlyMode={this.state.readOnlyMode} />
                        </Group>
                }
                <Div>
                    {this.state.recruitTeams && this.state.recruitTeams.length > 0 && < Button mode="primary" size='xl'
                        onClick={() => setPage(activeView, 'setUserTeam')}
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
        profile: state.user.profile,
        activeStory: state.router.activeStory,
        activeView: state.router.activeView,
        activeTab: state.vkui.activeTab
    };
};

const mapDispatchToProps = {
    setPage,
    setUser,
    setProfileUser,
    goBack,
    setRecruitTeams,
    setActiveTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);