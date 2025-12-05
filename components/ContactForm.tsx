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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        setSubmitStatus({
          type: 'error',
          message: 'Failed to send message. Please try again.',
        });
        setIsSubmitting(false);
        return;
      }

      console.log('API Response:', { status: response.status, data });

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
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

      {submitStatus.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-4 rounded-md text-sm font-medium mb-4 ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border-2 border-green-300'
              : 'bg-red-50 text-red-800 border-2 border-red-300'
          }`}
          role="alert"
        >
          <div className="flex items-start">
            <span className="mr-2">
              {submitStatus.type === 'success' ? '✓' : '✕'}
            </span>
            <span>{submitStatus.message}</span>
          </div>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-3 border-2 border-foreground text-foreground font-light hover:bg-foreground hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : t('submit')}
      </button>
    </motion.form>
  );
}

