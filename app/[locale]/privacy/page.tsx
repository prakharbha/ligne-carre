'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

export default function PrivacyPage() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="font-season-mix text-5xl lg:text-6xl text-foreground mb-16 text-center">
              Privacy Policy
            </h1>
          </AnimatedSection>

          <div className="space-y-8">
            <AnimatedSection delay={0.1}>
              <div className="space-y-4">
                <h2 className="font-season-mix text-2xl text-foreground">
                  Information We Collect
                </h2>
                <p className="text-base text-foreground leading-relaxed font-light">
                  We collect information that you provide directly to us, such as when you fill out 
                  a contact form, request information, or communicate with us. This may include your 
                  name, email address, phone number, and any other information you choose to provide.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-4">
                <h2 className="font-season-mix text-2xl text-foreground">
                  How We Use Your Information
                </h2>
                <p className="text-base text-foreground leading-relaxed font-light">
                  We use the information we collect to respond to your inquiries, provide services, 
                  send you updates about our work, and improve our website. We do not sell or share 
                  your personal information with third parties without your consent.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="space-y-4">
                <h2 className="font-season-mix text-2xl text-foreground">
                  Contact Us
                </h2>
                <p className="text-base text-foreground leading-relaxed font-light">
                  If you have any questions about this Privacy Policy, please contact us at 
                  contact@lignecarre.com.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="pt-8 text-sm text-gray-600 font-light">
                Last updated: January 2025
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

