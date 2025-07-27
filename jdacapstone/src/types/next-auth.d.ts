import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Menggunakan module augmentation untuk memperluas tipe bawaan NextAuth

declare module 'next-auth' {
  /**
   * Tipe ini mendefinisikan properti yang akan ada di objek Session,
   * yang dapat diakses di sisi klien melalui `useSession()` atau `getSession()`.
   */
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user']; // Mewarisi properti default seperti name, email, image
  }

  /**
   * Tipe ini mendefinisikan properti yang dikembalikan oleh callback `authorize`
   * dan digunakan dalam callback `jwt`.
   */
  interface User extends DefaultUser {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Tipe ini mendefinisikan properti yang akan ada di dalam JSON Web Token (JWT).
   */
  interface JWT {
    id: string;
    role?: string;
  }
}
