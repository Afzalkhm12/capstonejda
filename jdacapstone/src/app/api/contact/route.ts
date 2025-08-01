import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'afzalkhm1203@gmail.com', 
      subject: `Pesan dari GreenGive Contact Form: ${subject}`,
      html: `
        <h3>Pesan Baru dari Formulir Kontak GreenGive</h3>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subject}</p>
        <hr />
        <p><strong>Pesan:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Pesan berhasil dikirim!' }, { status: 200 });

  } catch (error) {
    console.error('Gagal mengirim email:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Gagal mengirim email.' }),
      { status: 500 }
    );
  }
}