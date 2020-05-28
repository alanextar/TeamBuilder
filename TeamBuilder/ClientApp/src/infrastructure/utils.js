export function getConfirmedCount(userTeams) {
	var count = userTeams ? userTeams.filter(x => x.userAction === 2 || x.isOwner).length : 0;
	return count;
};