const nodemailer = require('nodemailer');

async function sendNotification(email, subject, message) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NOTIFY_EMAIL,
            pass: process.env.NOTIFY_PASSWORD
        }
    });

    await transporter.sendMail({
        from: `"RoyalGPT Bot" <${process.env.NOTIFY_EMAIL}>`,
        to: email,
        subject: subject,
        text: message
    });
}

module.exports = { sendNotification };
