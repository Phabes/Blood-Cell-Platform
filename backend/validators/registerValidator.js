const  Validator  = require('validatorjs');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

Validator.register('passCondition', value => passwordRegex.test(value),
    'password must contain at least one uppercase letter, one lowercase letter and one number');

const validationRules = {
    name: "required|alpha",
    surname: "required|alpha",
    email: "required|string|email",
    password: "required|string|min:8|passCondition",
    role: "required|string",
}

module.exports.validateRegisterCredentials = (credentials) => {
    const validation = new Validator(credentials, validationRules);
    const isValid = validation.passes();
    const message = !isValid ? Object.values(validation.errors.all()) : "User credentials validation successful!";
    return { 
        isValid: isValid, 
        message: message
    };
}