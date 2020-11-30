import React from 'react'
import { connect } from "react-redux";
import { setSnackbar } from "../../store/formData/actions";
import { Snackbar, Avatar } from "@vkontakte/vkui";
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';

export const CommonError = props => {

	return (
		<Snackbar
			layout="vertical"
			before={<Avatar size={24}><Icon20CancelCircleFillRed /></Avatar>}
		>
			<p>Код ошибки: {props.error.code != null ? props.error.code : 500}</p>
			<p>{props.error.message != null ? props.error.message : "Ничего страшного, бывает и хуже.Скоро устраним ;)"}</p>
		</Snackbar>
	);
}

const mapDispatchToProps = {
	setSnackbar
}

export default connect(null, mapDispatchToProps)(CommonError);