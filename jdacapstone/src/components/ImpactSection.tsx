'use client';

import { useEffect, useState } from 'react';

interface ImpactStats {
    totalDonations: number;
    mealsProvided: number;
    co2Saved: number;
}

export default function ImpactSection() {
    const [stats, setStats] = useState<ImpactStats | null>(null);

    useEffect(() => {
        async function fetchImpactStats() {
            try {
                const res = await fetch('/api/impact-stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Gagal memuat statistik:', error);
            }
        }
        fetchImpactStats();
    }, []);
    useEffect(() => {
        if (!stats) return;

        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        counters.forEach(counter => {
            if (counter instanceof HTMLElement) {
                const target = Number(counter.dataset.count) || 0;
                let count = 0;
                const inc = target / speed;

                const updateCount = () => {
                    if (count < target) {
                        count += inc;
                        counter.innerText = Math.ceil(count).toLocaleString('id-ID');
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target.toLocaleString('id-ID');
                    }
                };
                updateCount();
            }
        });
    }, [stats]);

    return (
        <section className="impact-section">
            <div className="container">
                <h2 className="section-title">Our Impact</h2>
                <div className="impact-grid">
                    <div className="impact-card glass-card">
                        <div className="impact-icon">🍽️</div>
                        <h3 className="stat-number" data-count={stats?.mealsProvided || 0}>0</h3>
                        <p>Meals Provided</p>
                    </div>
                    <div className="impact-card glass-card">
                        <div className="impact-icon">🌍</div>
                        <h3 className="stat-number" data-count={stats?.co2Saved || 0}>0</h3>
                        <p>Kg CO2 Saved</p>
                    </div>
                    <div className="impact-card glass-card">
                        <div className="impact-icon">♻️</div>
                        <h3 className="stat-number" data-count={stats?.totalDonations || 0}>0</h3>
                        <p>Food Rescued</p>
                    </div>
                </div>
            </div>
        </section>
    );
}