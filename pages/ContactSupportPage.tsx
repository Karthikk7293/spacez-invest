
import React, { useState, useContext } from 'react';
import PageTitle from '../components/PageTitle';
import { THEME_COLORS } from '../constants';
import { AppContext, AppContextType } from '../App';
import { SupportRequest, SupportTicketStatus, SupportTicketIssueType } from '../types';

// Icons (can be reused or use more specific ones if available)
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
const LifebuoyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12.75v6.75a2.25 2.25 0 002.25 2.25Z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5Z" clipRule="evenodd" /></svg>;


const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string }> = ({ label, id, error, ...props }) => (
  <div>
    <label htmlFor={id} className={`block text-sm font-medium text-neutral-700`}>{label}</label>
    <input id={id} {...props} className={`mt-1 w-full p-3 border ${error ? 'border-red-500' : 'border-neutral-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors`} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string; error?: string }> = ({ label, id, error, ...props }) => (
  <div>
    <label htmlFor={id} className={`block text-sm font-medium text-neutral-700`}>{label}</label>
    <textarea id={id} {...props} className={`mt-1 w-full p-3 border ${error ? 'border-red-500' : 'border-neutral-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors`} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string; error?: string; children: React.ReactNode }> = ({ label, id, error, children, ...props }) => (
  <div>
    <label htmlFor={id} className={`block text-sm font-medium text-neutral-700`}>{label}</label>
    <select id={id} {...props} className={`mt-1 w-full p-3 border ${error ? 'border-red-500' : 'border-neutral-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white transition-colors`}>
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);


const ContactSupportPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { properties, addSupportRequest } = appContext;
  const [activeForm, setActiveForm] = useState<'contact' | 'support'>('contact');
  
  // General Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactFormSuccess, setContactFormSuccess] = useState(false);
  const [submittedContactTicketId, setSubmittedContactTicketId] = useState<string | null>(null);


  // Support Request Form State
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPropertyId, setSupportPropertyId] = useState('');
  const [supportIssueType, setSupportIssueType] = useState<SupportTicketIssueType>(SupportTicketIssueType.GeneralInquiry);
  const [supportDescription, setSupportDescription] = useState('');
  const [supportError, setSupportError] = useState('');
  const [supportFormSuccess, setSupportFormSuccess] = useState(false);
  const [submittedSupportTicketId, setSubmittedSupportTicketId] = useState<string | null>(null);


  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    setContactFormSuccess(false);
    setSubmittedContactTicketId(null);

    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      setContactError('Please fill in all fields.');
      return;
    }
    
    const ticketId = `contact-${Date.now()}`;
    const newRequest: SupportRequest = {
      id: ticketId,
      name: contactName,
      email: contactEmail,
      issueType: 'General Contact',
      subject: contactSubject,
      message: contactMessage,
      submittedAt: new Date().toISOString(),
      status: SupportTicketStatus.New,
    };
    addSupportRequest(newRequest);
    setContactFormSuccess(true);
    setSubmittedContactTicketId(ticketId);
    setContactName(''); setContactEmail(''); setContactSubject(''); setContactMessage('');
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportError('');
    setSupportFormSuccess(false);
    setSubmittedSupportTicketId(null);

    if (!supportName || !supportEmail || !supportIssueType || !supportDescription) {
      setSupportError('Please fill in all required fields.');
      return;
    }
    const selectedProperty = properties.find(p => p.id === supportPropertyId);
    const ticketId = `support-${Date.now()}`;
    const newRequest: SupportRequest = {
      id: ticketId,
      name: supportName,
      email: supportEmail,
      propertyId: supportPropertyId || undefined,
      propertyName: selectedProperty?.name || undefined,
      issueType: supportIssueType,
      message: supportDescription,
      submittedAt: new Date().toISOString(),
      status: SupportTicketStatus.New,
    };
    addSupportRequest(newRequest);
    setSupportFormSuccess(true);
    setSubmittedSupportTicketId(ticketId);
    setSupportName(''); setSupportEmail(''); setSupportPropertyId(''); 
    setSupportIssueType(SupportTicketIssueType.GeneralInquiry); setSupportDescription('');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-250px)]">
      <PageTitle title="Contact & Support" subtitle="We're here to help. Choose an option below or reach out directly." />
      
      <div className={`bg-white shadow-xl rounded-xl overflow-hidden`}>
        <div className="border-b border-neutral-200">
          <nav className="flex justify-center -mb-px">
            <button 
              onClick={() => { setActiveForm('contact'); setContactFormSuccess(false); setSupportFormSuccess(false);}}
              className={`py-4 px-6 font-semibold text-sm focus:outline-none border-b-2 transition-colors duration-150 ${activeForm === 'contact' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-primary'}`}
            >
              General Contact
            </button>
            <button 
              onClick={() => { setActiveForm('support'); setContactFormSuccess(false); setSupportFormSuccess(false);}}
              className={`py-4 px-6 font-semibold text-sm focus:outline-none border-b-2 transition-colors duration-150 ${activeForm === 'support' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-primary'}`}
            >
              Submit Support Request
            </button>
          </nav>
        </div>

        <div className="grid md:grid-cols-5 gap-0">
          {/* Form Area */}
          <div className="md:col-span-3 p-6 md:p-10">
            {activeForm === 'contact' && (
              <form onSubmit={handleContactSubmit} className="space-y-5 animate-fadeIn">
                <h2 className={`text-2xl font-semibold text-neutral-800 mb-1`}>Send a General Message</h2>
                <p className="text-sm text-neutral-500 mb-5">For general inquiries, partnership opportunities, or feedback.</p>
                {contactFormSuccess && submittedContactTicketId && (
                <div className="my-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm flex items-center">
                    <CheckCircleIcon />
                    <span className="ml-2">Thank you! Your message (Ticket ID: {submittedContactTicketId}) has been sent. We'll be in touch.</span>
                </div>
                )}
                <InputField label="Full Name" id="contactName" type="text" value={contactName} onChange={e => setContactName(e.target.value)} error={contactError && !contactName ? "Name is required" : ""} required />
                <InputField label="Email Address" id="contactEmail" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} error={contactError && !contactEmail ? "Email is required" : ""} required />
                <InputField label="Subject" id="contactSubject" type="text" value={contactSubject} onChange={e => setContactSubject(e.target.value)} error={contactError && !contactSubject ? "Subject is required" : ""} required />
                <TextareaField label="Your Message" id="contactMessage" rows={5} value={contactMessage} onChange={e => setContactMessage(e.target.value)} error={contactError && !contactMessage ? "Message is required" : ""} required />
                {contactError && !contactFormSuccess && <p className="text-xs text-red-500">{contactError}</p>}
                <div>
                  <button type="submit" className={`w-full bg-primary text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-primary-dark transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}>
                    Send Message
                  </button>
                </div>
              </form>
            )}

            {activeForm === 'support' && (
              <form onSubmit={handleSupportSubmit} className="space-y-5 animate-fadeIn">
                <h2 className={`text-2xl font-semibold text-neutral-800 mb-1`}>Submit a Support Request</h2>
                <p className="text-sm text-neutral-500 mb-5">Having an issue or need specific assistance? Let us know.</p>
                {supportFormSuccess && submittedSupportTicketId && (
                  <div className="my-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm flex items-center">
                    <CheckCircleIcon />
                    <span className="ml-2">Your support request (Ticket ID: {submittedSupportTicketId}) has been submitted! Our team will review it shortly.</span>
                  </div>
                )}
                <InputField label="Full Name" id="supportName" type="text" value={supportName} onChange={e => setSupportName(e.target.value)} error={supportError && !supportName ? "Name is required" : ""} required />
                <InputField label="Email Address" id="supportEmail" type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} error={supportError && !supportEmail ? "Email is required" : ""} required />
                <SelectField label="Related Property (Optional)" id="supportPropertyId" value={supportPropertyId} onChange={e => setSupportPropertyId(e.target.value)}>
                  <option value="">Select a property</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </SelectField>
                <SelectField label="Issue Type" id="supportIssueType" value={supportIssueType} onChange={e => setSupportIssueType(e.target.value as SupportTicketIssueType)} error={supportError && !supportIssueType ? "Issue type is required" : ""} required>
                  {Object.values(SupportTicketIssueType).map(type => <option key={type} value={type}>{type}</option>)}
                </SelectField>
                <TextareaField label="Detailed Description of Issue" id="supportDescription" rows={5} value={supportDescription} onChange={e => setSupportDescription(e.target.value)} error={supportError && !supportDescription ? "Description is required" : ""} required />
                {supportError && !supportFormSuccess && <p className="text-xs text-red-500">{supportError}</p>}
                <div>
                  <button type="submit" className={`w-full bg-accent text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-accent-dark transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50`}>
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Information Column */}
          <div className={`md:col-span-2 bg-neutral-50 p-6 md:p-10 border-l border-neutral-200`}>
            <h2 className={`text-xl font-semibold text-neutral-800 mb-6`}>Direct Contact Information</h2>
            <div className="space-y-6 text-neutral-600">
              <div className="flex items-start">
                <MailIcon />
                <div>
                  <h3 className={`text-md font-semibold text-neutral-700 mb-0.5`}>Email Us</h3>
                  <a href="mailto:support@spacez.co" className={`text-sm hover:text-accent transition-colors`}>support@spacez.co</a>
                  <p className="text-xs mt-0.5 text-neutral-500">General: info@spacez.co</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon />
                <div>
                  <h3 className={`text-md font-semibold text-neutral-700 mb-0.5`}>Call Us</h3>
                  <a href="tel:+919876543210" className={`text-sm hover:text-accent transition-colors`}>+91 98765 43210</a>
                  <p className="text-xs mt-0.5 text-neutral-500">Mon - Fri, 9 AM - 6 PM IST</p>
                </div>
              </div>
              <div className="flex items-start">
                <LocationIcon />
                <div>
                  <h3 className={`text-md font-semibold text-neutral-700 mb-0.5`}>Our Office</h3>
                  <p className="text-sm">123 Luxury Lane, Tech Park, Bangalore, KA 560001, India</p>
                  <p className="text-xs mt-0.5 text-neutral-500">(Visits by appointment only)</p>
                </div>
              </div>
               <div className="flex items-start">
                <LifebuoyIcon />
                <div>
                  <h3 className={`text-md font-semibold text-neutral-700 mb-0.5`}>Looking for FAQs?</h3>
                  <a href="/faq" className={`text-sm hover:text-accent transition-colors`}>Check our FAQ Page</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportPage;
      