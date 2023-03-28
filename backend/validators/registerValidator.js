const Validator = require("validatorjs");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

Validator.register(
  "passCondition",
  (value) => passwordRegex.test(value),
  "password must contain at least one uppercase letter, one lowercase letter and one number"
);

const studentValidationRules = {
  firstName: "required|alpha",
  lastName: "required|alpha",
  email: "required|string|email",
  password: "required|string|min:8|passCondition",
  nick: "required|string",
  github: "required|url",
};

const teacherValidationRules = {
  firstName: "required|alpha",
  lastName: "required|alpha",
  email: "required|string|email",
  password: "required|string|min:8|passCondition",
};

module.exports.validateRegisterCredentials = (credentials, role) => {
  let validation;
  if (role === "student") {
    validation = new Validator(credentials, studentValidationRules);
  } else {
    validation = new Validator(credentials, teacherValidationRules);
  }
  const isValid = validation.passes();
  const message = !isValid
    ? Object.values(validation.errors.all())
    : "User credentials validation successful!";
  return {
    isValid: isValid,
    message: message,
  };
};
