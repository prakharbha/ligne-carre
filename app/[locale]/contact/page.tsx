'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div>
      <PageBanner title={t('title')} subtitle="Let's Discuss Your Project" />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <AnimatedSection delay={0.1}>
              <div className="space-y-8">
                <div>
                  <h2 className="font-season-mix text-2xl text-foreground mb-4">
                    Get in Touch
                  </h2>
                  <p className="text-base text-foreground leading-relaxed font-light mb-6">
                    We would love to hear from you. Whether you have a project in mind or 
                    questions about our services, please don't hesitate to reach out.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      Office
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      Montreal, Quebec, Canada
                    </p>
                  </div>

                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      Email
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      contact@lignecarre.com
                    </p>
                  </div>

                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      Phone
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      +1 (514) 000-0000
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

