function print(text) {
    console.log(text);
}

class UsersNotesDataManager {



    async postNoteData(url, data) {
        print("Data in dm" + data);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData;
    }

    async deleteNoteData(url, userid, note, userObj) {
        let urlToDelete = `${url}?userid=${userid}&note=${note}`;
        const response = await fetch(urlToDelete, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json', 'charset': 'utf-8' },
            body: JSON.stringify(userObj)
        });
        const resData = await response.json();
        return resData;
    }

    async updateNoteData(url, userid, note, updatedNote) {
        let urlToUpdate = `${url}?userid=${userid}&note=${note}&updatedNote=${updatedNote}`;
        return urlToUpdate;
        //const response = await fetch(urlToUpdate, {
        //    method: 'PUT',
        //    headers: { 'Content-type': 'application/json', 'charset': 'utf-8' }
        //});
        //const resData = await response.json();
        //return resData;
    }


}
