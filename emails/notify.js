const nodemailer = require('nodemailer');

async function sendEmail(subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ALERT_EMAIL,
    to: process.env.ALERT_EMAIL,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

module.exports = { sendEmail };
