import nodemailer from 'nodemailer';

const smtpOptions = {
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpOptions);

interface DonationDetails {
  foodType: string;
  quantity: string;
  address: string;
  expiryDate: Date;
}

interface UserDetails {
  name?: string | null;
  email?: string | null;
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verifikasi Akun Anda untuk GreenGive',
    html: `
      <h1>Selamat Datang di GreenGive!</h1>
      <p>Terima kasih telah mendaftar. Silakan klik link di bawah ini untuk memverifikasi alamat email Anda:</p>
      <a href="${verificationLink}" style="background-color: #6B8E23; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verifikasi Akun</a>
      <p>Link ini akan kedaluwarsa dalam 24 jam.</p>
      <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Password Anda untuk GreenGive',
    html: `
      <h1>Reset Password Anda</h1>
      <p>Klik link di bawah ini untuk mereset password Anda:</p>
      <a href="${resetLink}" style="background-color: #6B8E23; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
    `,
  });
};


export const sendDonationConfirmationEmail = async (userEmail: string, userName: string, donationDetails: DonationDetails) => {
  const mealsProvided = (parseInt(donationDetails.quantity) || 1) * 15;
  const co2Saved = (parseInt(donationDetails.quantity) || 1) * 2.5;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
      <h1 style="color: #6B8E23; text-align: center;">🌱 Terima Kasih Telah Berdonasi, ${userName}!</h1>
      <p>Donasi Anda telah kami terima dan sedang dalam proses. Kami sangat menghargai kemurahan hati Anda.</p>
      <p><b>Tim kami akan segera menghubungi Anda</b> untuk mengatur jadwal penjemputan di alamat yang telah Anda berikan:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Jenis Makanan:</strong> ${donationDetails.foodType}</p>
        <p><strong>Kuantitas:</strong> ${donationDetails.quantity}</p>
        <p><strong>Alamat Penjemputan:</strong> ${donationDetails.address}</p>
      </div>
      <h2 style="color: #6B8E23;">Dampak Donasi Anda:</h2>
      <p>Dengan donasi ini, Anda telah membantu menyediakan sekitar <strong>${mealsProvided} porsi makanan</strong> dan menyelamatkan sekitar <strong>${co2Saved.toFixed(1)} kg emisi CO2</strong>. Tindakan Anda membawa perubahan nyata!</p>
      <p>Terima kasih telah menjadi bagian dari solusi.</p>
      <p>Salam hangat,<br><strong>Tim GreenGive</strong></p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: '✅ Konfirmasi Donasi Anda di GreenGive',
    html: emailHtml,
  });
};


export const sendDonationNotificationEmail = async (adminEmail: string, donationDetails: DonationDetails, user: UserDetails) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Donasi Baru Masuk!</h2>
      <p>Ada donasi baru yang perlu diatur untuk penjemputan. Berikut detailnya:</p>
      <ul>
        <li><strong>Nama Donatur:</strong> ${user.name}</li>
        <li><strong>Email Donatur:</strong> ${user.email}</li>
        <li><strong>Jenis Makanan:</strong> ${donationDetails.foodType}</li>
        <li><strong>Kuantitas:</strong> ${donationDetails.quantity}</li>
        <li><strong>Tanggal Kedaluwarsa:</strong> ${new Date(donationDetails.expiryDate).toLocaleDateString('id-ID')}</li>
        <li><strong>Alamat Penjemputan:</strong> ${donationDetails.address}</li>
      </ul>
      <p>Mohon segera hubungi donatur untuk menjadwalkan penjemputan.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: adminEmail,
    subject: `📢 Notifikasi Donasi Baru dari ${user.name}`,
    html: emailHtml,
  });
};
