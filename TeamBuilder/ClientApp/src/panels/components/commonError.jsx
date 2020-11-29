import React from 'react'
import { connect } from "react-redux";
import { goToPage, goBack } from "../../store/router/actions";
import { Panel, Div, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui";

export const CommonError = props => {
	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={() => props.goBack()} />}>
				Ошибка
			</PanelHeader>
			<Div>
				<p>{props.error != null ? props.error : "Не сцыте мы работаем над вашей проблемой!"}</p>
			</Div>
		</Panel>
	)
}

const mapStateToProps = (state) => {
	return {
		error: state.error
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonError);