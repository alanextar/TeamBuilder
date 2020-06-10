import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../../store/router/actions";
import { setEvent } from "../../store/events/actions";
import { setFormData } from "../../store/formData/actions";

import {
    Panel, PanelHeader, Button, Textarea,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api } from '../../infrastructure/api';

const EventEdit = props => {
    const [inputData, setInputData] = useState(props.inputData['eventEdit_form'] || props.event);
    const { goBack, setEvent } = props;

    const eventEdit = () => {
        Api.Events.edit(inputData)
            .then(result => {
                setEvent(result);
                goBack();
            });
    }

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
        const { goBack } = props;
        setInputData(null);
        goBack();
    };

    useEffect(() => {
        const { setFormData } = props;

        return () => {
            setFormData('eventEdit_form', inputData);
        };
    }, [inputData]);

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={cancelForm} />}>
                Редактировать
        </PanelHeader>

            <FormLayout>
                <Input top="Название события" type="text" onChange={handleInput} name="name" value={inputData && inputData.name} status={inputData && inputData.name ? 'valid' : 'error'} placeholder="Введите название события" />
                <Textarea top="Описание события" onChange={handleInput} name="description" value={inputData && inputData.description} />
                <Input top="Ссылка на событие" type="text" onChange={handleInput} name="link" value={inputData && inputData.link} />
                <Input top="Дата начала события" type="date" onChange={handleInput} name="startDate" value={inputData && inputData.startDate} />
                <Input top="Дата завершения события" type="date" onChange={handleInput} name="finishDate" value={inputData && inputData.finishDate} />
                <Button
                    size='xl'
                    onClick={() => { inputData.name && eventEdit(); }}>
                    Сохранить
                </Button>
            </FormLayout>
        </Panel>
    );
}

const mapStateToProps = (state) => {
    return {
        event: state.event.event,
        inputData: state.formData.forms,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setEvent, setFormData }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEdit);