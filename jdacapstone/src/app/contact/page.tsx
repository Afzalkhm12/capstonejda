'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const promise = fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        toast.promise(promise, {
            loading: 'Mengirim pesan...',
            success: (res) => {
                if (!res.ok) throw new Error('Gagal mengirim pesan.');
                setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
                return 'Pesan Anda berhasil dikirim!';
            },
            error: 'Gagal mengirim pesan. Silakan coba lagi.',
        });

        setIsLoading(false);
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Get In Touch</h1>
                <p>Have questions or want to partner with us?</p>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <div className="info-card glass-card">
                        <h3>Contact Information</h3>
                        <div className="contact-item">
                            <strong>Email:</strong> hello@greengive.org
                        </div>
                        <div className="contact-item">
                            <strong>Phone:</strong> +62 812-3456-7890
                        </div>
                        <div className="contact-item">
                            <strong>Address:</strong> Jakarta Indonesia
                        </div>
                    </div>
                </div>

                <div className="contact-form-section">
                    <form className="contact-form glass-card" id="contact-form" onSubmit={handleSubmit}>
                        <h3>Send us a Message</h3>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} className="form-control" required onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} className="form-control" required onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject" className="form-label">Subject</label>
                            <select id="subject" name="subject" value={formData.subject} className="form-control" required onChange={handleChange} disabled={isLoading}>
                                <option value="">Select a topic</option>
                                <option value="partnership">Partnership Opportunity</option>
                                <option value="donation">Food Donation Inquiry</option>
                                <option value="support">Customer Support</option>
                                <option value="general">General Inquiry</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea id="message" name="message" value={formData.message} className="form-control" rows={5} required onChange={handleChange} disabled={isLoading}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary glass-btn" disabled={isLoading}>
                            <span>{isLoading ? 'Mengirim...' : 'Send Message'}</span>
                            <div className="btn-glow"></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}