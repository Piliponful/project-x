const phone = require('phone')

const createUserValidation = ({ username, phoneNumber, password }) => {
  return username && phone(phoneNumber).length !== 0 && password
}

module.exports = createUserValidation
