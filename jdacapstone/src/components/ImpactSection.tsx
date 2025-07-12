'use client';

import { useEffect } from 'react';


export default function ImpactSection() {
    useEffect(() => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            if (bar instanceof HTMLElement) {
                const progress = bar.dataset.progress || '0';
                bar.style.width = `${progress}%`;
            }
        });
    }, []);

    return (
        <section className="impact-section">
            <div className="container">
                <h2 className="section-title">Our Impact</h2>
                <div className="impact-grid">
                    <div className="impact-card glass-card">
                        <div className="impact-icon">🍽️</div>
                        <h3>3,750</h3>
                        <p>Meals Provided</p>
                        <div className="impact-bar"><div className="progress-bar" data-progress="85"></div></div>
                    </div>
                    <div className="impact-card glass-card">
                        <div className="impact-icon">🌍</div>
                        <h3>2.5 tons</h3>
                        <p>CO2 Saved</p>
                        <div className="impact-bar"><div className="progress-bar" data-progress="70"></div></div>
                    </div>
                    <div className="impact-card glass-card">
                        <div className="impact-icon">♻️</div>
                        <h3>15,000 lbs</h3>
                        <p>Waste Reduced</p>
                        <div className="impact-bar"><div className="progress-bar" data-progress="92"></div></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
