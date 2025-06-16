
import React from 'react';
import PageTitle from '../components/PageTitle';
import { THEME_COLORS } from '../constants';

// Icons
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;


const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon. (This is a demo, no email was sent)");
    // Reset form if needed
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-300px)]">
      <PageTitle title="Get In Touch" subtitle="We're here to help and answer any question you might have." />
      
      <div className={`bg-${THEME_COLORS.cardBackground} shadow-xl rounded-lg overflow-hidden`}>
        <div className="grid md:grid-cols-2">
          {/* Contact Form */}
          <div className="p-8 md:p-10">
            <h2 className={`text-2xl font-semibold text-${THEME_COLORS.primary} mb-6`}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium text-${THEME_COLORS.textMuted}`}>Full Name</label>
                <input type="text" name="name" id="name" required className={`mt-1 w-full p-3 border border-${THEME_COLORS.border} rounded-md shadow-sm focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary}`} />
              </div>
              <div>
                <label htmlFor="email" className={`block text-sm font-medium text-${THEME_COLORS.textMuted}`}>Email Address</label>
                <input type="email" name="email" id="email" required className={`mt-1 w-full p-3 border border-${THEME_COLORS.border} rounded-md shadow-sm focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary}`} />
              </div>
              <div>
                <label htmlFor="subject" className={`block text-sm font-medium text-${THEME_COLORS.textMuted}`}>Subject</label>
                <input type="text" name="subject" id="subject" required className={`mt-1 w-full p-3 border border-${THEME_COLORS.border} rounded-md shadow-sm focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary}`} />
              </div>
              <div>
                <label htmlFor="message" className={`block text-sm font-medium text-${THEME_COLORS.textMuted}`}>Message</label>
                <textarea name="message" id="message" rows={4} required className={`mt-1 w-full p-3 border border-${THEME_COLORS.border} rounded-md shadow-sm focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary}`}></textarea>
              </div>
              <div>
                <button type="submit" className={`w-full bg-${THEME_COLORS.accent} text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors shadow-md`}>
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className={`bg-gray-50 p-8 md:p-10 border-l border-${THEME_COLORS.border}`}>
            <h2 className={`text-2xl font-semibold text-${THEME_COLORS.primary} mb-8`}>Contact Information</h2>
            <div className="space-y-6 text-${THEME_COLORS.textMuted}">
              <div className="flex items-start">
                <MailIcon />
                <div>
                  <h3 className={`text-lg font-semibold text-${THEME_COLORS.textBase} mb-1`}>Email Us</h3>
                  <a href="mailto:support@spacez.co" className={`hover:text-${THEME_COLORS.accent} transition-colors`}>support@spacez.co</a>
                  <p className="text-xs mt-1">We typically respond within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon />
                <div>
                  <h3 className={`text-lg font-semibold text-${THEME_COLORS.textBase} mb-1`}>Call Us</h3>
                  <a href="tel:+919876543210" className={`hover:text-${THEME_COLORS.accent} transition-colors`}>+91 98765 43210</a>
                  <p className="text-xs mt-1">Mon - Fri, 9 AM - 6 PM IST</p>
                </div>
              </div>
              <div className="flex items-start">
                <LocationIcon />
                <div>
                  <h3 className={`text-lg font-semibold text-${THEME_COLORS.textBase} mb-1`}>Our Office</h3>
                  <p>123 Luxury Lane, Tech Park, Bangalore, KA 560001, India</p>
                  <p className="text-xs mt-1">(By appointment only)</p>
                </div>
              </div>
            </div>
             <div className="mt-10">
                <h3 className={`text-lg font-semibold text-${THEME_COLORS.textBase} mb-3`}>Connect on Social Media</h3>
                 <div className="flex space-x-4">
                    {/* Placeholder social icons - replace with actual ones from App.tsx if needed */}
                    <a href="#" className={`text-gray-500 hover:text-${THEME_COLORS.primary}`} aria-label="Facebook">FB</a>
                    <a href="#" className={`text-gray-500 hover:text-${THEME_COLORS.primary}`} aria-label="Twitter">TW</a>
                    <a href="#" className={`text-gray-500 hover:text-${THEME_COLORS.primary}`} aria-label="LinkedIn">IN</a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
