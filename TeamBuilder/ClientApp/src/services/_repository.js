export const getUser = (id) => (dispatch) => {
    return fetchUser(id).then(result => result.json())
};

export const fetchUser = (id) => {
    return fetch(`/api/user/get/?id=${id}`)
        .then(response => response.json())
        .then(data => this.setState({ user: data }));
};