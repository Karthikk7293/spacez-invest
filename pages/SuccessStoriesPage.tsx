
import React, { useContext } from 'react';
import PageTitle from '../components/PageTitle';
import { AppContext, AppContextType } from '../App';
import { Property, PropertyStatus } from '../types';
import { THEME_COLORS } from '../constants';
import { usePropertyCalculations } from '../hooks/usePropertyCalculations'; // For displaying metrics

interface SuccessStoryCardProps {
  property: Property;
}

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({ property }) => {
  const metrics = usePropertyCalculations({
    capexDetails: property.capexDetails,
    opexDetails: property.opexDetails,
    revenueAssumptions: property.revenueAssumptions
  });

  const formatCurrency = (value?: number) => value ? `₹${value.toLocaleString('en-IN')}` : 'N/A';

  return (
    <div className={`bg-${THEME_COLORS.cardBackground} rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300`}>
      <img src={property.images[0]} alt={property.name} className="w-full h-56 object-cover" />
      <div className="p-6">
        <h3 className={`text-2xl font-bold text-${THEME_COLORS.primary} mb-2`}>{property.name}</h3>
        <p className={`text-sm text-${THEME_COLORS.textMuted} mb-3`}>{property.city}</p>
        <div className="space-y-2 text-sm mb-4">
          <p><strong>Status:</strong> <span className="font-semibold text-green-600">{property.status}</span></p>
          <p><strong>Total Investment Raised:</strong> <span className="font-semibold">{formatCurrency(property.investmentGoal)}</span></p>
          {metrics && metrics.roiProjections[0] && (
             <p><strong>Projected Year 1 ROI:</strong> <span className={`font-semibold text-${THEME_COLORS.accent}`}>{metrics.roiProjections[0].annualReturnPercentage.toFixed(1)}%</span></p>
          )}
          {/* In a real app, you'd show actual ROI if available */}
          <p><strong>Actual Year 1 ROI:</strong> <span className={`font-semibold text-${THEME_COLORS.accent}`}>{(metrics && metrics.roiProjections[0] ? (metrics.roiProjections[0].annualReturnPercentage * 1.05).toFixed(1) : 'N/A')}% (Example Actual)</span></p>
        </div>
        <button className={`w-full bg-${THEME_COLORS.primary} text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm`}>
          Read Full Story (Placeholder)
        </button>
      </div>
    </div>
  );
};

const TestimonialCard: React.FC<{ quote: string; author: string; location: string }> = ({ quote, author, location }) => (
  <div className={`bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-lg shadow-md border border-${THEME_COLORS.border}`}>
    <svg className={`w-8 h-8 text-${THEME_COLORS.primary} mb-3`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.983 3v7.391A3.285 3.285 0 0 0 6.728 13.5H3.228V21h3.5c3.717 0 6.728-3.012 6.728-6.728V3H9.983zm10.017 0v7.391A3.285 3.285 0 0 0 16.745 13.5h-3.5V21h3.5c3.717 0 6.728-3.012 6.728-6.728V3h-3.517z" />
    </svg>
    <p className={`text-${THEME_COLORS.textMuted} italic mb-4 text-md`}>"{quote}"</p>
    <p className={`font-semibold text-${THEME_COLORS.textBase}`}>{author}</p>
    <p className={`text-sm text-${THEME_COLORS.textMuted}`}>{location}</p>
  </div>
);

const SuccessStoriesPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { properties } = appContext;

  const fundedProperties = properties.filter(p => p.status === PropertyStatus.FullyFunded);
  
  const testimonials = [
    { quote: "Investing with Spacez was seamless and profitable. Their team is professional and transparent.", author: "Rohan Sharma", location: "Investor, Mumbai" },
    { quote: "Finally, a trustworthy platform for fractional real estate. The monthly payouts are fantastic!", author: "Anika Reddy", location: "Investor, Bangalore" },
    { quote: "I've diversified my portfolio with Spacez and couldn't be happier. The returns exceeded my expectations.", author: "Vikram Singh", location: "Investor, Delhi" },
  ];

  return (
    <div className={`container mx-auto px-6 py-12 bg-${THEME_COLORS.background}`}>
      <PageTitle title="Our Success Stories" subtitle="See how Spacez is transforming real estate investment and delivering results." />

      {fundedProperties.length > 0 ? (
        <section className="mb-16">
          <h2 className={`text-3xl font-semibold text-${THEME_COLORS.textBase} mb-8 text-center`}>Successfully Funded Properties</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundedProperties.map(property => (
              <SuccessStoryCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      ) : (
        <p className={`text-center text-lg text-${THEME_COLORS.textMuted} mb-16`}>No fully funded properties to display yet. Check back soon!</p>
      )}

      <section>
        <h2 className={`text-3xl font-semibold text-${THEME_COLORS.textBase} mb-8 text-center`}>What Our Investors Say</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SuccessStoriesPage;
