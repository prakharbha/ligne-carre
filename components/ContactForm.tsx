'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-light text-foreground mb-2">
          {t('name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 focus:border-foreground focus:outline-none transition-colors duration-300 bg-white text-foreground font-light"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-light text-foreground mb-2">
          {t('email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 focus:border-foreground focus:outline-none transition-colors duration-300 bg-white text-foreground font-light"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-light text-foreground mb-2">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 focus:border-foreground focus:outline-none transition-colors duration-300 bg-white text-foreground font-light resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3 border-2 border-foreground text-foreground font-light hover:bg-foreground hover:text-white transition-all duration-300"
      >
        {t('submit')}
      </button>
    </motion.form>
  );
}

