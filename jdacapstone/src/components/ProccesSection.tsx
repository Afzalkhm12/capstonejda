export default function ProcessSection() {
    return (
        <section className="process-section">
            <div className="container">
                <h2 className="section-title">How It Works</h2>
                <div className="process-grid">
                    <div className="process-step">
                        <div className="step-number">1</div>
                        <h3>Register Food</h3>
                        <p>Fill out our simple form with details about your food donation</p>
                    </div>
                    <div className="process-step">
                        <div className="step-number">2</div>
                        <h3>Schedule Pickup</h3>
                        <p>Choose a convenient time for our team to collect your donation</p>
                    </div>
                    <div className="process-step">
                        <div className="step-number">3</div>
                        <h3>Make Impact</h3>
                        <p>Track how your donation helps feed families in need</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
