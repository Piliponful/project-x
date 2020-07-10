import Twilio from 'twilio'

const sendVerificationCode = async (phoneNumber, verificationCode) => {
  const accountSid = 'ACff5c44f7a932acb3f57035070219a430'
  const authToken = '9e7d4ee2bd6ab1fd5157eac84d9097eb'

  const client = Twilio(accountSid, authToken)

  await client.messages
    .create({
      body: `Verification code: ${verificationCode}`,
      from: '+12392562369',
      to: phoneNumber
    })

  return verificationCode
}

export default sendVerificationCode
