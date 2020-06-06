export function countConfirmed(userTeams) {
	var count = userTeams ? userTeams.filter(x => x.userAction === 2 || x.isOwner).length : 0;
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

export function countActiveUserTeams(userTeams) {
	var count = !userTeams
		? 0
		: userTeams
			.filter(x =>
				x.userAction === 1 ||
				x.userAction === 2 ||
				x.userAction === 5 ||
				x.isOwner)
			.length;
	return count;
};

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