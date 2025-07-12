'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Donation {
    id: number;
    foodType: string;
    quantity: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Cancelled';
}

interface User {
    name: string;
    email: string;
    phone: string;
    address: string;
    profilePicture: string;
}

const tabs = [
    { id: 'donations', label: 'My Donations' },
    { id: 'settings', label: 'Account Settings' },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('donations'); 

 
    const mockDonations: Donation[] = [
        { id: 1, foodType: 'Fresh Produce', quantity: '20 lbs', date: '2025-06-26', status: 'Completed' },
        { id: 2, foodType: 'Prepared Meals', quantity: '30 portions', date: '2025-06-20', status: 'Completed' },
        { id: 3, foodType: 'Packaged Goods', quantity: '50 items', date: '2025-06-15', status: 'Pending' },
        { id: 4, foodType: 'Bakery Items', quantity: '15 items', date: '2025-06-10', status: 'Completed' },
    ];

   
    const mockUser: User = {
        name: 'Sarah Johnson',
        email: 'sarah@gmail.com',
        phone: '+62 812-3456-7890',
        address: 'Jakarta, Indonesia',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cfd2feae?w=200&h=200&fit=crop&q=80',
    };

    const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
     
        alert('Settings saved!');
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Your Impact Profile</h1>
                <p>Track your contribution to fighting food waste</p>
            </div>

            <div className="profile-dashboard">
                <div className="profile-header glass-card">
                    <div className="profile-summary">
                        <div className="profile-avatar">
                            <Image
                                src={mockUser.profilePicture}
                                alt={`${mockUser.name}'s profile picture`}
                                width={120}
                                height={120}
                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="profile-details">
                            <h2>{mockUser.name}</h2>
                        <p>{mockUser.email}</p>
                        </div>
                    </div>
                    <ul className="profile-tabs">
                        {tabs.map(tab => (
                            <li key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="profile-content">
                    {activeTab === 'donations' && (
                        <div className="donations-section glass-card">
                            <h2>My Donations</h2>
                            <table className="donations-table">
                                <thead>
                                    <tr>
                                        <th>Food Type</th>
                                        <th>Quantity</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockDonations.map(donation => (
                                        <tr key={donation.id}>
                                            <td>{donation.foodType}</td>
                                            <td>{donation.quantity}</td>
                                            <td>{donation.date}</td>
                                            <td><span className={`donation-status status-${donation.status.toLowerCase()}`}>{donation.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="settings-section glass-card">
                            <h2>Account Settings</h2>
                            <form id="settings-form" className="settings-form" onSubmit={handleSaveSettings}>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" defaultValue={mockUser.name} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" defaultValue={mockUser.email} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" defaultValue={mockUser.phone} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <textarea id="address" name="address" defaultValue={mockUser.address} className="form-control" rows={3}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary glass-btn">
                                    <span>Save Changes</span>
                                    <div className="btn-glow"></div>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

    