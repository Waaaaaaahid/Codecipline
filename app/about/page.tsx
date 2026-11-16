import { Metadata } from 'next';
import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about the developer behind DevMarket.',
};

const skills = {
  Frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Redux'],
  Backend: ['Node.js', 'Express', 'Python', 'FastAPI', 'REST APIs', 'GraphQL'],
  Database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Prisma', 'Mongoose'],
  DevOps: ['Git', 'Docker', 'Vercel', 'AWS', 'CI/CD', 'Linux'],
};

const socials = [
  { href: 'https://github.com', icon: Github, label: 'GitHub', username: '@yourhandle' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', username: '@yourhandle' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn', username: 'Your Name' },
  { href: 'mailto:hello@devmarket.dev', icon: Mail, label: 'Email', username: 'hello@devmarket.dev' },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="section max-w-4xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            About Me
          </p>
          <h1 className="section-title mb-4">
            Hey, I&apos;m{' '}
            <span className="gradient-text">Alex</span> 👋
          </h1>
          <div className="space-y-4 text-muted text-lg leading-relaxed max-w-2xl">
            <p>
              I&apos;m a full-stack developer with 4+ years of experience building scalable web applications. 
              I love working at the intersection of design and engineering — crafting products that look good and perform even better.
            </p>
            <p>
              I started DevMarket to share the projects I&apos;ve built along my journey. Every project here is production-grade code 
              I&apos;ve personally written, tested, and refined. No tutorials, no copy-paste — real, working software.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll find me contributing to open source, writing technical articles, or exploring new frameworks.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Skills & Technologies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(skills).map(([category, techs]) => (
              <div key={category} className="card p-5">
                <h3 className="text-white font-semibold mb-4 text-sm">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Connect With Me</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socials.map(({ href, icon: Icon, label, username }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center gap-4 group hover:border-accent/40 hover:shadow-card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon size={20} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{label}</div>
                  <div className="text-muted text-xs">{username}</div>
                </div>
                <ExternalLink size={14} className="text-muted group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
