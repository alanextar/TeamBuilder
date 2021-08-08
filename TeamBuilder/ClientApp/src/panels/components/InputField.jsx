import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { setSnackbar, setValidationError } from "../../store/formData/actions";
import { Input } from "@vkontakte/vkui";

export const InputField = props => {
	const { validationRequired, name, maxLength, isRequired, placeholder } = props;
	const options = {};

	//useEffect(() => {
		
	//})

	const getOrEmpty = (name) => {
		return this.state.inputData && this.state.inputData[name] ? this.state.inputData[name] : '';
	}

	const handleInput = (e) => {
		let value = e.currentTarget.value;
		validateEmail(value);

		setInputData({
			...inputData,
			[e.currentTarget.name]: value
		})
	}

	const validateEmail = (inputValue) => {
		let isValid = true;

		let lastAtPos = inputValue.lastIndexOf('@');
		let lastDotPos = inputValue.lastIndexOf('.');

		if (!(lastAtPos < lastDotPos && lastAtPos > 0 &&
			inputValue.indexOf('@@') == -1 &&
			lastDotPos > 2 && (inputValue.length - lastDotPos) > 2)) {
			isValid = false;
			setValidationError("Неправильно, переделывай нах!");
		}

		return isValid;
	}

	return (
		<React.Fragment>
			<Input name={name} value={getOrEmpty(name)} onChange={handleInput} type="text" placeholder={placeholder} />
			<span className="error">{validationErrors[name]}[0]</span>
		</React.Fragment>
	);
}

const mapDispatchToProps = {
	inputData: state.formData.forms,
	validationErrors: state.formData.validationErrors
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ goBack, setFormData, setValidationError }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InputField);