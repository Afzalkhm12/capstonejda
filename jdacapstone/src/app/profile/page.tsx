'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Edit, KeyRound } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
      if (session?.user?.name) {
          setNewName(session.user.name);
      }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const promise = fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memperbarui profil.');
      }
      await update({ user: { name: newName } });
      return { name: newName };
    });

    toast.promise(promise, {
      loading: 'Menyimpan perubahan...',
      success: () => {
        setIsEditProfileOpen(false);
        return 'Profil berhasil diperbarui!';
      },
      error: (err) => err.message,
      finally: () => setIsSubmitting(false),
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const promise = fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
    }).then(async (res) => {
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Gagal mengubah password.');
        }
        return res.json();
    });

    toast.promise(promise, {
        loading: 'Mengubah password...',
        success: () => {
            setIsChangePasswordOpen(false);
            setOldPassword('');
            setNewPassword('');
            return 'Password berhasil diubah!';
        },
        error: (err) => err.message,
        finally: () => setIsSubmitting(false),
    });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <p className="container text-center py-12">Anda harus login untuk melihat halaman ini.</p>;
  }


  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 py-12 min-h-screen">
      <div className="container max-w-4xl mx-auto space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-6">
              <Image
                src={session.user?.image || `https://avatar.vercel.sh/${session.user?.email}.png`}
                alt="User Avatar"
                width={80}
                height={80}
                className="rounded-full border-2 border-white shadow-md"
              />
              <div>
                <CardTitle className="text-2xl font-bold">{session.user?.name}</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-1">
                  {session.user?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>Detail informasi pribadi Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                        <p>{session.user?.name}</p>
                    </div>
                     <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Ubah</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Ubah Nama</DialogTitle></DialogHeader>
                          <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                               <Label htmlFor="name">Nama Lengkap</Label>
                               <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Pengaturan Akun</CardTitle>
                <CardDescription>Ubah password Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">••••••••</p>
                    </div>
                     <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="sm"><KeyRound className="w-4 h-4 mr-2" /> Ubah Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Ubah Password</DialogTitle></DialogHeader>
                          <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <Label htmlFor="oldPassword">Password Lama</Label>
                                <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                            </div>
                             <div>
                                <Label htmlFor="newPassword">Password Baru</Label>
                                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ubah Password
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}