const verifyUserValidation = ({ jwt, verificationCode }) => {
  return jwt & verificationCode
}

module.exports = verifyUserValidation
