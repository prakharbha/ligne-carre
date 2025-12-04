'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: '',
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <label htmlFor="phone" className="block text-sm font-light text-foreground mb-2">
          {t('phone')}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 focus:border-foreground focus:outline-none transition-colors duration-300 bg-white text-foreground font-light"
        />
      </div>

      <div>
        <label htmlFor="inquiryType" className="block text-sm font-light text-foreground mb-2">
          {t('inquiryType')}
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 focus:border-foreground focus:outline-none transition-colors duration-300 bg-white text-foreground font-light"
        >
          <option value="">-- {t('inquiryType')} --</option>
          <option value="general">{t('inquiryTypes.general')}</option>
          <option value="newProject">{t('inquiryTypes.newProject')}</option>
          <option value="existingProject">{t('inquiryTypes.existingProject')}</option>
          <option value="consultation">{t('inquiryTypes.consultation')}</option>
          <option value="quote">{t('inquiryTypes.quote')}</option>
          <option value="other">{t('inquiryTypes.other')}</option>
        </select>
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
        disabled={status === 'loading'}
        className="w-full md:w-auto px-8 py-3 border-2 border-foreground text-foreground font-light hover:bg-foreground hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? t('submitting') || 'Submitting...' : t('submit')}
      </button>

      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-600 text-sm mt-4"
        >
          {t('success') || 'Thank you! Your message has been sent successfully.'}
        </motion.p>
      )}

      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm mt-4"
        >
          {errorMessage || t('error') || 'Something went wrong. Please try again.'}
        </motion.p>
      )}
    </motion.form>
  );
}

