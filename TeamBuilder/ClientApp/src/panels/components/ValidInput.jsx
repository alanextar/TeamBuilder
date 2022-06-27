import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Input, Div } from "@vkontakte/vkui";
import * as Validation from "../../helpers/validation";
import { setFormData } from "../../store/formData/actions";

export const ValidInput = (props) => {
	const { needValidation, name, placeholder, type, val, bindingId, setFormData } = props;
	const [inputData, setInputData] = useState((props.inputData && props?.inputData[bindingId]) || "");
	const [value, setValue] = useState(() => val);
	const [validationError, setValidationError] = useState(null);

	useEffect(() => {
		return () => {
			setFormData(bindingId, inputData);
		};
	}, []);

	const [maxLength, setMaxLength] = useState(() => {
		let maxLength = 1000;

		switch (type) {
			case Validation.INPUT_TYPES.PHONE:
				maxLength = 10;
				break;
			case Validation.INPUT_TYPES.EMAIL:
				maxLength = 100;
				break;
			case Validation.INPUT_TYPES.TELEGRAM:
				maxLength = 32;
				break;
		}

		return maxLength;
	});

	const handleInput = (e) => {
		const v = e.currentTarget.value;
		setValue(v);
		setInputData({
			...inputData,
			[e.currentTarget.name]: v,
		});

		if (!needValidation) {
			return;
		}

		let validationResult = "";

		switch (type) {
			case Validation.INPUT_TYPES.PHONE:
				validationResult = Validation.validatePhoneNumber(v);
				break;
			case Validation.INPUT_TYPES.EMAIL:
				validationResult = Validation.validateEmail(v);
				break;
			case Validation.INPUT_TYPES.TELEGRAM:
				validationResult = Validation.validateTelegram(v);
				break;
			default:
				console.log("no validation for this type");
		}

		setValidationError(validationResult);
	};

	return (
		<React.Fragment>
			<Input maxLength={maxLength} name={name} value={value || val} onChange={handleInput} type="text" placeholder={placeholder} />
			{validationError && (
				<Div className="error" style={{ color: "red" }}>
					{validationError}
				</Div>
			)}
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {
	setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ValidInput);
