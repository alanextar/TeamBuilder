import React from 'react'
import { connect } from "react-redux";
import { goToPage, goBack } from "../../store/router/actions";
import { Panel, Div, PanelHeader } from "@vkontakte/vkui";

export const CommonError = props => {
	return (
		<Panel id={props.id}>
			<PanelHeader>
				Ошибка
			</PanelHeader>
			<Div>
				<p>Не сцыте мы работаем над вашей проблемой!</p>
			</Div>
		</Panel>
	)
}

const mapStateToProps = (state) => {
	return {
		errorMessage: state.errorMessage
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonError);