function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        //console.log('AUTH HEADER:', user);
        return { Authorization: "Bearer " + user.accessToken};
    } else {
        return {};
    }
}

export {authHeader}