import React from 'react';

export default function AuthLayout({ children, title, description }: { children: React.ReactNode, title: string, description: string }) {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden py-12 px-4">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">{title}</h1>
            <p className="text-text-secondary">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}