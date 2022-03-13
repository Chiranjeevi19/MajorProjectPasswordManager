class AESService {
    constructor(key) {
        this.key = key;
    }
    encrypt(plainText) {
        return CryptoJS.AES.encrypt(plainText.trim(), this.key.trim()).toString();
    }

    decrypt(cipherText) {
        return CryptoJS.AES.decrypt(cipherText.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8);
    }
}