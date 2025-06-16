
import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { Property, MonthlyLedgerEntry } from '../../types';
import { THEME_COLORS } from '../../constants';

const formatCurrency = (value?: number, digits = 0) => value != null ? `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}` : 'N/A';
const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; bgColorClass?: string; textColorClass?: string; }> = 
({ title, value, icon, bgColorClass = `bg-white`, textColorClass = `text-primary` }) => (
  <div className={`${bgColorClass} p-5 rounded-xl shadow-lg border border-neutral-200`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className={`text-md font-medium text-neutral-500`}>{title}</h3>
      {icon && <div className={`p-1.5 rounded-full ${textColorClass} bg-opacity-10 ${bgColorClass === 'bg-white' ? `bg-primary/10` : ''}`}>
         {icon}
      </div>}
    </div>
    <p className={`text-2xl font-bold ${textColorClass}`}>{value}</p>
  </div>
);

const getMonthsForQuarter = (quarter: number, year: number): string[] => {
  const startMonth = (quarter - 1) * 3 + 1;
  return Array.from({ length: 3 }, (_, i) => `${year}-${String(startMonth + i).padStart(2, '0')}`);
};

const getMonthsForYear = (year: number): string[] => {
  return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
};


const AdminPerformanceTrackingPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { properties } = appContext;

  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.ceil((new Date().getMonth() + 1) / 3));
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const { platformMetrics, propertyTableData, currentPeriodLabel } = useMemo(() => {
    let targetMonths: string[] = [];
    let periodLabel = "";

    if (periodType === 'monthly') {
      targetMonths = [selectedMonth];
      const date = new Date(selectedMonth + "-02"); // Use day 02 to avoid timezone issues with end of month
      periodLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (periodType === 'quarterly') {
      targetMonths = getMonthsForQuarter(selectedQuarter, selectedYear);
      periodLabel = `Q${selectedQuarter} ${selectedYear}`;
    } else { // annually
      targetMonths = getMonthsForYear(selectedYear);
      periodLabel = `Year ${selectedYear}`;
    }

    let aggRevenue = 0;
    let aggOpex = 0;
    let aggNetProfit = 0;
    let aggPayouts = 0;

    properties.forEach(p => {
      p.monthlyLedgerData?.forEach(entry => {
        if (targetMonths.includes(entry.month)) {
          aggRevenue += entry.revenue;
          aggOpex += entry.totalOperatingExpensesActual;
          aggNetProfit += entry.netProfitActual;
          aggPayouts += entry.totalPayoutToInvestors;
        }
      });
    });
    
    const calculatedPlatformMetrics = { 
        totalRevenue: aggRevenue, 
        totalOpex: aggOpex, 
        totalNetProfit: aggNetProfit,
        totalPayouts: aggPayouts,
    };

    const calculatedPropertyTableData = properties.map(p => {
      let periodRevenue = 0;
      let periodOpex = 0;
      let periodNetProfit = 0;
      
      p.monthlyLedgerData?.forEach(entry => {
        if (targetMonths.includes(entry.month)) {
          periodRevenue += entry.revenue;
          periodOpex += entry.totalOperatingExpensesActual;
          periodNetProfit += entry.netProfitActual;
        }
      });
      return {
        ...p,
        periodRevenue,
        periodOpex,
        periodNetProfit,
        lastLedgerUpdate: p.lastLedgerUpdate // Keep this as the overall last update for the property
      };
    });

    return { platformMetrics: calculatedPlatformMetrics, propertyTableData: calculatedPropertyTableData, currentPeriodLabel: periodLabel };

  }, [properties, periodType, selectedMonth, selectedQuarter, selectedYear]);


  const [searchTerm, setSearchTerm] = useState('');
  const filteredPropertiesForTable = useMemo(() => {
    return propertyTableData.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => a.name.localeCompare(b.name));
  }, [propertyTableData, searchTerm]);


  return (
    <div>
      <PageTitle title="Platform Performance Tracking" subtitle={`Financial health and property performance for ${currentPeriodLabel}.`} />

      <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold text-neutral-700 mb-3">Select Period</h3>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {periodType === 'monthly' && (
            <div className="md:col-span-1">
              <label htmlFor="select-month" className="block text-xs font-medium text-neutral-500 mb-1">Select Month</label>
              <input 
                type="month" 
                id="select-month"
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          )}
          {periodType === 'quarterly' && (
            <>
              <div className="md:col-span-1">
                <label htmlFor="select-quarter" className="block text-xs font-medium text-neutral-500 mb-1">Select Quarter</label>
                <select 
                  id="select-quarter"
                  value={selectedQuarter} 
                  onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm bg-white"
                >
                  {[1, 2, 3, 4].map(q => <option key={q} value={q}>Q{q}</option>)}
                </select>
              </div>
              <div className="md:col-span-1">
                 <label htmlFor="select-quarter-year" className="block text-xs font-medium text-neutral-500 mb-1">Year for Quarter</label>
                <input 
                  type="number" 
                  id="select-quarter-year"
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  placeholder="Year"
                  className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                  min="2020"
                  max={new Date().getFullYear() + 5}
                />
              </div>
            </>
          )}
          {periodType === 'annually' && (
            <div className="md:col-span-1">
              <label htmlFor="select-year" className="block text-xs font-medium text-neutral-500 mb-1">Select Year</label>
              <input 
                type="number" 
                id="select-year"
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                placeholder="Year"
                className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                min="2020"
                max={new Date().getFullYear() + 5}
              />
            </div>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
            title={`Total Revenue (${currentPeriodLabel})`}
            value={formatCurrency(platformMetrics.totalRevenue)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
            bgColorClass="bg-green-50"
            textColorClass="text-green-600"
        />
        <StatCard 
            title={`Total OpEx (${currentPeriodLabel})`}
            value={formatCurrency(platformMetrics.totalOpex)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6A5.25 5.25 0 0 0 8.25 11.25H18M3.75 4.5H21V18a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6c0-.87.348-1.682.924-2.276S5.13 3 6 3h12c.87 0 1.682.348 2.276.924S21 5.13 21 6v1.5m-11.25 6H12m0 0v3.75m0-3.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm0 0h3.75M12 12.75v-3.75" /></svg>}
            bgColorClass="bg-red-50"
            textColorClass="text-red-600"
        />
        <StatCard 
            title={`Total Net Profit (${currentPeriodLabel})`}
            value={formatCurrency(platformMetrics.totalNetProfit)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>}
            bgColorClass="bg-blue-50"
            textColorClass="text-blue-600"
        />
        <StatCard 
            title={`Total Payouts (${currentPeriodLabel})`}
            value={formatCurrency(platformMetrics.totalPayouts)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
            bgColorClass="bg-yellow-50"
            textColorClass="text-yellow-600"
        />
      </div>
      
      <div className="mb-4">
        <input 
            type="text"
            placeholder="Search properties by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-neutral-50 border-b-2 border-neutral-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Property Name</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">City</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Ledger Update</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Revenue ({currentPeriodLabel})</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">OpEx ({currentPeriodLabel})</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Net Profit ({currentPeriodLabel})</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredPropertiesForTable.map(property => {
              return (
                <tr key={property.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 text-sm text-neutral-700 font-medium">{property.name}</td>
                  <td className="py-3.5 px-4 text-sm text-neutral-600">{property.city}</td>
                  <td className="py-3.5 px-4 text-sm text-neutral-500">{formatDate(property.lastLedgerUpdate)}</td>
                  <td className="py-3.5 px-4 text-sm text-neutral-600 text-right">{formatCurrency(property.periodRevenue)}</td>
                  <td className="py-3.5 px-4 text-sm text-neutral-600 text-right">{formatCurrency(property.periodOpex)}</td>
                  <td className={`py-3.5 px-4 text-sm font-semibold text-right ${property.periodNetProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCurrency(property.periodNetProfit)}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-center">
                    <Link 
                      to={`/admin/properties/${property.id}/update-ledger`}
                      className="bg-accent text-white text-xs font-medium py-1.5 px-3 rounded-md hover:bg-accent-dark transition-colors"
                    >
                      Update Ledger
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filteredPropertiesForTable.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-neutral-500">
                        No properties found matching your search criteria, or no ledger data for the selected period.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPerformanceTrackingPage;
