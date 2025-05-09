// backend/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use "smtp" config for custom domains
  auth: {
    user: 'abechehrah@gmail.com',
    pass: 'ukeafxfygturdudu',
},
});

const sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: 'abechehrah@gmail.com',
    to: email,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${code}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;