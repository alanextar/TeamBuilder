import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Button, Div, PanelHeaderBack,
    Tabs, TabsItem, Separator, Checkbox, InfoRow, Header, Title, Link, Switch
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
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
import { setUser, setProfile, setRecruitTeams } from '../store/user/actions';
import { setActiveTab } from "../store/vk/actions";
import SkillTokens from './SkillTokens';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: props.profile,             //Здесь все данные о пользователе, если первый раз пришёл то только те что есть в VK, если нет то все данные которые у нас есть
            user: props.user,                   //Тот пользователь который сейчас отображается в этой панели, на story profile равны
            activeTab: props.activeTab["profile"] || "main",
            readOnlyMode: props.activeStory != 'user',
            teamsCanInvite: []
        }

        this.confirmUser = this.confirmUser.bind(this);
    }

	//TODO Вынести в утилиты для обработки данных бэка
    convertSkills(userSkills) {
        return userSkills && userSkills.map(skill => {
            return {
                key: skill.id,
                label: skill.name
            };
        })
    }

	//
    componentDidMount() {
        this.state.readOnlyMode && this.fetchUserData(this.state.id);
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
        Api.Users.get(id)
            .then(user => {
                setUser(user);
                this.setState({ user: user });
            });
    }

    async confirmUser() {
        const { setUser, setProfile } = this.props;

        console.log(`confirmUser.profileViewModel ${JSON.stringify(this.state.profile, null, 4)}`);

        Api.Users.saveOrConfirm(this.state.profile)
            .then(user => {
                setUser(user);
                setProfile(user);
            });
    }

    getTeamsCanInvite() {
        let teamsToRecruit = this.state.profile.teamsToRecruit;
        let userTeams = this.state.user && this.state.user.UserTeams

        let myTeams = teamsToRecruit ? teamsToRecruit.map(t => t.id) : []
        let teamsOccupateUser = userTeams ? userTeams.map(ut => ut.teamId) : [];

        return myTeams
            .filter(x => !teamsOccupateUser.includes(x))
            .concat(teamsOccupateUser.filter(x => !myTeams.includes(x)));
    }

    render() {
        const { setPage, goBack, activeView } = this.props;
        console.log(`vkProfile. ${JSON.stringify(this.state.profile, null, 4)}`);
        let user = this.state.user;

        return (
            <Panel id="user">
                <PanelHeader separator={false} left={this.state.readOnlyMode &&
                    <PanelHeaderBack onClick={() => goBack()} />}>{this.state.readOnlyMode ? 'Участник' : 'Профиль'}</PanelHeader>
                {user &&
                    <Group title="VK Connect">
                        <Link href={"https://m.vk.com/id" + user.id} target="_blank">
                            <Cell description={user.city ? user.city : ''}
                                before={user.photo100 ? <Avatar src={user.photo100} /> : null}>
                                {`${user.firstName} ${user.lastName}`}
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
                {this.state.activeTab === 'main'
                    ?
                    <Group header={
                        <Header
                            mode="secondary"
                            aside={!this.state.readOnlyMode && !this.state.user.isNew &&
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
                                <Title level="3" weight="regular" style={{ marginBottom: 4 }}>Скиллы:</Title>
                                {/*SkillTokens - просто прямоугольники без селекта для отображения в информации об участнике*/}
                                <SkillTokens selectedSkills={this.convertSkills(this.state.user.userSkills)} />
                            </Div>
                            <Div>
                                <Cell asideContent={
                                    <Switch disabled={this.state.readOnlyMode}
                                        onChange={(e) => this.handleCheckboxClick(e)}
                                        checked={this.state.isSearchable ? 'checked' : ''} />}>
                                    Ищу команду
                                    </Cell>
                            {this.state.user.isNew &&
                                <Button
                                    size='xl'
                                    mode="destructive"
                                    onClick={this.confirmUser}>
                                    Подтвердить
                                </Button>}
                        </Div>
                    </Group>
                    :
                    <Group>
                        <UserTeams userTeams={this.state.user && this.state.user.userTeams} readOnlyMode={this.state.readOnlyMode} />
                    </Group>
                }
                <Div>
                    {this.state.readOnlyMode && this.getTeamsCanInvite().length > 0 &&
                        <Button
                            size='xl'
                            mode="primary"
                            onClick={() => setPage(activeView, 'setUserTeam')}>
                            Завербовать
                    </Button>}
                </Div>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {

    console.log(`mapStateToProps.state ${JSON.stringify(state, null, 4)}`);
    return {
        user: state.user.user,
        profile: state.user.profile,
        activeStory: state.router.activeStory,
        activeView: state.router.activeView,
        activeTab: state.vkui.activeTab
    };
};

const mapDispatchToProps = {
    setPage,
    setUser,
    setProfile,
    goBack,
    setRecruitTeams,
    setActiveTab
};

export default connect(mapStateToProps, mapDispatchToProps)(User);