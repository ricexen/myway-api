const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.university = !isEmpty(data.university) ? data.university : "";
  data.birthdate = !isEmpty(data.birthdate) ? data.birthdate : "";


  if (!Validator.isLength(data.firstname, { min: 2, max: 30 })) {
    errors.firstname = "Tu nombre debe tener entre 2 y 30 caracteres";
  }
  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = "El nombre es obligatorio";
  }
  if (!Validator.isLength(data.lastname, { min: 2, max: 30 })) {
    errors.lastname = "Tu apellido debe tener entre 2 y 30 caracteres";
  }
  if (Validator.isEmpty(data.lastname)) {
    errors.lastname = "El apellido es obligatorio";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email no valido";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "El Email es obligatorio";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "La contraseña es obligatorio";
  }
  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = "La contraseña tiene que tener entre 8 y 30 caracteres";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Se require la confirmación de la contraseña";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "La contraseña y la confirmación no coinciden";
  }
  if (!Validator.isLength(data.university, { max: 80 })) {
    errors.university =
      "La universidad no tiene que tener mas de 80 caracteres";
  }
  if (
    !Validator.isEmpty(data.birthdate) &&
    !Validator.isISO8601(data.birthdate)
  ) {
    errors.birthdate = "La fecha de cumpleaños no tiene el formato correcto";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
