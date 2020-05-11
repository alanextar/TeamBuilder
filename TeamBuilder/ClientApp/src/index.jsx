import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Group, Cell, PanelHeaderBack, Spinner, Avatar, Search } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28MusicOutline from '@vkontakte/icons/dist/28/music_outline';
import bridge from '@vkontakte/vk-bridge';

class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'panel1',
            fetchedUser: null
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
                    <Group>
                        <Cell expandable before={<Icon28UserOutline />} onClick={() => this.setState({ activePanel: 'panel2' })}>
                            Friends
                        </Cell>
                        <Cell expandable before={<Icon28UsersOutline />} onClick={() => this.setState({ activePanel: 'panel2' })}>
                            Communities
                        </Cell>
                        <Cell expandable before={<Icon28MusicOutline />} onClick={() => this.setState({ activePanel: 'panel2' })}>
                            Music
                        </Cell>
                    </Group>
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
                <Panel id="panel3" centered>
                    <PanelHeader left={<PanelHeaderBack onClick={() => this.setState({ activePanel: 'panel2' })} />}>
                        Out Cinema
                    </PanelHeader>
                    <Spinner />
                    <div style={{ marginTop: 10 }}>Centered Content</div>
                </Panel>
            </View>
        )
    }
}

ReactDOM.render(<Example />, document.getElementById('root'));