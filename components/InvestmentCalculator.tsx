
import React, { useState, useEffect, useMemo } from 'react';
import { Property, RevenueAssumptions, CapexDetails, OpexDetails, CalculatedMetrics, ROIProjectionItem } from '../types';
import { usePropertyCalculations } from '../hooks/usePropertyCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { THEME_COLORS } from '../constants'; // Using new THEME_COLORS

interface InvestmentCalculatorProps {
  property: Property; // Pass the whole property object
  initialRevenueAssumptions: RevenueAssumptions; // Still needed for initial state of inputs
  capexDetails: CapexDetails;
  opexDetails: OpexDetails;
}

const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const formatPercentage = (value: number | undefined) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `${value.toFixed(1)}%`;
};

const DataCard: React.FC<{ title: string; value: string; className?: string; icon?: React.ReactNode; valueClassName?: string }> = ({ title, value, className, icon, valueClassName }) => (
  <div className={`p-4 shadow-lg rounded-lg border border-neutral-200 bg-white ${className}`}>
    <div className="flex items-center text-sm text-neutral-500 mb-1">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </div>
    <p className={`text-xl font-bold text-primary ${valueClassName}`}>{value}</p>
  </div>
);

const RoiChart: React.FC<{ data: ROIProjectionItem[] }> = ({ data }) => {
  const chartData = useMemo(() => data.map(item => ({
    name: `Year ${item.year}`,
    "Annual Return (%)": item.annualReturnPercentage,
    "Investor Share (₹)": item.annualInvestorShareAmount,
    "Cumulative Return (%)": item.cumulativeReturnPercentage,
  })), [data]);
  
  if (!data || data.length === 0) return <p className="text-center text-neutral-500 py-8">ROI data not available.</p>;

  const primaryChartColor = '#0D9488'; 
  const accentChartColor = '#F97316'; 

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg border border-neutral-200">
      <h4 className="text-xl font-semibold text-neutral-800 mb-4">5-Year ROI & Investor Share Projection</h4>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
          <YAxis yAxisId="left" orientation="left" stroke={accentChartColor} unit="%" tick={{ fontSize: 12, fill: accentChartColor }} />
          <YAxis yAxisId="right" orientation="right" stroke={primaryChartColor} unit="₹" 
            tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value)} 
            tick={{ fontSize: 12, fill: primaryChartColor }}
          />
          <Tooltip 
            formatter={(value, name) => [`${typeof value === 'number' ? (name.toString().includes('%') ? value.toFixed(1) + '%' : formatCurrency(value)) : value}`, name]}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            itemStyle={{ color: '#4B5563' }}
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="Annual Return (%)" fill={accentChartColor} barSize={25}>
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={accentChartColor} />
            ))}
          </Bar>
          <Bar yAxisId="right" dataKey="Investor Share (₹)" fill={primaryChartColor} barSize={25}>
             {chartData.map((entry, index) => (
                <Cell key={`cell-share-${index}`} fill={primaryChartColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const MetricDisplayItem: React.FC<{ label: string; value: string | number | undefined; currency?: boolean; percentage?: boolean; bold?: boolean; color?: string; helpText?: string }> = 
({ label, value, currency, percentage, bold, color, helpText }) => (
    <div className="flex justify-between py-2.5 border-b border-neutral-200/70 items-center">
      <div className="flex items-center">
          <span className={`text-sm ${color ? color : 'text-neutral-600'}`}>{label}</span>
          {helpText && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-neutral-400 ml-1.5 cursor-help">
              <title>{helpText}</title>
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0-5.5a1 1 0 0 0 1-1V6.667a1 1 0 0 0-2 0V8.5a1 1 0 0 0 1 1ZM7.5 6a.5.5 0 0 1 .5-.5h.008a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-.5.5H8a.5.5 0 0 1-.5-.5Z" clipRule="evenodd" />
            </svg>
          )}
      </div>
      <span className={`text-sm text-right ${bold ? 'font-semibold' : ''} ${color ? color : 'text-neutral-800'}`}>
        {currency ? formatCurrency(value as number) : percentage ? formatPercentage(value as number) : value}
      </span>
    </div>
);


const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ property, initialRevenueAssumptions, capexDetails, opexDetails }) => {
  const [revenueInputs, setRevenueInputs] = useState<RevenueAssumptions>(initialRevenueAssumptions);

  const calculatedMetrics = usePropertyCalculations({
    capexDetails,
    opexDetails,
    revenueAssumptions: {
        ...revenueInputs,
        numberOfRooms: property.revenueAssumptions.numberOfRooms, 
        // reserveSlots removed
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setRevenueInputs(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };
  
  const rentableRooms = calculatedMetrics?.rentableRooms ?? property.revenueAssumptions.numberOfRooms;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 shadow-xl rounded-lg border border-neutral-200">
        <h3 className="text-2xl font-semibold text-neutral-800 mb-2">Simulate Your Returns</h3>
        <p className="text-sm text-neutral-500 mb-6">Adjust tariff and occupancy to see how they impact your potential earnings. Other property financials are fixed.</p>
        
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
            <label className="block text-xs font-medium text-neutral-500">Total Rooms in Property (All Rentable)</label>
            <p className="text-md font-semibold text-neutral-700">{property.revenueAssumptions.numberOfRooms}</p>
          </div>
          {/* Reserved/Non-Rentable Rooms display removed */}
          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
            <label className="block text-xs font-medium text-neutral-500">Total Investment Slots</label>
            <p className="text-md font-semibold text-neutral-700">{property.numberOfInvestmentSlots}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label htmlFor="tariffPerRoom" className="block text-sm font-medium text-neutral-700 mb-1">Adjust Tariff per Room (₹)</label>
            <input type="number" name="tariffPerRoom" id="tariffPerRoom" value={revenueInputs.tariffPerRoom} onChange={handleInputChange} className="mt-1 block w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow" />
          </div>
          <div>
            <label htmlFor="occupancyRate" className="block text-sm font-medium text-neutral-700 mb-1">Adjust Occupancy Rate (%)</label>
            <input type="number" name="occupancyRate" id="occupancyRate" value={revenueInputs.occupancyRate * 100} onChange={(e) => handleInputChange({target: {name: 'occupancyRate', value: (parseFloat(e.target.value)/100).toString(), type: 'number'}} as any)} min="0" max="100" step="1" className="mt-1 block w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow" />
          </div>
        </div>
      </div>

      {calculatedMetrics && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataCard title="Total CapEx (Property Cost)" value={formatCurrency(calculatedMetrics.totalCapex)} />
            <DataCard title="Annual Net Profit (Projected)" value={formatCurrency(calculatedMetrics.annualNetProfit)} className={`bg-green-50`} valueClassName="text-green-600" />
            <DataCard title="Annual Investor Share (50%)" value={formatCurrency(calculatedMetrics.annualInvestorShare)} className={`bg-secondary/10`} valueClassName="text-secondary-dark font-bold"/>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow-lg rounded-lg border border-neutral-200">
              <h4 className="text-xl font-semibold text-neutral-800 mb-3">Revenue & Costs Breakdown</h4>
              <MetricDisplayItem label="Monthly Gross Revenue" value={calculatedMetrics.monthlyGrossRevenue} currency />
              <MetricDisplayItem label="Monthly GST (18%)" value={calculatedMetrics.monthlyGstAmount} currency />
              <MetricDisplayItem label="Monthly Commission (12%)" value={calculatedMetrics.monthlyCommissionAmount} currency />
              <MetricDisplayItem label="Monthly Net Revenue" value={calculatedMetrics.monthlyNetRevenue} currency bold />
              <MetricDisplayItem label="Annual Net Revenue" value={calculatedMetrics.annualNetRevenue} currency bold />
              <MetricDisplayItem label="Annual OpEx" value={calculatedMetrics.annualOpex} currency />
              <MetricDisplayItem label="Projected Annual Net Profit" value={calculatedMetrics.annualNetProfit} currency bold color="text-green-600" />
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg border border-neutral-200">
              <h4 className="text-xl font-semibold text-neutral-800 mb-3">Your Potential Returns</h4>
              <MetricDisplayItem label="Total Investment Cost (Property CapEx)" value={calculatedMetrics.totalCapex} currency />
              <MetricDisplayItem label="Value per Investment Slot" value={formatCurrency(calculatedMetrics.totalCapex / property.numberOfInvestmentSlots)} currency />
              <MetricDisplayItem label="Projected Annual Investor Share (Total Pool)" value={calculatedMetrics.annualInvestorShare} currency bold color="text-secondary-dark"/>
              <MetricDisplayItem label="Projected Monthly Payout (Total Pool)" value={calculatedMetrics.monthlyInvestorShare} currency bold color="text-secondary-dark"/>
              {calculatedMetrics.roiProjections[0] && (
                <MetricDisplayItem label="Year 1 Projected ROI (on Total CapEx)" value={calculatedMetrics.roiProjections[0].annualReturnPercentage} percentage bold color="text-accent" />
              )}
               <p className="text-xs text-neutral-500 mt-3">Note: Individual investor returns depend on the number of slots owned. ROI is calculated on the total property CapEx.</p>
            </div>
          </div>
          
          <RoiChart data={calculatedMetrics.roiProjections} />
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;