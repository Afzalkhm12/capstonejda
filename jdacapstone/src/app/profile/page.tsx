'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function ProfilePage() {
  // Gunakan hook useSession untuk mendapatkan data pengguna yang sedang login
  const { data: session, status } = useSession();

  // Tampilkan pesan loading saat sesi sedang diperiksa
  if (status === "loading") {
    return <p className="container text-center py-12">Memuat...</p>;
  }

  // Middleware seharusnya sudah mengalihkan pengguna, tapi ini sebagai pengaman tambahan
  if (status === "unauthenticated") {
    return <p className="container text-center py-12">Anda harus login untuk melihat halaman ini.</p>;
  }

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Profil Pengguna</CardTitle>
          <CardDescription>
            Ini adalah informasi akun Anda yang sedang login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Image
              src={session?.user?.image || `https://avatar.vercel.sh/${session?.user?.email}.png`}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
              <p className="text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold">Detail Sesi:</h3>
            <pre className="mt-2 p-4 bg-muted rounded-md text-sm overflow-x-auto">
              <code>{JSON.stringify(session, null, 2)}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
