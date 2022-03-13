function print(text) {
    console.log(text);
}

class UserDataManager {

    async getAllUsers(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async authenticateUser(url, uemail, uhash) {
        const URL = `${url}?uemail=${uemail}&upwdhash=${uhash}`;
        const response = await fetch(URL);
        return await response.json();
    }

    async postUser(url, data) {
        print(data)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData;
    }

}