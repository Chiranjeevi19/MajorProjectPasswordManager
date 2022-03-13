
function print(text) {
    console.log(text);
}


class SaltsDataManager {

    async getAllSalts(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    async postSalt(url, data) {
        print("Data in dm"+data);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData;
    }

}