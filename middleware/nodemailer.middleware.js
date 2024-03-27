const nodemailer = require("nodemailer")
require('dotenv').config()
const sendVerificationEmail = async (email, _id) => {
    // email configuration
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });


    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 6px; border-radius: 10px; padding: 20px;">
                <h1 style="color: #333; text-align: center;">Email Verification</h1>
                <p style="text-align: center;">Hello ${email},</p>
                <p style="text-align: center;">We have recently received a request for sign up.</p>
                <p style="text-align: center;">Please verify this email within 5 minutes to sign up successfully.</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.DOMAIN}/verify-email/${_id}" style="background-color: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                </div>
                <p style="margin-top: 20px; font-size:14px; color:#838B8B; text-align: center;">Note: If you have not made this request, please ignore this email.</p>
                <p style="font-size: 12px; color: #999; text-align: center;">All rights reserved srkanyalcinkaya</p>
                <p style="font-size: 12px; color: #999; text-align: center;">Thank you</p>
            </div>
      `


    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendVerificationEmail
}