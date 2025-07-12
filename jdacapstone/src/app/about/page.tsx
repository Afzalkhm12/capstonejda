'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Story {
    id: number;
    title: string;
    content: string;
    image: string;
}

const mockStories: Story[] = [
    { id: 1, title: "Local Bakery Reduces Waste", content: "A local bakery now donates their unsold bread and pastries daily, providing fresh breakfast for a nearby shelter.", image: "https://images.unsplash.com/photo-1563502913-695790324152?w=300&h=200&fit=crop" },
    { id: 2, title: "Catering Event Feeds Families", content: "After a large corporate event, the leftover catering provided over 200 meals to families in the community.", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop" },
    { id: 3, title: "Grocery Store's Fresh Produce Program", content: "A partnership with a major grocery store chain rescues fresh produce that is close to its sell-by date, distributing it to food banks.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop" },
];

export default function AboutPage() {
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
       
        setStories(mockStories);
    }, []);

    return (
        <div className="container">
            <div className="page-header">
                <h1>About GreenGive</h1>
                <p>Connecting surplus food with those who need it most</p>
            </div>

            <section className="mission-section">
                <div className="mission-content glass-card">
                    <h2>Our Mission</h2>
                    <p>At GreenGive, we believe that no food should go to waste while people go hungry. Our mission is to create a sustainable food system by connecting surplus food with those who need it most, while raising awareness about the environmental impact of food waste.</p>
                    
                    <div className="mission-stats">
                        <div className="mission-stat">
                            <h3>The Problem</h3>
                            <p>931 million tons of food is wasted globally each year, contributing to 8-10% of global carbon emissions.</p>
                        </div>
                        <div className="mission-stat">
                            <h3>Our Solution</h3>
                            <p>We connect restaurants, grocery stores, and households to reduce waste and support communities.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="impact-stories-section">
                <h2 className="section-title">Impact Stories</h2>
                <div className="stories-grid" id="impact-stories">
                    {stories.map(story => (
                        <div key={story.id} className="story-card glass-card">
                            <Image src={story.image} alt={story.title} width={300} height={200} style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }} />
                            <h3>{story.title}</h3>
                            <p>{story.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
