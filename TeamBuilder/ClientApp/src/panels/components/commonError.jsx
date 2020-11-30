import React from 'react'
import { connect } from "react-redux";
import { goToPage, goBack } from "../../store/router/actions";
import { setError } from "../../store/formData/actions";
import { Panel, Div, PanelHeader, PanelHeaderBack, SimpleCell, Snackbar, Avatar } from "@vkontakte/vkui";
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';

export const CommonError = props => {
	const { setError } = props;

	return (
		props.error != null ? <Snackbar
			layout="vertical"
			onClose={() => setError(null)}
			before={<Avatar size={24}><Icon20CancelCircleFillRed /></Avatar>}
		>
			<p>Код ошибки: {props.error.code != null ? props.error.code : 500}</p>
			<p>{props.error.message != null ? props.error.message : "Ничего страшного, бывает и хуже.Скоро устраним ;)"}</p>
		</Snackbar> : ""
	);
}

const mapStateToProps = (state) => {
	return {
		error: state.formData.error
	};
};

const mapDispatchToProps = {
	goToPage,
	goBack,
	setError
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonError);