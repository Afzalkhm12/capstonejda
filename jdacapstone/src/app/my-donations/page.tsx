'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Donation {
  id: number;
  foodType: string;
  quantity: string;
  expiryDate: string;
  address: string;
  status: string;
}

export default function MyDonationsPage() {
  const { status } = useSession();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/donations')
        .then(res => res.json())
        .then(data => {
          setDonations(data);
          setIsLoading(false);
        });
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status]);

  if (status === 'loading' || isLoading) {
    return <div className="container text-center mt-lg">Loading your donations...</div>;
  }
  
  if (status === 'unauthenticated') {
     return <div className="container text-center mt-lg">Please log in to see your donations.</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Donations</h1>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.foodType}</TableCell>
                    <TableCell>{donation.quantity}</TableCell>
                    <TableCell>{new Date(donation.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>{donation.status}</TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    You haven&apos;t made any donations yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}