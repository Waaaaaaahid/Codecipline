import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch. Available for freelance projects and collaborations.',
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="section max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Get In Touch
          </p>
          <h1 className="section-title mb-4">
            Let&apos;s <span className="gradient-text">Talk</span>
          </h1>
          <p className="section-subtitle max-w-lg mx-auto">
            Have a project in mind or questions about a purchase? Drop me a message — I typically reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-white font-semibold mb-4">Direct Contact</h3>
              <div className="space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@devmarket.dev', href: 'mailto:hello@devmarket.dev' },
                  { icon: Github, label: 'GitHub', value: '@yourhandle', href: 'https://github.com' },
                  { icon: Twitter, label: 'Twitter', value: '@yourhandle', href: 'https://twitter.com' },
                  { icon: Linkedin, label: 'LinkedIn', value: 'Your Name', href: 'https://linkedin.com' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors">
                      <Icon size={14} className="text-muted group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                      <div className="text-muted text-xs">{label}</div>
                      <div className="text-muted-light group-hover:text-accent transition-colors">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle size={18} className="text-accent" />
                <h3 className="text-white font-semibold">Response Time</h3>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                I typically respond within <strong className="text-muted-light">24 hours</strong> on weekdays. 
                For urgent matters, Twitter DMs are fastest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
