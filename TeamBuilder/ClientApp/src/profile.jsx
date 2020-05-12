import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Group, Cell, PanelHeaderBack, Spinner, Avatar, Search } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28MusicOutline from '@vkontakte/icons/dist/28/music_outline';
import bridge from '@vkontakte/vk-bridge';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'avatar',
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
            <View activePanel="avatar">
                <Panel id="avatar">
                    <PanelHeader>Avatar</PanelHeader>
                    <Group>
                        <Header mode="secondary">Дефолтный размер</Header>
                        <SimpleCell
                            description="VKontakte"
                            before={<Avatar src={getAvatarUrl('user_arthurstam')} />}
                        >
                            Данил Пельмешкин
                        </SimpleCell>
                    </Group>
                </Panel>
            </View>
        )
    }
}

ReactDOM.render(<Example />, document.getElementById('root'));