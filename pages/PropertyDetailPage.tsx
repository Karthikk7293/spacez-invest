import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property, PropertyStatus, CalculatedMetrics } from '../types';
import InvestmentCalculator from '../components/InvestmentCalculator';
import { AppContext, AppContextType } from '../App';
import { usePropertyCalculations } from '../hooks/usePropertyCalculations';
import NotFoundPage from './NotFoundPage';
import { THEME_COLORS } from '../constants';
import InvestNowModal from '../components/InvestNowModal';

// Icons
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" /></svg>;


const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const ProgressBar: React.FC<{ value: number; max: number; height?: string }> = ({ value, max, height = "h-4" }) => {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full">
      <div className={`w-full bg-neutral-200 rounded-full ${height}`}>
        <div
          className={`bg-secondary h-full rounded-full transition-all duration-500 ease-out flex items-center justify-center`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && <span className="text-xs font-medium text-primary-dark">{percentage.toFixed(0)}%</span>}
        </div>
      </div>
      <div className="flex justify-between text-xs mt-1.5 text-neutral-500">
        <span>Raised: {formatCurrency(value)}</span>
        <span>Goal: {formatCurrency(max)}</span>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; className?: string; icon?: React.ReactNode }> = ({ label, value, className, icon }) => (
  <div className={`py-2.5 ${className} flex items-center`}>
    {icon && <span className="mr-2 text-primary">{icon}</span>}
    <div>
      <span className={`text-sm font-medium text-neutral-500 block`}>{label}</span>
      <span className={`text-md font-semibold text-neutral-800`}>{value}</span>
    </div>
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`py-3 px-5 font-semibold text-sm focus:outline-none transition-all duration-200 ease-in-out border-b-2
      ${active ? `border-primary text-primary` : `border-transparent text-neutral-500 hover:text-primary hover:border-primary/50`}
    `}
  >
    {children}
  </button>
);

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const appContext = useContext(AppContext) as AppContextType;
  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'location' | 'whyInvest'>('overview');
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProperty = appContext.properties.find(p => p.id === id);
      setProperty(foundProperty || null);
      if (foundProperty?.images?.length > 0) {
        setMainImage(foundProperty.images[0]);
      } else if (foundProperty) {
         setMainImage('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'); // Generic fallback
      }
    }
  }, [id, appContext.properties]);

  const calculatedMetrics = usePropertyCalculations(property ? {
    capexDetails: property.capexDetails,
    opexDetails: property.opexDetails,
    revenueAssumptions: property.revenueAssumptions,
  } : { capexDetails: {} as any, opexDetails: {} as any, revenueAssumptions: {} as any });

  const handleDownloadAgreement = () => {
    if (!property || !calculatedMetrics) return;
    const agreementText = `
DRAFT FRACTIONAL OWNERSHIP AGREEMENT (SAMPLE)

Property Name: ${property.name}
Property Location: ${property.city}
Date: ${new Date().toLocaleDateString()}

This document is a sample draft agreement for fractional ownership facilitated by Spacez and is intended for illustrative purposes only. It does not constitute a legally binding contract or an offer to invest. Prospective investors should seek independent legal and financial advice before making any investment decisions.

1. PARTIES:
   - Spacez (Hereinafter referred to as "The Company" or "Platform Provider")
   - [Investor Full Name] (Hereinafter referred to as "The Investor")

2. PROPERTY DETAILS:
   - Property Identifier: ${property.id}
   - Full Address: [To be specified in final SPV documents]
   - Total Property Valuation (CapEx): ${formatCurrency(calculatedMetrics.totalCapex)}
   - Number of Investment Slots: ${property.numberOfInvestmentSlots}
   - Value Per Slot: ${formatCurrency(calculatedMetrics.totalCapex / property.numberOfInvestmentSlots)}

3. INVESTMENT:
   - Number of Slots Acquired by Investor: [Number]
   - Total Investment Amount by Investor: [Amount]
   - Percentage Ownership: ([Number of Slots Acquired] / ${property.numberOfInvestmentSlots}) * 100 %

4. PURPOSE:
   The purpose of this agreement is to outline the terms under which The Investor acquires fractional ownership in the aforementioned property through a Special Purpose Vehicle (SPV) established or managed by The Company.

5. INCOME DISTRIBUTION:
   - Net rental income, after deducting operational expenditures (OpEx), management fees, and applicable taxes, will be distributed to investors on a [Monthly/Quarterly] basis, proportional to their ownership percentage.
   - Projected Annual Investor Share (illustrative, based on current assumptions): ${formatCurrency(calculatedMetrics.annualInvestorShare)}

6. MANAGEMENT:
   - The Company or its appointed professional property managers will oversee all aspects of property management, including but not limited to tenant acquisition, maintenance, repairs, insurance, and financial reporting.
   - Management Fee: [Typically a percentage of gross rental income, e.g., 10-15%]

7. TERM & EXIT STRATEGY:
   - The typical investment horizon is [e.g., 3-5 years], though this may vary.
   - Exit mechanisms may include:
     a) Sale of the entire property, with proceeds distributed proportionally.
     b) Buy-back options offered by The Company (if applicable).
     c) Resale of individual slots on a secondary market facilitated by The Company (subject to availability and terms).
   - Detailed exit terms will be specified in the SPV agreement.

8. GOVERNING LAW:
   This agreement shall be governed by and construed in accordance with the laws of India.

9. DISCLAIMERS:
   - Real estate investments are subject to market risks, including potential loss of principal.
   - Past performance and projected returns are not indicative of future results.
   - The Investor acknowledges they have read and understood all associated documents, including the full SPV agreement and risk disclosures.

This is a highly condensed sample. The final agreement will be substantially more detailed and legally comprehensive.
Spacez.co
    `;
    const blob = new Blob([agreementText.trim()], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Draft_Agreement_${property.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


  if (property === undefined) {
    return <div className="container mx-auto px-6 py-20 text-center text-xl text-neutral-600">Loading property details...</div>;
  }

  if (!property || !calculatedMetrics) {
    return <NotFoundPage message="Property not found or essential data is incomplete." />;
  }
  
  const investmentGoal = calculatedMetrics.totalCapex;
  const year1Roi = calculatedMetrics.roiProjections[0]?.annualReturnPercentage;
  const valuePerSlot = investmentGoal / property.numberOfInvestmentSlots;

  const investmentStatusInfo = {
    [PropertyStatus.Live]: { text: "Open for Investment", icon: <CheckCircleIcon />, color: "text-green-600", buttonText: "Invest Now", disabled: property.amountRaised >= investmentGoal },
    [PropertyStatus.FullyFunded]: { text: "Fully Funded", icon: <CheckCircleIcon />, color: "text-primary", buttonText: "Funding Closed", disabled: true },
    [PropertyStatus.Draft]: { text: "Draft (Coming Soon)", icon: <InfoIcon />, color: "text-yellow-600", buttonText: "Coming Soon", disabled: true },
    [PropertyStatus.Closed]: { text: "Investment Closed", icon: <InfoIcon />, color: "text-red-600", buttonText: "Investment Closed", disabled: true },
  }[property.status];


  return (
    <div className={`bg-neutral-50 min-h-screen`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Link and Property Title */}
        <div className="mb-6 md:mb-8">
          <Link to="/properties" className="inline-flex items-center text-sm text-primary hover:text-primary-dark font-medium transition-colors mb-3">
            <ChevronLeftIcon />
            Back to All Properties
          </Link>
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800`}>{property.name}</h1>
          <p className={`text-lg text-neutral-500 mt-1`}>{property.city}</p>
        </div>

        <div className={`bg-white shadow-xl rounded-xl overflow-hidden`}>
          {/* Main Content Grid: Images on Left, Details on Right */}
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Image Gallery Column */}
            <div className="lg:col-span-7 p-4 md:p-6 bg-neutral-100">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg mb-3">
                <img src={mainImage} alt={property.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </div>
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {property.images.map((imgUrl, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden cursor-pointer border-2 hover:border-primary transition-all" onClick={() => setMainImage(imgUrl)}>
                      <img
                        src={imgUrl}
                        alt={`${property.name} thumbnail ${index + 1}`}
                        className={`w-full h-full object-cover transition-opacity ${mainImage === imgUrl ? 'opacity-100 border-primary ring-2 ring-primary' : 'opacity-70 hover:opacity-100 border-transparent'}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Investment Details Column */}
            <div className="lg:col-span-5 p-6 md:p-8">
              <div className="sticky top-24"> {/* Make this column sticky if content overflows */}
                <h2 className={`text-2xl font-semibold text-neutral-800 mb-1`}>Investment Snapshot</h2>
                <span className={`inline-flex items-center text-sm font-semibold px-3 py-1 rounded-full mb-4
                    ${investmentStatusInfo.color === "text-green-600" ? "bg-green-100 text-green-700" : 
                     investmentStatusInfo.color === "text-primary" ? "bg-primary/10 text-primary" :
                     investmentStatusInfo.color === "text-yellow-600" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                    {investmentStatusInfo.icon && <span className="mr-1.5">{investmentStatusInfo.icon}</span>}
                    {investmentStatusInfo.text}
                </span>
                
                <div className="space-y-3 mb-6">
                  <ProgressBar value={property.amountRaised} max={investmentGoal} />
                  <DetailItem label="Total Investment (CapEx)" value={formatCurrency(investmentGoal)} />
                  <DetailItem label="Number of Investment Slots" value={`${property.numberOfInvestmentSlots} Slots`} />
                  <DetailItem label="Value per Slot" value={formatCurrency(valuePerSlot)} />
                  {year1Roi !== undefined && (
                      <DetailItem label="Projected Year 1 ROI" value={<span className={`text-accent font-bold text-lg`}>{year1Roi.toFixed(1)}%</span>} />
                  )}
                  <DetailItem label="Est. Annual Investor Share" value={<span className="text-green-600 font-semibold">{formatCurrency(calculatedMetrics.annualInvestorShare)}</span>} />
                  <DetailItem label="Minimum Investment" value={`${formatCurrency(valuePerSlot)} (1 Slot)`} />
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsInvestModalOpen(true)}
                    className={`w-full bg-secondary text-primary-dark py-3.5 px-6 rounded-lg font-bold text-md hover:bg-secondary-dark transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:shadow-none`}
                    disabled={investmentStatusInfo.disabled}
                  >
                    {investmentStatusInfo.buttonText}
                  </button>
                  <button 
                    onClick={handleDownloadAgreement}
                    className={`w-full bg-transparent border-2 border-primary text-primary py-3 px-6 rounded-lg font-semibold text-md hover:bg-primary/5 hover:text-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30`}
                  >
                    Download Draft Agreement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-neutral-200 mt-4 md:mt-0">
            <div className="px-4 md:px-6 border-b border-neutral-200">
              <nav className="-mb-px flex space-x-2 md:space-x-4 overflow-x-auto">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                <TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')}>Financial Projections</TabButton>
                <TabButton active={activeTab === 'location'} onClick={() => setActiveTab('location')}>Location & Area</TabButton>
                <TabButton active={activeTab === 'whyInvest'} onClick={() => setActiveTab('whyInvest')}>Why Invest?</TabButton>
              </nav>
            </div>

            <div className="p-6 md:p-8 min-h-[300px]">
              {activeTab === 'overview' && (
                <div className="prose prose-slate max-w-none animate-fadeIn">
                  <h3 className="text-xl font-semibold text-neutral-700 mb-3">About {property.name}</h3>
                  <p className="whitespace-pre-line leading-relaxed">{property.description}</p>
                  {property.amenities && property.amenities.length > 0 && (
                    <>
                      <h4 className="text-lg font-semibold text-neutral-700 mt-6 mb-2">Key Amenities:</h4>
                      <ul className="list-disc list-inside space-y-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4">
                        {property.amenities.map((item, idx) => <li key={idx} className="flex items-center"><CheckCircleIcon /> <span className="ml-2">{item}</span></li>)}
                      </ul>
                    </>
                  )}
                </div>
              )}
              {activeTab === 'financials' && (
                <div className="animate-fadeIn">
                     <InvestmentCalculator
                        property={property} // Pass the whole property object
                        initialRevenueAssumptions={property.revenueAssumptions} // Keep for direct use in calc
                        capexDetails={property.capexDetails}
                        opexDetails={property.opexDetails}
                    />
                </div>
              )}
              {activeTab === 'location' && (
                <div className="prose prose-slate max-w-none animate-fadeIn">
                  <h3 className="text-xl font-semibold text-neutral-700 mb-3">Location Highlights</h3>
                   {property.locationHighlights && property.locationHighlights.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {property.locationHighlights.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                   ) : (
                     <p>Detailed location highlights coming soon.</p>
                   )}
                   {/* Placeholder for map */}
                   <div className="mt-6 h-64 bg-neutral-200 rounded-md flex items-center justify-center text-neutral-500">
                        Map Placeholder
                    </div>
                </div>
              )}
              {activeTab === 'whyInvest' && (
                <div className="prose prose-slate max-w-none animate-fadeIn">
                  <h3 className="text-xl font-semibold text-neutral-700 mb-3">Why Invest in {property.name}?</h3>
                  {property.whyInvest && property.whyInvest.length > 0 ? (
                      <ul className="list-disc list-inside space-y-2">
                        {property.whyInvest.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                   ) : (
                     <p>Key investment reasons coming soon.</p>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isInvestModalOpen && property && (
        <InvestNowModal
          propertyId={property.id}
          propertyName={property.name}
          valuePerSlot={valuePerSlot}
          totalSlots={property.numberOfInvestmentSlots}
          isOpen={isInvestModalOpen}
          onClose={() => setIsInvestModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetailPage;