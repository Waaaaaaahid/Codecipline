import Link from 'next/link';
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:hello@devmarket.dev', icon: Mail, label: 'Email' },
];

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Code2 size={18} className="text-slate-900" />
              </div>
              <span className="font-bold text-slate-900 text-lg">
                Dev<span className="text-accent">Market</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Premium source code marketplace. Explore real-world projects and purchase clean, production-ready code.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-surface border border-slate-200 flex items-center justify-center
                             text-muted hover:text-accent hover:border-accent/50 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} DevMarket. All rights reserved.
          </p>
          <p className="text-muted text-sm">
            Built with <span className="text-accent">♥</span> using Next.js & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
