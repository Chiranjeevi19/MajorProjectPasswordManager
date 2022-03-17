// Getting the DOM Eleements
const resultDOM = document.getElementById('result');
const lengthDOM = document.getElementById('length');
const uppercaseDOM = document.getElementById('uppercase');
const numbersDOM = document.getElementById('numbers');
const symbolsDOM = document.getElementById('symbols');
const generatebtn = document.getElementById('generate');

// Generating Character Codes For The Application 
const UPPERCASE_CODES = arrayFromLowToHigh(65, 90);
const LOWERCASE_CODES = arrayFromLowToHigh(97, 122);
const NUMBER_CODES = arrayFromLowToHigh(48, 57);
const SYMBOL_CODES = arrayFromLowToHigh(33, 47)
    .concat(arrayFromLowToHigh(58, 64))
    .concat(arrayFromLowToHigh(91, 96))
    .concat(arrayFromLowToHigh(123, 126));


// Checking the options that are selected and setting the password
generatebtn.addEventListener('click', (e) => {
    const characterAmount = lengthDOM.value;
    const includeUppercase = uppercaseDOM.checked;
    const includeNumbers = numbersDOM.checked;
    const includeSymbols = symbolsDOM.checked;
    const password = generatePassword(
        characterAmount,
        includeUppercase,
        includeNumbers,
        includeSymbols
    );
    e.preventDefault();
    resultDOM.value = password;
    
});

// The Password Generating Function
let generatePassword = (
    characterAmount,
    includeUppercase,
    includeNumbers,
    includeSymbols
) => {
    let charCodes = LOWERCASE_CODES;
    if (includeUppercase) charCodes = charCodes.concat(UPPERCASE_CODES);
    if (includeSymbols) charCodes = charCodes.concat(SYMBOL_CODES);
    if (includeNumbers) charCodes = charCodes.concat(NUMBER_CODES);
    const passwordCharacters = [];
    for (let i = 0; i < characterAmount; i++) {
        const characterCode =
            charCodes[Math.floor(Math.random() * charCodes.length)];
        passwordCharacters.push(String.fromCharCode(characterCode));
    }
    return passwordCharacters.join('');
};

// The Character Code Generating Function
function arrayFromLowToHigh(low, high) {
    const array = [];
    for (let i = low; i <= high; i++) {
        array.push(i);
    }
    return array;
}