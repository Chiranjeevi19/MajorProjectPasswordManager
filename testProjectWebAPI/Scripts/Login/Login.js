function print(text) {
    console.log(text);
}
let passwordDataViewModel;
let notesDataViewModel;

//API urls
let usersAPIURL = 'https://localhost:44397/api/Users';
let saltsAPIURL = 'https://localhost:44397/api/Salts';
let usersPasswordsDataAPIURL = 'https://localhost:44397/api/usersPasswordsData';
let usersNotesDataAPIURL = 'https://localhost:44397/api/usersNotesData';

let loginError = document.getElementById("loginError");

let userWebAPI = new UserDataManager();
let saltWebAPI = new SaltsDataManager();
let usersPasswordsWebAPI = new UsersPasswordsDataManager();
let usersNotesWebAPI = new UsersNotesDataManager();
let aes;
let navOption = 'NOTES';

//Show certain data and hide others
let passwordDataDiv = document.getElementById("PasswordData");
let notesDataDiv = document.getElementById("NotesData");
let dataNavDiv = document.getElementById("dataNav");
passwordDataDiv.style.display = "none";
notesDataDiv.style.display = 'none';
dataNavDiv.style.display = 'none';

//FLAGS
let showPasswordData = false;
let showNotesData = false;


function LoginViewModel() {

    let self = this;
    self.email = ko.observable("").extend({
        required: true
    });
    self.password = ko.observable("").extend({
        required: true
    });
    self.showLoginForm = ko.observable(true);
    self.key = ko.observable('');
    self.id;
    self.passwordData;
    self.notesData;
    self.validateAccount = function () {
        let errors = ko.validation.group(self);
        if (errors().length > 0) {
            print("Complete the form properly");
            errors.showAllMessages();
            return;
        }
        let salts = [];
        
        saltWebAPI.getAllSalts(saltsAPIURL)
            .then(data => {
                
                for (let i = 0; i < data.length; i++) {
                    salts.push(data[i].salt1);
                }
                self.hash;
                for (let i = 0; i < salts.length; i++) {
                    self.hash = self.password() + salts[i];
                    for (let j = 0; j < 20; j++) {
                        self.hash = CryptoJS.SHA512(self.hash).toString();
                    }
                    userWebAPI.authenticateUser(usersAPIURL, self.email(), self.hash)
                        .then(data => {
                            print(data)
                            if (data.Message === 'User Not Found' || data.Message === 'Forbidden') {
                                print("Error" + data.Message + typeof data.Message);
                                loginError.innerHTML = `<div class="alert alert-danger">PLEASE ENTER VALID USER DETAILS</div>`;

                            }
                            else {
                                //self.passwordsData(data.usersPasswordsDatas)
                                print(data.usersPasswordsDatas);
                                self.passwordData = data.usersPasswordsDatas;
                                self.notesData = data.usersNotesDatas;
                                self.id = data.id;
                                let initKey = self.email() + '.' + self.password();
                                self.key(CryptoJS.PBKDF2(initKey, '', {
                                    keySize: 256,
                                    iterations: 100
                                }).toString());
                                self.showLoginForm(false);
                                dataNavDiv.style.display = 'block';
                                passwordDataDiv.style.display = "block";
                                showPasswordData = true;
                                passwordDataViewModel = new PasswordDataViewModel();
                                notesDataViewModel = new NotesDataViewModel();
                                ko.applyBindings(passwordDataViewModel, document.getElementById("PasswordData"));
                                ko.applyBindings(notesDataViewModel, document.getElementById("NotesData"));
                            }
                        }).catch(err => {
                            print(err);
                            loginError.innerHTML = err;
                        });
                    
                }
            })
            .catch(err => print(err));
    }//END OF validateAccount func


    


    
}

let loginViewModel = new LoginViewModel();
ko.applyBindings(loginViewModel, document.getElementById("loginForm"));






document.getElementById('npToggler').addEventListener('click',
    function () {

        if (navOption === 'NOTES') {
            navOption = 'PASSWORDS';
            passwordDataDiv.style.display = 'none';
            notesDataDiv.style.display = 'block';
        }
        else if (navOption === 'PASSWORDS') {
            navOption = 'NOTES';
            passwordDataDiv.style.display = 'block';
            notesDataDiv.style.display = 'none';
        }
        npToggler.innerHTML = navOption;

    })





function PasswordDataViewModel() {
    //SHOW ACCOUNT DATA 

    let self = this;

    self.userpwdData_uname = ko.observable("").extend({
        required: true
    });
    self.userpwdData_upwd = ko.observable("").extend({
        required: true
    });
    self.userpwdData_url = ko.observable("").extend({
        required: true
    });
    self.passwordData = ko.observableArray(loginViewModel.passwordData);
    self.displayPasswordData = ko.observableArray();


    print("PASSWORD DATA:---" + self.passwordData())

    self.updatePwdData = function (newPasswordData) {
        self.passwordData.push(newPasswordData);
        let temp = self.makeDisplayPasswordData(self.passwordData().length - 1);
        self.displayPasswordData.push(temp);
        print("PASSWORD-DATA" + self.passwordData())
        print("DISPLAY PWD DATA" + self.displayPasswordData())
    }

    self.makeDisplayPasswordData = function (i) {
        let key = loginViewModel.key();
        let ct = self.passwordData()[i].password;
        aes = new AESService(loginViewModel.key())
        let pt = aes.decrypt(ct);
        print("PLAIN" + pt);
        let pwddata = {
            userid: self.passwordData()[i].userid,
            username: self.passwordData()[i].username,
            password: pt,
            url: self.passwordData()[i].url
        }
        return pwddata;
    }

    self.populateDisplayPasswordData = function (i) {

        for (let i = 0; i < self.passwordData().length; i++) {
            let temp = self.makeDisplayPasswordData(i);
            print(temp)
            self.displayPasswordData.push(temp);
        }
    }
    self.populateDisplayPasswordData();

    self.reset = function () {
        self.userpwdData_uname("");
        self.userpwdData_upwd("");
        self.userpwdData_url("");
    }

    self.addNewPasswordData = function () {
        let errors = ko.validation.group(self);
        if (errors().length > 0) {
            print("Fill the details properly properly");
            errors.showAllMessages();
            return;
        }
        else {
            let pt = self.userpwdData_upwd();
            aes = new AESService(loginViewModel.key())
            let ct = aes.encrypt(pt);
            let pwddata = {
                userid: loginViewModel.id,
                username: self.userpwdData_uname(),
                password: ct,
                url: self.userpwdData_url()
            }
            usersPasswordsWebAPI.postPasswordData(usersPasswordsDataAPIURL, pwddata)
                .then(data => {
                    let pwdFormHelper = document.getElementById("pwdFormHelper");
                    print(typeof data)
                    if (!isNaN(data)) {
                        pwdFormHelper.innerHTML = `<div class="alert alert-success">Added Successfully</div>`;
                        setInterval(() => {
                            pwdFormHelper.innerHTML = `<div></div>`
                        }, 10000)
                        pwddata.id = parseInt(data)
                        self.updatePwdData(pwddata);
                        self.reset();
                    }
                    else {
                        pwdFormHelper.innerHTML = `<div class="alert alert-danger">ERROR! TRY AGAIN</div>`;
                    }
                }).catch(err => {
                    print(err)
                })
            print("Added New Password Data");
        }

    }



    self.deleteCurrentData = function () {
        let indexOfDataToBeDeleted = self.displayPasswordData.indexOf(this);
        let dataToBeDeleted = self.passwordData()[indexOfDataToBeDeleted];
        print(dataToBeDeleted)
        
        usersPasswordsWebAPI.deleteData(usersPasswordsDataAPIURL, dataToBeDeleted)
            .then(data => {
                print(data);
                self.displayPasswordData.splice(indexOfDataToBeDeleted, 1);
                self.passwordData.splice(indexOfDataToBeDeleted, 1);
                pwdFormHelper.innerHTML = `<div class="alert alert-success">DELETED SUCCESSFULLY!</div>`;
                print(self.displayPasswordData().length)
            })
            .catch(err => {
                pwdFormHelper.innerHTML = `<div class="alert alert-danger">ERROR! TRY AGAIN</div>`;
                print(err);
            })
    }

    let editIndex = -1;
    let editData = {
        url: '',
        username: '',
        password:''
    };
    self.setEditIndex = function () {
        editIndex = self.displayPasswordData.indexOf(this);
        editData.url = self.displayPasswordData()[editIndex].url
        editData.username = self.displayPasswordData()[editIndex].username
        editData.password = self.displayPasswordData()[editIndex].password
        document.getElementById('editData').innerHTML =
            `<form>
                <div class="form-group">
                    <p>
                    <label class="form-label">USERNAME</label>
                    <input type="text" id="username-${editIndex}" class="form-control card-text" value=${editData.username} />
                    </p>
                </div>
                <div class="form-group">
                    <p>
                        <label class="form-label">PASSWORD</label>
                        <input type="text" id="password-${editIndex}" class="form-control  card-text" value=${editData.password} />
                    </p>

                </div>
                <div class="form-group"><p>
                    <label class="form-label">URL/APPLICATION NAME</label>
                    <input type="text" id="url-${editIndex}" class="form-control  card-text" value=${editData.url} />
                </p></div>
                <br />
             </form>
            `
    }



    self.saveEditedData = function () {
        if (editIndex != -1) {
            let oldEncData = self.passwordData()[editIndex];
            let updatedData = {
                url: document.getElementById(`url-${editIndex.toString()}`).value.toString(),
                username: document.getElementById(`username-${editIndex.toString()}`).value.toString(),
                password: document.getElementById(`password-${editIndex.toString()}`).value.toString(),
                id: oldEncData.id,
                userid: oldEncData.userid
            };

            aes = new AESService(loginViewModel.key());
            let newct = aes.encrypt(updatedData.password)
            let updatedEncData = {
                id: oldEncData.id,
                url: updatedData.url,
                username: updatedData.username,
                password: newct,
                userid: oldEncData.userid

            }



            putData(usersPasswordsDataAPIURL, updatedEncData)
                .then(data => {
                    print(data);
                    
                    self.passwordData.splice(editIndex, 1)
                    self.passwordData.push(updatedEncData)

                    self.displayPasswordData.splice(editIndex, 1)
                    self.displayPasswordData.push(updatedData);
                    document.getElementById("editPwdHelper").innerHTML = `<div class="alert alert-success">UPDATED SUCCESSFULLY!</div>`;

                })
                .catch(err => {
                    print(err);
                })


        }
    }
}





function NotesDataViewModel() {
    let self = this;
    //SHOW ACCOUNT DATA 
    //self.showDetails = ko.observable(false);
    ////SHOW NOTES
    //self.showNotes = ko.observable(false);
    self.usernotesData_note = ko.observable("Hello enter some text").extend({
        required: true
    });
    self.notesData = ko.observableArray(loginViewModel.notesData);
    self.displayNotesData = ko.observableArray();


    self.makeDisplayNoteData = function (i) {
        let key = loginViewModel.key();
        let ct = self.notesData()[i].note;
        aes = new AESService(key)
        let pt = aes.decrypt(ct);
        print("PLAIN" + pt);
        let notedata = {
            userid: self.notesData()[i].userid,
            note: pt
        }
        return notedata;
    }

    self.populateDisplayNoteData = function () {

        for (let i = 0; i < self.notesData().length; i++) {
            let temp = self.makeDisplayNoteData(i);
            print(temp)
            self.displayNotesData.push(temp);
        }
    }

    self.reset = function () {
        self.usernotesData_note("");
    }
    self.populateDisplayNoteData();
    self.updateNoteData = function (newNoteData) {
        self.notesData.push(newNoteData);
        let temp = self.makeDisplayNoteData(self.notesData().length - 1);
        self.displayNotesData.push(temp);
        print("NOTE-DATA" + self.notesData())
        print("DISPLAY NOTE DATA" + self.displayNotesData())
    }

    self.addNewNoteData = function () {
        let errors = ko.validation.group(self);
        print(self.usernotesData_note())
        if (self.usernotesData_note() === '') {
            print("Fill the details properly");
            document.getElementsByClassName("validationMessage")[5].innerHTML = 'Enter some text!';
            //errors.showAllMessages();
            return;
        }
        else {
            let pt = self.usernotesData_note();
            aes = new AESService(loginViewModel.key());
            let ct = aes.encrypt(pt);
            let notedata = {
                userid: loginViewModel.id,
                note: ct
            }
            usersNotesWebAPI.postNoteData(usersNotesDataAPIURL, notedata)
                .then(data => {
                    let noteFormHelper = document.getElementById("noteFormHelper");
                    if (data === 'Added successfully') {
                        noteFormHelper.innerHTML = `<div class="alert alert-success">Added Successfully</div>`;
                        setInterval(() => {
                            noteFormHelper.innerHTML = `<div></div>`
                        }, 10000)
                        self.updateNoteData(notedata);
                        self.reset();
                    }
                    else {
                        noteFormHelper.innerHTML = `<div class="alert alert-danger">ERROR! TRY AGAIN</div>`;
                    }
                })
                .catch(err => {
                    print(err)
                })

        }
    }



    self.deleteCurrentNoteData = function () {
        let indexOfNoteToBeDeleted = self.displayNotesData.indexOf(this);
        let noteToBeDeleted = self.notesData()[indexOfNoteToBeDeleted].note;
        print(noteToBeDeleted)
        let userObj = {
            userid: loginViewModel.id,
            email: loginViewModel.email(),
            pwdhash: loginViewModel.hash,
            usersNotesDatas: self.notesData,
            usersPasswordsDatas: passwordDataViewModel.passwordData
        }
        usersNotesWebAPI.deleteNoteData(usersNotesDataAPIURL, loginViewModel.id, noteToBeDeleted, userObj)
            .then(data => {
                print(data);
                self.displayNotesData.splice(indexOfNoteToBeDeleted, 1);
                self.notesData.splice(indexOfNoteToBeDeleted, 1);
                noteFormHelper.innerHTML = `<div class="alert alert-success">DELETED SUCCESSFULLY!</div>`;
                print(self.displayNotesData().length)
            })
            .catch(err => {
                noteFormHelper.innerHTML = `<div class="alert alert-danger">ERROR! TRY AGAIN</div>`;
                print(err);
            })

    }
    let editIndex = -1;
    let editNote = '';
    self.setEditIndex = function () {
        editIndex = self.displayNotesData.indexOf(this);
        editNote = self.displayNotesData()[editIndex].note;
        document.getElementById("editNoteBody").innerHTML
            = `<textarea class="form-control" rows="5" cols="10" id = ta-${editIndex.toString()}>${self.displayNotesData()[editIndex].note}</textarea>`;
        
    }

    self.enableSaveChanges = ko.observable(false);
    self.saveEditedNoteData = function () {
        if (editIndex != -1) {
            let updatedNote = document.getElementById(`ta-${editIndex.toString()}`).value.toString();
            aes = new AESService(loginViewModel.key());
            let ct = aes.encrypt(updatedNote);
            let prevNote = self.notesData()[editIndex].note;
            let urlToUpdate = `${usersNotesDataAPIURL}?userid=${loginViewModel.id}&note=${prevNote}&updatedNote=${ct}`;
            print(urlToUpdate)
            putNoteData(urlToUpdate)
                .then(data => {
                    print(data);
                    let newdata = {
                        userid: loginViewModel.id,
                        note: ct
                    }
                    self.notesData.splice(editIndex, 1)
                    self.notesData.push(newdata)
                    newdata = {
                        userid: loginViewModel.id,
                        note: updatedNote
                    }
                    self.displayNotesData.splice(editIndex, 1)
                    self.displayNotesData.push(newdata);
                    document.getElementById("editHelper").innerHTML = `<div class="alert alert-success">UPDATED SUCCESSFULLY!</div>`;

                })
                .catch(err => {
                    print(err);
                })
            print(updatedNote)
            print(editNote)
        }
    }


}


document.getElementById("logout").addEventListener('click', function () {
    loginViewModel = null;
    notesDataViewModel = null;
    passwordDataViewModel = null;
    window.document.location.href = "../../Login/Index"
});


async function putNoteData(urlToUpdate){
    const response = await fetch(urlToUpdate, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json', 'charset': 'utf-8' }
    });
    const resData = await response.json();
    return resData;
}


async function putData(urlToUpdate, data) {
    const response = await fetch(urlToUpdate, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json', 'charset': 'utf-8' },
        body: JSON.stringify(data)
    });
    const resData = await response.json(data);
    return resData;
}