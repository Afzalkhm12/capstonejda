const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = (query) => new Promise((resolve) => rl.question(query, resolve));
async function main() {
  console.log('--- Buat Akun Admin Baru ---');

  try {
    const email = await question('Masukkan email admin:');
    const name = await question('Masukkan nama admin: ');
    const password = await question('Masukkan password admin: ');

    if (!email || !password || !name) {
      console.error('Error: Email, nama, dan password tidak boleh kosong.');
      return;
    }
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.error(`Error: Admin dengan email "${email}" sudah ada.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log(`✅ Akun admin berhasil dibuat untuk: ${newAdmin.email}`);

  } catch (error) {
    console.error('Gagal membuat akun admin:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}
main();
