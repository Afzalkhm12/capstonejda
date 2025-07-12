'use client';

import { useState } from 'react';

interface DonationFormData {
    donorName: string;
    foodType: string;
    quantity: string;
    expiryDate: string;
    pickupTime: string;
    address: string;
    notes: string;
}

export default function DonatePage() {
    const [formData, setFormData] = useState<DonationFormData>({
        donorName: '',
        foodType: '',
        quantity: '',
        expiryDate: '',
        pickupTime: '',
        address: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Donation Submitted:', formData);
        alert('Thank you for your donation!');
        e.currentTarget.reset();
        setFormData({ donorName: '', foodType: '', quantity: '', expiryDate: '', pickupTime: '', address: '', notes: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
    <div className="container">
            <div className="page-header">
                <h1>Donate Food</h1>
                <p>Help us reduce food waste and feed communities in need</p>
            </div>

            <div className="donate-content">
                <div className="donate-form-section">
                    <div className="form-container glass-card">
                        <h2>Food Donation Form</h2>
                        <form id="donation-form" className="donation-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="donorName" className="form-label">Donor Name/Organization</label>
                                <input type="text" id="donorName" name="donorName" value={formData.donorName} className="form-control" required onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="foodType" className="form-label">Food Type</label>
                                <select id="foodType" name="foodType" value={formData.foodType} className="form-control" required onChange={handleChange}>
                                    <option value="">Select food type</option>
                                    <option value="fresh-produce">Fresh Produce</option>
                                    <option value="prepared-meals">Prepared Meals</option>
                                    <option value="packaged-goods">Packaged Goods</option>
                                    <option value="dairy">Dairy Products</option>
                                    <option value="bakery">Bakery Items</option>
                                </select>
                            </div>
                            <div className="form-group"><label htmlFor="quantity" className="form-label">Quantity</label><input type="text" id="quantity" name="quantity" value={formData.quantity} className="form-control" placeholder="e.g., 25 lbs, 50 portions" required onChange={handleChange} /></div>
                            <div className="form-group"><label htmlFor="expiryDate" className="form-label">Expiry Date</label><input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} className="form-control" required onChange={handleChange} /></div>
                            <div className="form-group"><label htmlFor="pickupTime" className="form-label">Preferred Pickup Time</label><select id="pickupTime" name="pickupTime" value={formData.pickupTime} className="form-control" required onChange={handleChange}><option value="">Select time</option><option value="morning">Morning (8AM - 12PM)</option><option value="afternoon">Afternoon (12PM - 5PM)</option><option value="evening">Evening (5PM - 8PM)</option></select></div>
                            <div className="form-group"><label htmlFor="address" className="form-label">Pickup Address</label><textarea id="address" name="address" value={formData.address} className="form-control" rows={3} required onChange={handleChange}></textarea></div>
                            <div className="form-group"><label htmlFor="notes" className="form-label">Additional Notes</label><textarea id="notes" name="notes" value={formData.notes} className="form-control" rows={2} onChange={handleChange}></textarea></div>
                            <button type="submit" className="btn btn-primary glass-btn"><span>Submit Donation</span><div className="btn-glow"></div></button>
                        </form>
                    </div>

        
                </div>
                <div className="donation-info">
                    <div className="info-card glass-card">
                        <h3>Food Safety Guidelines</h3>
                        <ul>
                            <li>Food should be within expiry date</li>
                            <li>Prepared meals should be properly stored</li>
                            <li>Fresh produce should be in good condition</li>
                            <li>Packaged goods should be unopened</li>
                        </ul>
                    </div>
                    <div className="info-card glass-card">
                        <h3>Donation Impact</h3>
                        <p>Your donation will help:</p>
                        <ul><li>Feed families in need</li><li>Reduce food waste</li><li>Lower carbon emissions</li><li>Support local communities</li></ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

        