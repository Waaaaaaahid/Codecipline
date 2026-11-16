import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Orange glow blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="section relative z-10 text-center py-20">
        {/* Pre-heading badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          Available for new projects
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight animate-slide-up">
          Building{' '}
          <span className="gradient-text">Digital</span>
          <br />
          Experiences.
        </h1>

        {/* Subheading */}
        <p className="text-muted text-base sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Full-stack developer crafting clean, production-ready web applications.
          Browse my projects and{' '}
          <span className="text-muted-light font-medium">purchase the source code</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col sm:w-auto sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up">
          <Link href="/projects" className="btn-primary text-base px-8 py-4 group">
            Explore Projects
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link href="/contact" className="btn-secondary text-base px-8 py-4">
            Contact Me
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 pt-12 border-t border-border/50">
          {[
            { label: 'Projects Built', value: '20+' },
            { label: 'Happy Clients', value: '15+' },
            { label: 'Technologies', value: '12+' },
            { label: 'Years Experience', value: '4+' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold gradient-text stat-number">{value}</div>
              <div className="text-muted text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
