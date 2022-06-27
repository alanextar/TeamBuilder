export const INPUT_TYPES = {
	PHONE: "PHONE",
	EMAIL: "EMAIL",
	TELEGRAM: "TELEGRAM",
};

export const PROFILE_FORM = {
	EMAIL: "email",
	MOBILE: "mobile",
	TEXT: "text",
	TELEGRAM: "telegram",
};

export const TEAM_CREATE = {
	MEMBERS_COUNT: "numberRequiredMembers",
	NAME: "name",
};

export const validateEmail = (inputValue) => {
	let error = {};
	console.log("validateEmail value: ", inputValue);
	if (inputValue == null) {
		return true;
	}

	let lastAtPos = inputValue.lastIndexOf("@");
	let lastDotPos = inputValue.lastIndexOf(".");

	if (!(lastAtPos < lastDotPos && lastAtPos > 0 && inputValue.indexOf("@@") == -1 && lastDotPos > 2 && inputValue.length - lastDotPos > 2)) {
		error = { [PROFILE_FORM.EMAIL]: "Некорректный email. Проверьте наличие символа '@'" };
	}

	return error;
};

export const validatePhoneNumber = (inputValue) => {
	const maxLength = 10;
	let error = "";
	console.log("validateMobile value: ", inputValue);
	if (inputValue == null) return true;

	let isValid = inputValue.length == maxLength;
	if (!isValid) {
		error = `Номер должен быть длиной ${maxLength} цифр`;
	}

	return error;
};

export const validateTelegram = (inputValue) => {
	let error = {};
	console.log("validateTelegram value: ", inputValue);
	if (inputValue == null) {
		return true;
	}

	let isValid = inputValue.length >= 5 && inputValue.length <= 32;
	if (!isValid) {
		error = { [PROFILE_FORM.TELEGRAM]: "Никнейм в телеграмме должен быть от 5 до 32 символов" };
	}

	return error;
};

export const validateNumberTypeInput = (val, key) => {
	let error = {};
	let isnum = /^\d+$/.test(val);
	if (!isnum) {
		error = { [key]: "Поле принимает только числовые значения" };
	}

	return error;
};

export const validateNotEmptyString = (inputValue, key) => {
	let error = {};
	let isValid = inputValue.length && inputValue.length < 50;
	if (!isValid) {
		error = { [key]: "Заполните обязательное поле" };
	}

	return error;
};
