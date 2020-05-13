import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Group, Cell, PanelHeaderBack, Spinner, Avatar, Search, Button, Div } from '@vkontakte/vkui';
import { Tabs, TabsItem, Separator, CellButton } from '@vkontakte/vkui';
import { FormLayout, Checkbox, Link } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../src/styles/style.css';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28MusicOutline from '@vkontakte/icons/dist/28/music_outline';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import bridge from '@vkontakte/vk-bridge';
import { getAvatarUrl } from '../src/utils.js';

class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'panel1',
            fetchedUser: null,
            activeTab1: 'main',
            activeTab2: 'teams',
            showMain: true
        }

        bridge.subscribe((e) => console.log(e));
        bridge.send("VKWebAppInit", {});
        // Проверяет, поддерживается ли событие на текущей платформе.
        if (bridge.supports("VKWebAppResizeWindow")) {
            bridge.send("VKWebAppResizeWindow", { "width": 800, "height": 1000 });
        }
    }

    async componentDidMount() {
        const user = await bridge.send('VKWebAppGetUserInfo');
        this.setState({ fetchedUser: user });
        console.log(JSON.stringify(user));
    }

    render() {
        console.log('--------', 1, this.state.showMain)
        return (
            <View activePanel={this.state.activePanel}>
                <Panel id="panel1">
                    <PanelHeader>More</PanelHeader>
                    {this.state.fetchedUser &&
                        <Group title="Результат из VK Connect">
                            <Cell description={this.state.fetchedUser.city && this.state.fetchedUser.city.title ? this.state.fetchedUser.city.title : ''}
                                before={this.state.fetchedUser.photo_200 ? <Avatar src={this.state.fetchedUser.photo_200} /> : null}>
                                {`${this.state.fetchedUser.first_name} ${this.state.fetchedUser.last_name}`}
                            </Cell>
                        </Group>}
                    <Separator />
                    <Tabs>
                        <TabsItem
                            onClick={() => this.setState({ activeTab1: 'main', showMain: true })}
                            selected={this.state.activeTab1 === 'main'}>
                                Основное
                        </TabsItem>
                        <TabsItem
                            onClick={() => this.setState({ activeTab1: 'teams', showMain: false })}
                            selected={this.state.activeTab1 === 'teams'}>
                                Команды
                        </TabsItem>
                    </Tabs>
                    <Div className="mainContent">
                        <Div id="main" style={{ display: this.state.showMain ? 'block' : 'none' }}>
                            Контактная информация
                            <Cell before={<Icon20HomeOutline height={28} width={28} />}>
                                город:
                            </Cell>
                            <Cell before={<Icon28PhoneOutline/>}>
                                телефон:
                            </Cell>
                            <Cell before={<Icon28ArticleOutline />}>
                                дополнительно:
                            </Cell>
                         </Div>
                        <Div id="teams" style={{ display: !this.state.showMain ? 'block' : 'none' }}>Команды</Div>
                        <Div className="profileBottom" >
                            <FormLayout>
                                <Checkbox>Ищу команду</Checkbox>
                            </FormLayout>
                            <Div>
                                <Button mode="destructive" size='xl'>Подтвердить профиль</Button>
                            </Div>
                        </Div>
                    </Div>
                </Panel>
                <Panel id="panel2">
                    <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => this.setState({ activePanel: 'panel1' })} />}>
                        Communities
                    </PanelHeader>
                    <Search />
                    <Cell description="Humor" before={<Avatar />} onClick={() => this.setState({ activePanel: 'panel3' })}>
                        Swipe Right
                    </Cell>
                    <Cell description="Cultural Center" before={<Avatar />} onClick={() => this.setState({ activePanel: 'panel3' })}>
                        Out Cinema
                    </Cell>
                    <Cell description="Movies" before={<Avatar />} onClick={() => this.setState({ activePanel: 'panel3' })}>
                        #ARTPOKAZ
                    </Cell>
                </Panel>
            </View>
        )
    }
}

ReactDOM.render(<Example />, document.getElementById('root'));