import nodemailer from 'nodemailer';

const smtpOptions = {
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER || 'example@gmail.com',
    pass: process.env.EMAIL_SERVER_PASSWORD || 'password',
  },
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport(smtpOptions);

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Password Anda untuk GreenGive',
    html: `
      <h1>Reset Password Anda</h1>
      <p>Klik link di bawah ini untuk mereset password Anda:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
      <p>Jika Anda tidak meminta reset ini, abaikan email ini.</p>
    `,
  });
};
