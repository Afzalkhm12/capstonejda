import Link from 'next/link';

export default function CtaSection() {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content glass-card">
                    <h2>Ready to Make a Difference?</h2>
                    <p>Join thousands of donors who are helping reduce food waste and feed communities.</p>
                    <Link href="/donate" className="btn btn-primary glass-btn"><span>Start Donating</span><div className="btn-glow"></div></Link>
                </div>
            </div>
        </section>
    );
}
