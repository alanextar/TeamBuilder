export const getUserInTeamsCount = (userTeams) => {
	var count = userTeams ? (+ userTeams.map(x => x.userAction === 2 || x.isOwner).reduce((a, b) => a + b)) : 0;
	return count;
};