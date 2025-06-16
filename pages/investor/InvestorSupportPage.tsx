
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { AppContext, AppContextType } from '../../App';
import { SupportRequest, SupportTicketStatus, SupportTicketIssueType, Property } from '../../types';

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

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5Z" clipRule="evenodd" /></svg>;


const InvestorSupportPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { currentInvestor, properties, addSupportRequest } = appContext;
  const location = useLocation(); 

  const routeState = location.state as { propertyId?: string, propertyName?: string, reportPeriod?: string } | undefined;
  
  const [name, setName] = useState(currentInvestor?.name || '');
  const [email, setEmail] = useState(currentInvestor?.email || '');
  const [propertyId, setPropertyId] = useState(routeState?.propertyId || '');
  const [reportPeriod, setReportPeriod] = useState(routeState?.reportPeriod || ''); 
  const [issueType, setIssueType] = useState<SupportTicketIssueType>(routeState?.propertyId ? SupportTicketIssueType.LedgerInquiry : SupportTicketIssueType.GeneralInquiry);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);


  const investedProperties = useMemo(() => {
    if (!currentInvestor) return [];
    return currentInvestor.propertiesInvested
      .map(inv => properties.find(p => p.id === inv.propertyId))
      .filter(Boolean) as Property[];
  }, [currentInvestor, properties]);

  useEffect(() => {
    if (routeState?.propertyId) setPropertyId(routeState.propertyId);
    if (routeState?.reportPeriod) setReportPeriod(routeState.reportPeriod);
    if (routeState?.propertyId || routeState?.reportPeriod) setIssueType(SupportTicketIssueType.LedgerInquiry);
  }, [routeState]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);
    setSubmittedTicketId(null);

    if (!name || !email || !issueType || !message) {
      setFormError('Please fill in all required fields: Name, Email, Issue Type, and Message.');
      return;
    }
    if (issueType === SupportTicketIssueType.LedgerInquiry && (!propertyId || !reportPeriod)) {
        setFormError('For Ledger Inquiries, please select a property and specify the report period.');
        return;
    }

    const selectedProperty = properties.find(p => p.id === propertyId);
    const ticketId = `inv-support-${Date.now()}`;
    
    const newRequest: SupportRequest = {
      id: ticketId,
      name,
      email,
      propertyId: issueType === SupportTicketIssueType.LedgerInquiry ? propertyId : undefined,
      propertyName: issueType === SupportTicketIssueType.LedgerInquiry ? selectedProperty?.name : undefined,
      issueType: issueType,
      subject: issueType === SupportTicketIssueType.LedgerInquiry ? `Inquiry for ${selectedProperty?.name} - Report ${reportPeriod}` : `General Investor Inquiry`,
      message,
      submittedAt: new Date().toISOString(),
      status: SupportTicketStatus.New,
    };
    addSupportRequest(newRequest);
    setFormSuccess(true);
    setSubmittedTicketId(ticketId);
    
    if (issueType !== SupportTicketIssueType.LedgerInquiry) {
        setPropertyId('');
        setReportPeriod('');
    }
    setMessage('');
  };
  
  if (!currentInvestor) return <PageTitle title="Access Denied" subtitle="Please log in to access support."/>;

  return (
    <div className="pb-4">
      <PageTitle title="Investor Support" subtitle="Have questions or need assistance? We're here to help." />
      
      <div className={`bg-white p-6 md:p-8 rounded-xl shadow-xl max-w-2xl mx-auto`}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formSuccess && submittedTicketId && (
            <div className="my-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm flex items-center">
                 <CheckCircleIcon />
                 <span className="ml-2">Your request (Ticket ID: {submittedTicketId}) has been submitted successfully! Our team will get back to you shortly.</span>
            </div>
          )}
          <InputField label="Full Name" id="supportName" type="text" value={name} onChange={e => setName(e.target.value)} required />
          <InputField label="Email Address" id="supportEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          
          <SelectField label="Issue Type" id="supportIssueType" value={issueType} onChange={e => setIssueType(e.target.value as SupportTicketIssueType)} required>
            {Object.values(SupportTicketIssueType).map(type => (
              <option key={type} value={type}>{type.replace(/([A-Z])/g, ' $1').trim()}</option>
            ))}
          </SelectField>

          {issueType === SupportTicketIssueType.LedgerInquiry && (
            <>
              <SelectField 
                label="Related Property" 
                id="supportPropertyId" 
                value={propertyId} 
                onChange={e => setPropertyId(e.target.value)}
                error={formError && !propertyId && issueType === SupportTicketIssueType.LedgerInquiry ? "Property selection is required for ledger inquiries." : ""}
                required={issueType === SupportTicketIssueType.LedgerInquiry}
              >
                <option value="">Select Property</option>
                {investedProperties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </SelectField>
              <InputField 
                label="Report Period (e.g., May 2025, Q2 2025)" 
                id="supportReportPeriod" 
                type="text" 
                value={reportPeriod} 
                onChange={e => setReportPeriod(e.target.value)}
                error={formError && !reportPeriod && issueType === SupportTicketIssueType.LedgerInquiry ? "Report period is required for ledger inquiries." : ""}
                required={issueType === SupportTicketIssueType.LedgerInquiry}
                placeholder="As shown on the report (e.g. May 2025)"
              />
            </>
          )}

          <TextareaField label="Your Question or Message" id="supportMessage" rows={6} value={message} onChange={e => setMessage(e.target.value)} error={formError && !message ? "Message is required." : ""} required />
          
          {formError && !formSuccess && <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">{formError}</p>}
          
          <div className="pt-2">
            <button type="submit" className={`w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}>
              Submit Request
            </button>
          </div>
           <p className="text-xs text-neutral-500 text-center">
            We aim to respond to all inquiries within 24-48 business hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default InvestorSupportPage;
      