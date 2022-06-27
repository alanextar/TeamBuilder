export function isNoContentResponse(response) {
	return response && response.code == 204;
};

export function countConfirmed(userTeams) {
	let count = userTeams ? userTeams.filter(x => x.userAction === 2 || x.isOwner).length : 0;
	return count;
};

export function convertUserSkills(userSkills) {
	return userSkills && userSkills.map(userSkill => {
		return {
			id: userSkill.skillId,
			label: userSkill.skill.name,
			value: userSkill.skill.name
		};
	})
}

export function convertSkills(skills) {
	return skills && skills.map(skill => {
		return {
			id: skill.id,
			label: skill.name,
			value: skill.name
		};
	})
}

export function countMyActiveTeams(userTeams) {
	return countActiveUserTeams(userTeams, [1, 2, 5]);
};

export function countForeignActiveTeams(userTeams) {
	return countActiveUserTeams(userTeams, [2]);
};

export function countActiveUserTeams(userTeams, activeActions) {
	let count = !userTeams
		? 0
		: userTeams
			.filter(x =>
				activeActions.indexOf(x.userAction) !== -1 ||
				x.isOwner)
			.length;
	return count;
};

export function renderEventDate(event) {
	const startDate = event.startDate;
	const finishDate = event.finishDate;

	if (startDate && finishDate) {
		return `${startDate} - ${finishDate}`
	}
	if (startDate && !finishDate) {
		return `c ${startDate}`
	}
	if (!startDate && finishDate) {
		return `по ${finishDate}`
	}
}

export function convertDateToWebType(date) {
	let splitted = date.split('.');
	if (splitted.length === 3) {
		return `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
	}
	return date;
}

export async function GetRandomPicUrl() {
	let url = ``;

	let count = 0
	while (count < 10) {
		url = `https://picsum.photos/seed/${getRandomInt()}/100`;
		const response = await fetch(url);
		if (response.ok) {
			return await readBlobAsDataURL(await response.blob());
		}
		count++;
	}
	return url;
}

function getRandomInt() {
	var min = 0;
	var max = 1000;
	return Math.floor(Math.random() * (+max - +min)) + +min;
}

function readBlobAsDataURL(blob) {
	const temporaryFileReader = new FileReader();

	return new Promise((resolve, reject) => {
		temporaryFileReader.onerror = () => {
			temporaryFileReader.abort();
			reject(new DOMException("Problem parsing input file."));
		};

		temporaryFileReader.onload = () => {
			resolve(temporaryFileReader.result);
		};
		temporaryFileReader.readAsDataURL(blob);
	});
};

export function isEmpty(obj) {
	for (var prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			return false;
		}
	}

	return JSON.stringify(obj) === JSON.stringify({});
}