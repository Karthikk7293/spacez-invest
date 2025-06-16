import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { Property, MonthlyLedgerEntry, InvestorInvestment, OpexDetails } from '../../types';
import { THEME_COLORS, ANNUAL_DEPRECIATION_RATE } from '../../constants';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const formatPercentage = (value: number | undefined, digits = 1) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `${value.toFixed(digits)}%`;
};

const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (dateString.match(/^\d{4}-\d{2}$/)) { // Handles "YYYY-MM"
    const [year, month] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 2).toLocaleDateString('en-IN', options || { month: 'short', year: 'numeric' });
  }
  return date.toLocaleDateString('en-IN', options || { year: 'numeric', month: 'short', day: 'numeric' });
};

const getMonthsInRange = (startDate: string, endDate: string): string[] => {
    const start = new Date(startDate + "-02"); // Use day 02 to avoid timezone issues
    const end = new Date(endDate + "-02");
    const months: string[] = [];
    let current = start;

    while (current <= end) {
        months.push(current.toISOString().slice(0, 7)); // YYYY-MM
        current.setMonth(current.getMonth() + 1);
    }
    return months;
};


const getMonthsForQuarter = (quarter: number, year: number): string[] => {
  const startMonth = (quarter - 1) * 3 + 1;
  return Array.from({ length: 3 }, (_, i) => `${year}-${String(startMonth + i).padStart(2, '0')}`);
};

const getMonthsForYear = (year: number): string[] => {
  return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
};

const DetailListItem: React.FC<{ label: string; value: string; itemClassName?: string; valueClassName?:string }> = ({ label, value, itemClassName, valueClassName }) => (
  <li className={`flex justify-between py-1.5 px-2 rounded ${itemClassName}`}>
    <span className="text-xs text-neutral-500">{label}:</span>
    <span className={`text-xs font-medium text-neutral-700 ${valueClassName}`}>{value}</span>
  </li>
);


interface InvestorPropertyReportCardProps {
  property: Property;
  investorInvestment: InvestorInvestment;
  selectedPeriodMonths: string[]; // Array of "YYYY-MM" strings for the selected period
  currentPeriodLabel: string;
}

const InvestorPropertyReportCard: React.FC<InvestorPropertyReportCardProps> = ({ 
    property, investorInvestment, selectedPeriodMonths, currentPeriodLabel 
}) => {
  const ownershipPercentage = useMemo(() => {
    if (!property.investmentGoal || property.investmentGoal === 0) return 0;
    return (investorInvestment.amount / property.investmentGoal) * 100;
  }, [investorInvestment.amount, property.investmentGoal]);

  const ledgerData = property.monthlyLedgerData || [];

  const periodFinancials = useMemo(() => {
    let totalRevenue = 0;
    let totalOpex = 0;
    const aggregatedOpexDetails: OpexDetails = { rent: 0, staff: 0, foodStaff: 0, utilities: 0, maintenance: 0, otherOperatingCosts: 0 };
    let totalNetProfitProperty = 0;
    let totalInvestorShare = 0;
    let totalActualOccupancySum = 0;
    let monthsWithOccupancyData = 0;
    const chartData: Array<{ monthLabel: string; investorShare: number; occupancy: number; revenue: number; expense: number}> = [];

    ledgerData.forEach(entry => {
      if (selectedPeriodMonths.includes(entry.month)) {
        totalRevenue += entry.revenue;
        totalOpex += entry.totalOperatingExpensesActual;
        totalNetProfitProperty += entry.netProfitActual;
        const investorShareForMonth = entry.netProfitActual * (ownershipPercentage / 100);
        totalInvestorShare += investorShareForMonth;

        Object.keys(aggregatedOpexDetails).forEach(key => {
            const opExKey = key as keyof OpexDetails;
            aggregatedOpexDetails[opExKey] += entry.opexActual[opExKey] || 0;
        });
        
        if (entry.occupancyRateActual != null) {
            totalActualOccupancySum += entry.occupancyRateActual;
            monthsWithOccupancyData++;
        }

        chartData.push({
          monthLabel: formatDate(entry.month, {month: 'short', year: 'numeric'}),
          investorShare: parseFloat(investorShareForMonth.toFixed(2)),
          occupancy: parseFloat((entry.occupancyRateActual * 100).toFixed(1)),
          revenue: entry.revenue,
          expense: entry.totalOperatingExpensesActual,
        });
      }
    });
    chartData.sort((a,b) => new Date(a.monthLabel.split(" ").reverse().join("-")).getTime() - new Date(b.monthLabel.split(" ").reverse().join("-")).getTime());

    const averageActualOccupancy = monthsWithOccupancyData > 0 ? (totalActualOccupancySum / monthsWithOccupancyData) * 100 : 0;
    const investorROIForPeriod = investorInvestment.amount > 0 ? (totalInvestorShare / investorInvestment.amount) * 100 : 0;
    
    let annualizedROI = investorROIForPeriod;
    if (selectedPeriodMonths.length < 12 && selectedPeriodMonths.length > 0) {
        annualizedROI = (investorROIForPeriod / selectedPeriodMonths.length) * 12;
    } else if (selectedPeriodMonths.length === 0) {
        annualizedROI = 0; // Or handle as N/A
    }

// FIX: Removed reserveSlots from rentableRooms calculation as it no longer exists in RevenueAssumptions.
// All rooms are considered rentable.
    const rentableRooms = property.revenueAssumptions.numberOfRooms;
    const daysInPeriod = selectedPeriodMonths.length * 30; // Approximation
    const revPAR = rentableRooms > 0 && daysInPeriod > 0 ? totalRevenue / (rentableRooms * daysInPeriod) : 0;

    return {
      totalRevenue,
      totalOpex,
      aggregatedOpexDetails,
      totalNetProfitProperty,
      totalInvestorShare,
      averageActualOccupancy,
      investorROIForPeriod,
      annualizedROI,
      revPAR,
      chartData,
    };
  }, [ledgerData, ownershipPercentage, investorInvestment.amount, selectedPeriodMonths, property.revenueAssumptions]);

  const handleDownloadAgreement = () => alert(`Downloading agreement for ${property.name} (Mock download)`);
  const handleDownloadLedger = () => alert(`Downloading ledger for ${property.name} for ${currentPeriodLabel} (Mock download)`);

  const hasDataForPeriod = periodFinancials.chartData.length > 0 || periodFinancials.totalRevenue > 0;


  return (
    <div className="bg-white shadow-xl rounded-xl mb-8 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-neutral-200 bg-neutral-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary">{property.name}</h2>
                <p className="text-sm text-neutral-500">{property.city} &bull; Period: {currentPeriodLabel}</p>
            </div>
            <Link to={`/property/${property.id}`} target="_blank" className="mt-2 md:mt-0 text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md font-medium">View Property Details</Link>
        </div>
      </div>

      {!hasDataForPeriod && (
           <div className="p-6 text-center text-neutral-500">
                No ledger data available for {property.name} for the selected period: {currentPeriodLabel}.
            </div>
        )}

      {hasDataForPeriod && (
        <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Key Metrics Summary */}
                <div className="md:col-span-1 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-semibold text-green-700 mb-1">Your Share ({currentPeriodLabel})</h4>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(periodFinancials.totalInvestorShare)}</p>
                </div>
                <div className="md:col-span-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-700 mb-1">Property Net Profit ({currentPeriodLabel})</h4>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(periodFinancials.totalNetProfitProperty)}</p>
                </div>
                 <div className="md:col-span-1 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="text-sm font-semibold text-amber-700 mb-1">Your ROI ({currentPeriodLabel})</h4>
                    <p className="text-xl font-bold text-amber-600">{formatPercentage(periodFinancials.investorROIForPeriod)}</p>
                    <p className="text-xs text-amber-500">Annualized: {formatPercentage(periodFinancials.annualizedROI)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 lg:col-span-3">
                    <h4 className="text-base font-semibold text-neutral-600 mb-2">Summary for {currentPeriodLabel}</h4>
                    <ul className="space-y-0.5 text-xs bg-neutral-50 p-3 rounded-md border">
                        <DetailListItem label="Total Property Revenue" value={formatCurrency(periodFinancials.totalRevenue)} valueClassName="text-green-600 font-semibold" />
                        <DetailListItem label="Total Property OpEx" value={formatCurrency(periodFinancials.totalOpex)} valueClassName="text-red-600 font-semibold"/>
                        <li className="pt-1 mt-1 border-t"><DetailListItem label="Property Net Profit" value={formatCurrency(periodFinancials.totalNetProfitProperty)} valueClassName="text-blue-600 font-bold"/></li>
                        <li className="pt-1 mt-1 border-t"><DetailListItem label="Your Share (Net Profit)" value={formatCurrency(periodFinancials.totalInvestorShare)} valueClassName="text-emerald-600 font-bold"/></li>
                        <DetailListItem label="Actual Occupancy" value={formatPercentage(periodFinancials.averageActualOccupancy)} />
                        <DetailListItem label="RevPAR (Est.)" value={formatCurrency(periodFinancials.revPAR)} />
                    </ul>
                     <h4 className="text-base font-semibold text-neutral-600 mt-4 mb-2">OpEx Breakdown ({currentPeriodLabel})</h4>
                     <ul className="space-y-0.5 text-xs bg-neutral-50 p-3 rounded-md border">
                        {Object.entries(periodFinancials.aggregatedOpexDetails).map(([key, value]) => (
                           <DetailListItem key={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} value={formatCurrency(value)} />
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-8 lg:col-span-9">
                     {periodFinancials.chartData.length > 0 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-600 mb-1">Your Monthly Share Trend</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={periodFinancials.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                    <XAxis dataKey="monthLabel" fontSize={9} />
                                    <YAxis fontSize={9} tickFormatter={(val) => formatCurrency(val,0)}/>
                                    <Tooltip formatter={(value: number) => [formatCurrency(value), "Your Share"]} />
                                    <Legend wrapperStyle={{fontSize: "10px"}}/>
                                    <Line type="monotone" dataKey="investorShare" stroke="#0D9488" strokeWidth={2} dot={{r:2}} activeDot={{r:4}} name="Your Monthly Share"/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                             <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-600 mb-1">Occupancy Trend (%)</h4>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <LineChart data={periodFinancials.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                        <XAxis dataKey="monthLabel" fontSize={9}/>
                                        <YAxis unit="%" fontSize={9}/>
                                        <Tooltip formatter={(value: number) => [`${value}%`, "Occupancy"]}/>
                                        <Legend wrapperStyle={{fontSize: "10px"}}/>
                                        <Line type="monotone" dataKey="occupancy" stroke="#F97316" strokeWidth={2} name="Actual Occupancy" dot={{r:2}} activeDot={{r:4}}/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-600 mb-1">Revenue vs. Expense</h4>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <BarChart data={periodFinancials.chartData}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                            <XAxis dataKey="monthLabel" fontSize={9} />
                                            <YAxis fontSize={9} tickFormatter={(val) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(val)}/>
                                            <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]}/>
                                            <Legend wrapperStyle={{fontSize: "10px"}}/>
                                            <Bar dataKey="revenue" fill="#2DD4BF" name="Revenue"/>
                                            <Bar dataKey="expense" fill="#FB923C" name="Expense"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="p-4 sm:p-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={handleDownloadLedger}
            className="w-full sm:w-auto bg-secondary text-primary-dark font-medium py-2 px-4 rounded-md hover:bg-secondary-dark transition-colors text-sm disabled:opacity-50"
            disabled={!hasDataForPeriod}
          >
            Download Period Ledger
          </button>
          <button 
            onClick={handleDownloadAgreement}
            className="w-full sm:w-auto border border-primary text-primary font-medium py-2 px-4 rounded-md hover:bg-primary/5 transition-colors text-sm"
          >
            Download Investment Agreement
          </button>
        </div>
         <Link 
            to="/portal/support"
            state={{ propertyId: property.id, propertyName: property.name, reportPeriod: currentPeriodLabel }} // Pass context to support page
            className="w-full sm:w-auto text-center bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 transition-colors text-sm"
          >
            Ask Question About This Report
        </Link>
      </div>
    </div>
  );
};


const InvestorReportsPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { currentInvestor, properties } = appContext;

  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.ceil((new Date().getMonth() + 1) / 3));
  const [selectedYearForQuarter, setSelectedYearForQuarter] = useState<number>(new Date().getFullYear());
  const [selectedYearForAnnual, setSelectedYearForAnnual] = useState<number>(new Date().getFullYear());

  const { selectedPeriodMonths, currentPeriodLabel } = useMemo(() => {
    let months: string[] = [];
    let label = "";
    if (periodType === 'monthly') {
      months = [selectedMonth];
      label = formatDate(selectedMonth + "-01", { month: 'long', year: 'numeric' });
    } else if (periodType === 'quarterly') {
      months = getMonthsForQuarter(selectedQuarter, selectedYearForQuarter);
      label = `Q${selectedQuarter} ${selectedYearForQuarter}`;
    } else { // annually
      months = getMonthsForYear(selectedYearForAnnual);
      label = `Year ${selectedYearForAnnual}`;
    }
    return { selectedPeriodMonths: months, currentPeriodLabel: label };
  }, [periodType, selectedMonth, selectedQuarter, selectedYearForQuarter, selectedYearForAnnual]);

  if (!currentInvestor) {
    return <PageTitle title="Error" subtitle="No investor logged in." />;
  }

  const investedPropertiesDetails = useMemo(() => {
    return currentInvestor.propertiesInvested.map(investment => {
      const propertyDetails = properties.find(p => p.id === investment.propertyId);
      return propertyDetails ? { property: propertyDetails, investorInvestment: investment } : null;
    }).filter(Boolean) as { property: Property; investorInvestment: InvestorInvestment }[];
  }, [currentInvestor.propertiesInvested, properties]);

  return (
    <div className="pb-4">
      <PageTitle title="My Investment Reports" subtitle={`Detailed performance for ${currentPeriodLabel}.`} />
      
      <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold text-neutral-700 mb-3">Select Reporting Period</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          {(['monthly', 'quarterly', 'annually'] as const).map(type => (
            <label key={type} className="flex items-center space-x-1 cursor-pointer">
              <input 
                type="radio" 
                name="periodType" 
                value={type} 
                checked={periodType === type} 
                onChange={(e) => setPeriodType(e.target.value as 'monthly' | 'quarterly' | 'annually')}
                className="form-radio h-4 w-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-600 capitalize">{type}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {periodType === 'monthly' && (
            <div className="md:col-span-1">
              <label htmlFor="select-month" className="block text-xs font-medium text-neutral-500 mb-1">Select Month</label>
              <input type="month" id="select-month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"/>
            </div>
          )}
          {periodType === 'quarterly' && (
            <>
              <div className="md:col-span-1">
                <label htmlFor="select-quarter" className="block text-xs font-medium text-neutral-500 mb-1">Select Quarter</label>
                <select id="select-quarter" value={selectedQuarter} onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm bg-white">
                  {[1, 2, 3, 4].map(q => <option key={q} value={q}>Q{q}</option>)}
                </select>
              </div>
              <div className="md:col-span-1">
                 <label htmlFor="select-quarter-year" className="block text-xs font-medium text-neutral-500 mb-1">Year</label>
                <input type="number" id="select-quarter-year" value={selectedYearForQuarter} onChange={(e) => setSelectedYearForQuarter(Number(e.target.value))}
                  placeholder="Year" className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                  min="2020" max={new Date().getFullYear() + 5}/>
              </div>
            </>
          )}
          {periodType === 'annually' && (
            <div className="md:col-span-1">
              <label htmlFor="select-year" className="block text-xs font-medium text-neutral-500 mb-1">Select Year</label>
              <input type="number" id="select-year" value={selectedYearForAnnual} onChange={(e) => setSelectedYearForAnnual(Number(e.target.value))}
                placeholder="Year" className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                min="2020" max={new Date().getFullYear() + 5}/>
            </div>
          )}
        </div>
      </div>

      {investedPropertiesDetails.length > 0 ? (
        investedPropertiesDetails.map(({ property, investorInvestment }) => (
          <InvestorPropertyReportCard 
            key={property.id} 
            property={property} 
            investorInvestment={investorInvestment}
            selectedPeriodMonths={selectedPeriodMonths}
            currentPeriodLabel={currentPeriodLabel}
          />
        ))
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-neutral-700 mb-3">No Investments Found</h3>
          <p className="text-neutral-500 mb-6">You currently do not have any active investments through Spacez.</p>
          <Link to="/portal/explore" className={`bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors`}>
            Explore Investment Opportunities
          </Link>
        </div>
      )}
    </div>
  );
};

export default InvestorReportsPage;
