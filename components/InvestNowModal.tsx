import React, { useState, useContext } from 'react';
import { AppContext, AppContextType } from '../App';
import { Prospect } from '../types';
import { THEME_COLORS } from '../constants'; // Using new THEME_COLORS

interface InvestNowModalProps {
  propertyId: string;
  propertyName: string;
  valuePerSlot: number;
  totalSlots: number;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const InvestNowModal: React.FC<InvestNowModalProps> = ({ propertyId, propertyName, valuePerSlot, totalSlots, isOpen, onClose }) => {
  const appContext = useContext(AppContext) as AppContextType;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numberOfSlots, setNumberOfSlots] = useState('1'); // Default to 1 slot
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const calculatedInvestment = parseFloat(numberOfSlots) * valuePerSlot;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please fill in all required fields: Name, Email, and Phone.');
      return;
    }
    if (parseFloat(numberOfSlots) <= 0 || parseFloat(numberOfSlots) > totalSlots) {
      setError(`Number of slots must be between 1 and ${totalSlots}.`);
      return;
    }
    setError('');

    const newProspect: Prospect = {
      id: `prospect-${Date.now()}`,
      propertyId,
      propertyName,
      name,
      email,
      phone,
      intendedInvestment: calculatedInvestment, // Send calculated investment
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    appContext.addProspect(newProspect);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setNumberOfSlots('1');
        setIsSubmitted(false);
        setError('');
    }, 300); 
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100] animate-fadeIn" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100" onClick={(e) => e.stopPropagation()}>
        {!isSubmitted ? (
          <>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className={`text-2xl font-bold text-neutral-800`}>Invest in {propertyName}</h2>
                <p className={`text-sm text-neutral-500`}>Secure your share in this exclusive property.</p>
              </div>
              <button onClick={handleClose} className={`text-neutral-400 hover:text-neutral-600 transition-colors`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className={`text-xs text-neutral-500 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md`}>
              Each slot represents an investment of {formatCurrency(valuePerSlot)}. This property has {totalSlots} slots in total.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prospect-name" className={`block text-sm font-medium text-neutral-700 mb-1`}>Full Name <span className="text-red-500">*</span></label>
                <input type="text" id="prospect-name" value={name} onChange={(e) => setName(e.target.value)} required className={`w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prospect-email" className={`block text-sm font-medium text-neutral-700 mb-1`}>Email Address <span className="text-red-500">*</span></label>
                  <input type="email" id="prospect-email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow`} />
                </div>
                <div>
                  <label htmlFor="prospect-phone" className={`block text-sm font-medium text-neutral-700 mb-1`}>Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" id="prospect-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className={`w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow`} />
                </div>
              </div>
              <div>
                <label htmlFor="prospect-slots" className={`block text-sm font-medium text-neutral-700 mb-1`}>Number of Slots to Invest (1 - {totalSlots}) <span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    id="prospect-slots" 
                    value={numberOfSlots} 
                    onChange={(e) => setNumberOfSlots(e.target.value)} 
                    min="1" 
                    max={totalSlots} 
                    required 
                    className={`w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow`} 
                />
                {parseFloat(numberOfSlots) > 0 && <p className="text-xs text-neutral-500 mt-1">Total Intended Investment: <span className="font-semibold">{formatCurrency(calculatedInvestment)}</span></p>}
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
              <button type="submit" className={`w-full bg-secondary text-primary-dark py-3.5 rounded-lg font-bold hover:bg-secondary-dark transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50`}>
                Submit Interest
              </button>
               <p className="text-xs text-neutral-500 text-center pt-2">
                By submitting, you agree to be contacted by our investment advisory team. This is not a binding commitment to invest.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-20 h-20 text-green-500 mx-auto mb-5`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className={`text-2xl font-bold text-neutral-800 mb-3`}>Thank You, {name}!</h2>
            <p className={`text-neutral-600 mb-4`}>
              Your interest in investing <strong>{formatCurrency(calculatedInvestment)}</strong> ({numberOfSlots} slot(s)) for {propertyName} has been successfully submitted.
            </p>
             <p className={`text-neutral-600 mb-6`}>Our investment advisory team will contact you at <strong>{email}</strong> or <strong>{phone}</strong> shortly to discuss the next steps.</p>
            <a
              href="https://calendly.com/spacez-invest/consultation" 
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block bg-primary text-white py-3 px-8 rounded-lg font-semibold hover:bg-primary-dark transition-colors mb-3 shadow-md hover:shadow-lg`}
            >
              Schedule a Consultation Call
            </a>
            <button onClick={handleClose} className={`block w-full text-center text-neutral-500 hover:text-primary py-2 mt-2 transition-colors`}>
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestNowModal;