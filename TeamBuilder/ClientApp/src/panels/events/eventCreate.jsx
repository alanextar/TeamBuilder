import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../../store/router/actions";
import { setEvent } from "../../store/events/actions";
import { setFormData } from "../../store/formData/actions";

import {
    Panel, PanelHeader, Group, Button, Textarea, FixedLayout,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api } from '../../infrastructure/api';

const EventCreate = props => {
    let defaultInputData = {
        name: '',
        description: '',
        link: '',
        startDate: '',
        finishDate: ''
    };
    const { activeView, setPage, setEvent, goBack } = props;
    const [inputData, setInputData] = useState(props.inputData[`${activeView}_eventCreate`] || defaultInputData);

    const handleInput = (e) => {
        let value = e.currentTarget.value;

        if (e.currentTarget.type === 'checkbox') {
            value = e.currentTarget.checked;
        }

        setInputData({
            ...inputData,
            [e.currentTarget.name]: value
        });
    }

    const cancelForm = () => {
        setInputData(defaultInputData);
        props.goBack();
    };

    const eventCreate = () => {
        Api.Events.create(inputData)
            .then(result => { setEvent(result); setPage(activeView, 'eventInfo')});
    }

    useEffect(() => {
        const { setFormData } = props;

        return () => {
            setFormData(`${activeView}_eventCreate`, inputData);
        };
    }, [inputData]);

    return (
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={cancelForm} />}>
                Создание
        </PanelHeader>

            <FormLayout>
                <Input top="Название события" type="text" onChange={handleInput} name="name" value={inputData.name} placeholder="Введите название события" status={inputData.name ? 'valid' : 'error'} />
                <Textarea top="Описание события" onChange={handleInput} name="description" value={inputData.description} />
                <Input top="Ссылка на событие" type="text" onChange={handleInput} name="link" value={inputData.link} />
                <Input top="Дата начала события" type="date" onChange={handleInput} name="startDate" value={inputData.startDate} />
                <Input top="Дата завершения события" type="date" onChange={handleInput} name="finishDate" value={inputData.finishDate} />
                <Button
                    size='xl'
                    onClick={() => { inputData.name && eventCreate() }}>
                    Создать событие
                </Button>

            </FormLayout>
        </Panel>
    );
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        inputData: state.formData.forms
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setEvent, goBack, setFormData }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCreate);
