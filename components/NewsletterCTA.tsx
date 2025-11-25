'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from './AnimatedSection';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <section className="py-20 lg:py-24 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h2 className="font-season-mix text-3xl lg:text-4xl mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-300 font-light">
              Subscribe to our newsletter for the latest projects, insights, and architectural news.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-gray-900 font-normal uppercase tracking-wide hover:bg-gray-100 transition-colors duration-300"
              >
                Subscribe
              </button>
            </div>
            
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-green-400 text-sm"
              >
                Thank you for subscribing!
              </motion.p>
            )}
            
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-red-400 text-sm"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </form>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <p className="text-center text-sm text-gray-400 mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

