import React from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Spinner } from "@vkontakte/vkui";

const Panel3 = ({ id, go }) => (
    <Panel id="panel3" centered>
        <PanelHeader left={<PanelHeaderBack onClick={go} data-to='panel2' />}>
            Out Cinema
                        </PanelHeader>
        <Spinner />
        <div style={{ marginTop: 10 }}>Centered Content</div>
    </Panel>
);
export default Panel3;