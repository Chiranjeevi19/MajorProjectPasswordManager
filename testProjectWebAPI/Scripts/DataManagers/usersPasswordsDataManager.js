function print(text) {
    console.log(text);
}

class UsersPasswordsDataManager {
    async postPasswordData(url, data) {
        print("Data in dm" + data);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData;
    }

    async deleteData(url, data) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json', 'charset': 'utf-8' },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData;
    }

}
