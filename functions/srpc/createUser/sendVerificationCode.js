import Twilio from 'twilio'

const sendVerificationCode = async (phoneNumber, verificationCode) => {
  const accountSid = process.env.TWILLIO_ACCOUNT_SID
  const authToken = process.env.TWILLIO_AUTH_TOKEN

  const client = Twilio(accountSid, authToken)

  await client.messages
    .create({
      body: `Verification code: ${verificationCode}`,
      messagingServiceSid: 'MGe7d45bac30457944360f5584f121d07f',
      to: phoneNumber
    })

  return verificationCode
}

export default sendVerificationCode
