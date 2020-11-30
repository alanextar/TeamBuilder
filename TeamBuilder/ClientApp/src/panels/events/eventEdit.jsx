import React, { useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux';
import { goBack } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";

import {
	Panel, PanelHeader, Button, Textarea,
	PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';

import { Api } from '../../infrastructure/api';
import * as utils from '../../infrastructure/utils';
import { getActivePanel, longOperationWrapper } from "../../services/_functions";

const EventEdit = props => {
	const { goBack, setFormData } = props;

	const itemIdInitial = getActivePanel(props.activeView).itemId;
	const bindingId = `${props.id}_${itemIdInitial}`;

	const [itemId] = useState(itemIdInitial);
	const [inputData, setInputData] = useState(props.inputData[bindingId]);
	const inputDataRef = useRef();

	useEffect(() => {
		inputData || fetchEvent();
	}, [])

	const fetchEvent = () => {
		Api.Events.get(itemId)
			.then(result => setInputData(result));
	}

	useEffect(() => {
		inputDataRef.current = inputData
	}, [inputData]);

	useEffect(() => {
		return () => {
			setFormData(bindingId, inputDataRef.current)
		};
	}, []);

	//Если inputData изменится на другой вкладке, это позволит обновить данные
	useEffect(() => {
		setInputData(props.inputData[bindingId] || fetchEvent())
	}, [props.inputData[bindingId]]);

	const eventEdit = async () => {
		if (!inputData.name) return;

		let action = async () => await Api.Events.edit(inputData)
		let postAction = () => goBack();

		await longOperationWrapper({ action, postAction });
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
		setInputData(null);
		goBack();
	};

	const getOrEmpty = (name) => {
		return (inputData && inputData[name]) || '';
	}

	return (
		<Panel id={props.id}>
			<PanelHeader separator={false} left={<PanelHeaderBack onClick={cancelForm} />}>
				Редактировать
        </PanelHeader>

			<FormLayout>
				<Input top="Название события" type="text" onChange={handleInput} name="name" value={getOrEmpty('name')} status={inputData?.name ? 'valid' : 'error'} placeholder="Введите название события" />
				<Textarea top="Описание события" onChange={handleInput} name="description" value={getOrEmpty('description')} />
				<Input top="Ссылка на событие" type="text" onChange={handleInput} name="link" value={getOrEmpty('link')} />
				<Input top="Дата начала события" type="date" onChange={handleInput} name="startDate" value={utils.convertDateToWebType(getOrEmpty('startDate'))} />
				<Input top="Дата завершения события" type="date" onChange={handleInput} name="finishDate" value={utils.convertDateToWebType(getOrEmpty('finishDate'))} />
				<Button
					size='xl'
					onClick={() => eventEdit()}>
					Сохранить
                </Button>
			</FormLayout>
			{props.snackbar}
		</Panel>
	);
}

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		snackbar: state.formData.snackbar
	};
};

const mapDispatchToProps = {
	goBack,
	setFormData
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEdit);