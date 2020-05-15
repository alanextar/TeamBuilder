import React from 'react';

import { Panel, PanelHeader, Group, Search, List, Cell, Avatar, PanelHeaderBack } from '@vkontakte/vkui';

class Teaminfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            go: props.go,
            id: props.id,
        };
    };


    render() {
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.state.go} data-to='teams' />}>
                    Команда
                </PanelHeader>
            </Panel>
    );
    };

};

export default Teaminfo;

//<PanelHeader separator={false} left={<PanelHeaderBack onClick={go} data-to='teams' />}>
//    Communities
//                        </PanelHeader>
//    <Search />
//    <Cell description="Humor" before={<Avatar />} onClick={go} data-to='panel3'>
//        Swipe Right
//                        </Cell>
//    <Cell description="Cultural Center" before={<Avatar />} onClick={go} data-to='panel3'>
//        Out Cinema
//                        </Cell>
//    <Cell description="Movies" before={<Avatar />} onClick={go} data-to='panel3'>
//        #ARTPOKAZ
//                        </Cell>