import { PrismaClient } from '@prisma/client';

// Deklarasikan variabel global untuk menyimpan instance PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Buat instance PrismaClient.
// Di lingkungan pengembangan, kita menggunakan variabel global untuk mencegah
// pembuatan instance baru setiap kali ada hot-reload, yang bisa menghabiskan koneksi database.
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;