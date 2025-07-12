'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function HeroSection() {

    useEffect(() => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; 

        counters.forEach(counter => {
            if (counter instanceof HTMLElement) {
                const updateCount = () => {
                    const target = Number(counter.dataset.count) || 0;
                    const count = Number(counter.innerText) || 0;
                    const inc = target / speed;


                if (count < target) {
                        counter.innerText = String(Math.ceil(count + inc));
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCount();
            }
        });
    }, []);

    return (
        <section className="hero">
            <div className="hero-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">Save Food, <br /><span className="text-gradient">Save Planet</span></h1>
                        <p className="hero-subtitle">Join our mission to reduce food waste and help communities in need. Every donation makes a difference.</p>
                        <div className="hero-buttons">
                            <Link href="/donate" className="btn btn-primary glass-btn"><span>Donate Food Now</span><div className="btn-glow"></div></Link>
                            <Link href="/about" className="btn btn-secondary glass-btn"><span>Learn More</span></Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number" data-count="1250">0</div>
                                <div className="stat-label">Total Donations</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" data-count="3750">0</div>
                                <div className="stat-label">Meals Provided</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" data-count="450">0</div>
                                <div className="stat-label">Active Donors</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
