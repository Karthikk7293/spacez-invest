import React from 'react';
import { Link } from 'react-router-dom';
import { Property, CalculatedMetrics } from '../types';
import { usePropertyCalculations } from '../hooks/usePropertyCalculations';
import { THEME_COLORS } from '../constants';

interface PropertyCardProps {
  property: Property;
}

const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1 text-xs">
        <span className={`text-neutral-500`}>Raised</span>
        <span className={`font-semibold text-secondary`}>{percentage.toFixed(0)}%</span>
      </div>
      <div className={`w-full bg-neutral-200 rounded-full h-2`}>
        <div
          className={`bg-secondary h-2 rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const calculatedMetrics = usePropertyCalculations({
    capexDetails: property.capexDetails,
    opexDetails: property.opexDetails,
    revenueAssumptions: property.revenueAssumptions,
  });

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };
  
  const investmentGoal = calculatedMetrics?.totalCapex ?? property.investmentGoal;
  const year1Roi = calculatedMetrics?.roiProjections?.[0]?.annualReturnPercentage;

  return (
    <div className={`bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col group hover:-translate-y-1`}>
      <div className="relative overflow-hidden">
        <img src={property.images[0]} alt={property.name} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"/>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm
            ${property.status === 'Live' ? 'bg-green-100 text-green-700' : 
             property.status === 'Fully Funded' ? 'bg-primary/10 text-primary' :
             'bg-yellow-100 text-yellow-700'}`}>
          {property.status}
        </span>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <h3 className={`text-xl md:text-2xl font-semibold text-neutral-800 mb-1 group-hover:text-primary transition-colors`}>{property.name}</h3>
        <p className={`text-sm text-neutral-500 mb-3`}>{property.city}</p>
        
        <div className="mb-4">
          <ProgressBar value={property.amountRaised} max={investmentGoal} />
          <div className="flex justify-between text-xs mt-1.5 text-neutral-500">
            <span>Goal: {formatCurrency(investmentGoal)}</span>
            {/* <span>Raised: {formatCurrency(property.amountRaised)}</span> */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 border-t border-b border-neutral-200 py-3">
          <div>
            <p className={`text-neutral-500 text-xs`}>Tariff/Room:</p>
            <p className="font-semibold text-neutral-700">{formatCurrency(property.revenueAssumptions.tariffPerRoom)}</p>
          </div>
          <div>
            <p className={`text-neutral-500 text-xs`}>Occupancy:</p>
            <p className="font-semibold text-neutral-700">{(property.revenueAssumptions.occupancyRate * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className={`text-neutral-500 text-xs`}>Rooms:</p>
            <p className="font-semibold text-neutral-700">{property.revenueAssumptions.numberOfRooms}</p>
          </div>
           {year1Roi !== undefined && (
            <div>
                <p className={`text-neutral-500 text-xs`}>Projected Y1 ROI:</p>
                <p className={`font-bold text-accent`}>{year1Roi.toFixed(1)}%</p>
            </div>
            )}
        </div>
        
        <Link
          to={`/property/${property.id}`}
          className={`mt-auto w-full text-center bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
        >
          View Details & Invest
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;