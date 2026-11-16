import Link from 'next/link';
import { Code2, Database, Globe, Server, ArrowRight } from 'lucide-react';

const skills = [
  { icon: Globe, label: 'Frontend', techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { icon: Server, label: 'Backend', techs: ['Node.js', 'Python', 'REST APIs', 'GraphQL'] },
  { icon: Database, label: 'Database', techs: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma'] },
  { icon: Code2, label: 'Tools', techs: ['Git', 'Docker', 'Vercel', 'AWS'] },
];

export default function AboutSnippet() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
              About Me
            </p>
            <h2 className="section-title mb-4">
              Passionate about{' '}
              <span className="gradient-text">Clean Code</span>
            </h2>
            <div className="space-y-4 text-muted text-base leading-relaxed">
              <p>
                I&apos;m a full-stack developer with 4+ years of experience building scalable web applications. 
                I specialize in Next.js, TypeScript, and modern backend technologies.
              </p>
              <p>
                Every project I sell here is production-grade code I&apos;ve personally built and refined. 
                You get well-documented, maintainable code — not spaghetti.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <Link href="/about" className="btn-primary group">
                More About Me
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                GitHub Profile
              </a>
            </div>
          </div>

          {/* Right: Skills grid */}
          <div className="grid grid-cols-2 gap-4">
            {skills.map(({ icon: Icon, label, techs }) => (
              <div key={label} className="card p-5 hover:border-accent/40">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm">{label}</h3>
                <ul className="space-y-1">
                  {techs.map((tech) => (
                    <li key={tech} className="text-muted text-xs">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
