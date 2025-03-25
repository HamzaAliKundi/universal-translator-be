// services/emailService.ts

import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password (or App password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${process.env.BASE_URL}/api/auth/verify/${token}">Verify Email</a>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
