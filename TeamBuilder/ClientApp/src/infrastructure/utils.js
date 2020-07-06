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
	return countActiveUserTeams(userTeams, [1,2,5]);
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

export function convertDateToWebType (date) {
	let splitted = date.split('.');
	return `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
}

export function GetRandomPic() {
	let url = ``;

	let count = 0
	while (count < 10) {
		url = `https://picsum.photos/id/${getRandomInt()}/100`;
		if (UrlExists(url)) {
			return url;
		}
		console.log(`count: ${count}`);
		count++;
	}
	return url;
}

function getRandomInt() {
	var min = 0;
	var max = 1000;
	return Math.floor(Math.random() * (+max - +min)) + +min;
}

function UrlExists(url) {
	var http = new XMLHttpRequest();
	http.open('GET', url);
	http.responseType = 'blob';
	http.send();
	return http.status != 404
}