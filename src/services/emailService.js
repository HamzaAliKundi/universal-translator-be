// services/emailService.ts

import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: {
      name: "Universal Translator",
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: "Welcome to Universal Translator - Please Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Universal Translator!</h1>
            </div>
            <div class="content">
              <h2>Thank you for joining Universal Translator</h2>
              <p>We're excited to have you on board! Universal Translator helps you break language barriers by:</p>
              <ul>
                <li>Extracting text from images</li>
                <li>Translating content into multiple languages</li>
                <li>Providing quick and accurate translations</li>
              </ul>
              <p>To start using our services, please verify your email address by clicking the button below:</p>
              <center>
                <a href="${process.env.BASE_URL}/api/auth/verify/${token}" class="button">Verify Email Address</a>
              </center>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p>${process.env.BASE_URL}/api/auth/verify/${token}</p>
              <p>This link will expire in 24 hours for security reasons.</p>
            </div>
            <div class="footer">
              <p>This email was sent by Universal Translator. If you didn't create this account, please ignore this email.</p>
              <p>© ${new Date().getFullYear()} Universal Translator. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
