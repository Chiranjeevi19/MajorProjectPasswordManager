function print(text) {
    console.log(text);
}
let helper = document.getElementById('helper');
let usersAPIURL = 'https://localhost:44397/api/Users';
let saltsAPIURL = 'https://localhost:44397/api/Salts';

function SignupViewModel() {

    let self = this;
    self.createdAccount = ko.observable(false);
    print(this.createdAccount())
    self.email = ko.observable("").extend({
        required: true
    });
    self.password = ko.observable("").extend({
        required: true
    });
    self.createAccount = function () {
        let errors = ko.validation.group(self);
        if (errors().length > 0) {
            print("Complete the form properly");
            helper.innerHTML = `<div class="alert alert-danger">ENTER THE DETAILS PROPERLY!</div>`
            setInterval(function () {
                helper.innerHTML = `<div></div>`;
            }, 10000)

            errors.showAllMessages();
            return;
        }
        else {
            let salt = CryptoJS.lib.WordArray.random(256);;
            let temp = self.password() + salt;
            salt = salt.toString();
            print(salt);
            for (let i = 0; i < 20; i++) {
                temp = CryptoJS.SHA512(temp).toString();
            }
            let hash = temp;
            let userWebAPI = new UserDataManager();
            let saltWebAPI = new SaltsDataManager();
            let userData = {
                email: self.email(),
                pwdhash: hash
            }
            let saltData = {
                salt1: salt
            }
            print(userData)
            print(saltData)
            userWebAPI.postUser(usersAPIURL, userData)
                .then(data => {
                    if (data.Message == "User already present") {
                        self.email("");
                        self.password("");
                        helper.innerHTML = `<div class="alert alert-danger">USER ALREADY PRESENT!</div>`
                        setInterval(function () {
                            helper.innerHTML = `<div></div>`;
                        }, 20000)
                    }
                    else {
                        print(data)
                        self.reset()
                        self.createdAccount(true)
                    }
                })
                .catch(err => print(err));
            saltWebAPI.postSalt(saltsAPIURL, saltData)
                .then(data => print(data))
                .catch(err => print(err));


            /* let initKey = self.email() + '.' + self.password();
            let key= CryptoJS.PBKDF2(initKey, '', {
                keySize: 256,
                iterations: 100
            }).toString();
            let pt = 'Chiroo';
            let aesObj = new AESService(key);
            let ct = aesObj.encrypt(pt);
            print(ct.toString());
            pt = aesObj.decrypt(ct);
            print(pt); */
            
        }
    }
    self.reset = function () {
        self.email("");
        self.password("");
        helper.innerHTML = `<div class="alert alert-success">ACCOUNT CREATED SUCCESSFULLY! GO TO <a class="nav-link" href="/Login/Index">LOGIN</a></div>`
    }

}

ko.applyBindings(new SignupViewModel())