export function countConfirmed(userTeams) {
	var count = userTeams ? userTeams.filter(x => x.userAction === 2 || x.isOwner).length : 0;
	return count;
};

export function convertSkills(userSkills) {
	return userSkills && userSkills.map(userSkill => {
		return {
			key: userSkill.skillId,
			label: userSkill.skill.name,
			value: userSkill.skill.name
		};
	})
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