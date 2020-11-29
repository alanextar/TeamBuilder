import React from 'react'
import { connect } from "react-redux";
import { goToPage, goBack } from "../../store/router/actions";
import { Panel, Div, PanelHeader, PanelHeaderBack, SimpleCell } from "@vkontakte/vkui";
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';

export const CommonError = props => {

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={() => props.goBack()} />}>
				Ошибка
			</PanelHeader>
			<SimpleCell expandable before={<Icon20CancelCircleFillRed />}>
				{props.error != null ? props.error : "Не сцыте мы работаем над вашей проблемой!"}
			</SimpleCell>
		</Panel>
	)
}

const mapStateToProps = (state) => {
	return {
		error: state.formData.error
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonError);