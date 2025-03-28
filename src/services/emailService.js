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
            .button { 
              background-color: #4A90E2; 
              color: white !important; 
              padding: 12px 25px; 
              text-decoration: none; 
              border-radius: 4px; 
              display: inline-block; 
              margin: 20px 0; 
              cursor: pointer;
              font-family: Arial, sans-serif;
              font-size: 16px;
              border: none;
              text-align: center;
            }
            .verification-text {
              color: #333333;
              font-size: 14px;
              margin-bottom: 10px;
            }
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
              <p class="verification-text">To start using our services, please verify your email address:</p>
              <center>
                <a href="${process.env.BASE_URL}/api/auth/verify/${token}" class="button">Click here to verify your email</a>
              </center>
              <p>This verification link will expire in 24 hours.</p>
              <p>If you did not create an account with Universal Translator, please disregard this email.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Universal Translator.</p>
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
