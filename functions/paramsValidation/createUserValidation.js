const createUserValidation = ({ username, phoneNumber, password }) => {
  return username && phoneNumber && password
}

module.exports = createUserValidation
