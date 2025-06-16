import React from 'react';
import PageTitle from '../../components/PageTitle';
import { THEME_COLORS } from '../../constants';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className={`bg-neutral-50 py-12 md:py-16`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle title="Terms of Service" subtitle="Please read these terms carefully." />
        <div className={`bg-white p-6 md:p-10 rounded-xl shadow-xl max-w-4xl mx-auto`}>
          <div className="prose prose-slate max-w-none text-neutral-700 leading-relaxed">
            <p className="text-sm text-neutral-500">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>Welcome to Spacez! These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at spacez.co (together or individually "Service") operated by Spacez.</p>
            <p>Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service.</p>
            <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the Service.</p>

            <h2>1. Accounts</h2>
            <p>When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.</p>
            <p>You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.</p>

            <h2>2. Investment Disclaimers</h2>
            <p>Spacez provides a platform for fractional investment in real estate. All investments carry risk, including the possible loss of principal. Past performance is not indicative of future results.</p>
            <p>Spacez is not a registered broker-dealer or investment advisor. Information provided on the Service is for informational purposes only and does not constitute financial, legal, or tax advice. You should consult with qualified professionals before making any investment decisions.</p>
            <p>Projections, ROI estimates, and other forward-looking statements are based on assumptions and current market conditions, which are subject to change. There is no guarantee that such projections will be realized.</p>

            <h2>3. Intellectual Property</h2>
            <p>The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Spacez and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Spacez.</p>

            <h2>4. User Conduct</h2>
            <p>You agree not to use the Service:</p>
            <ul>
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate Spacez, a Spacez employee, another user, or any other person or entity.</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
            </ul>

            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
            <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>

            <h2>6. Indemnification</h2>
            <p>You agree to defend, indemnify and hold harmless Spacez and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password; b) a breach of these Terms, or c) Content posted on the Service.</p>

            <h2>7. Limitation Of Liability</h2>
            <p>In no event shall Spacez, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>

            <h2>8. Disclaimer</h2>
            <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>
            <p>Spacez its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.</p>
            
            <h2>9. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
            <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding the Service.</p>

            <h2>10. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            <p>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.</p>

            <h2>11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul>
              <li>By email: <a href="mailto:legal@spacez.co" className="text-primary hover:underline">legal@spacez.co</a></li>
              <li>By visiting this page on our website: <a href="/contact-support" className="text-primary hover:underline">spacez.co/contact-support</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;