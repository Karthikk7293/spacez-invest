import React, { useContext, useMemo, useState } from 'react';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { Property, InvestorInvestment, MonthlyLedgerEntry } from '../../types';

const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
   if (dateString.match(/^\d{4}-\d{2}$/)) { // Handles "YYYY-MM" for payout month
    const [year, month] = dateString.split('-');
    // Display as "Month Year" e.g. "May 2025 Payout"
    return new Date(parseInt(year), parseInt(month) - 1, 15).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }
  return date.toLocaleDateString('en-IN', options || { year: 'numeric', month: 'short', day: 'numeric' });
};


const getMonthsForQuarter = (quarter: number, year: number): string[] => {
  const startMonth = (quarter - 1) * 3 + 1;
  return Array.from({ length: 3 }, (_, i) => `${year}-${String(startMonth + i).padStart(2, '0')}`);
};

const getMonthsForYear = (year: number): string[] => {
  return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
};

interface Transaction {
  id: string;
  date: string; // YYYY-MM for payouts, full ISO for investments
  propertyId?: string;
  propertyName?: string;
  type: 'Monthly Payout' | 'Initial Investment' | 'Additional Investment' | 'Withdrawal' | 'Fee';
  amount: number; // Positive for credit to investor, negative for debit
  status: 'Paid' | 'Pending' | 'Processing' | 'Failed';
}

const InvestorTransactionsPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { currentInvestor, properties } = appContext;

  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.ceil((new Date().getMonth() + 1) / 3));
  const [selectedYearForQuarter, setSelectedYearForQuarter] = useState<number>(new Date().getFullYear());
  const [selectedYearForAnnual, setSelectedYearForAnnual] = useState<number>(new Date().getFullYear());

  const { transactions, currentPeriodLabel } = useMemo(() => {
    if (!currentInvestor) return { transactions: [], currentPeriodLabel: "" };

    let targetMonths: string[] = [];
    let periodLabel = "";

    if (periodType === 'monthly') {
      targetMonths = [selectedMonth];
      const date = new Date(selectedMonth + "-15"); // Use mid-month day
      periodLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (periodType === 'quarterly') {
      targetMonths = getMonthsForQuarter(selectedQuarter, selectedYearForQuarter);
      periodLabel = `Q${selectedQuarter} ${selectedYearForQuarter}`;
    } else { // annually
      targetMonths = getMonthsForYear(selectedYearForAnnual);
      periodLabel = `Year ${selectedYearForAnnual}`;
    }
    
    const generatedTransactions: Transaction[] = [];

    // Add initial investments
    currentInvestor.propertiesInvested.forEach(inv => {
        const investmentDate = inv.dateInvested ? new Date(inv.dateInvested) : new Date(); // Fallback, should have date
        const investmentMonthYear = investmentDate.toISOString().slice(0,7);

        if (targetMonths.includes(investmentMonthYear) || periodType === 'annually' && investmentDate.getFullYear() === selectedYearForAnnual || periodType === 'quarterly' && targetMonths.includes(investmentMonthYear)) {
             const prop = properties.find(p => p.id === inv.propertyId);
             generatedTransactions.push({
                id: `invest-${inv.propertyId}-${inv.dateInvested}`,
                date: inv.dateInvested || new Date().toISOString(),
                propertyId: inv.propertyId,
                propertyName: prop?.name || 'Unknown Property',
                type: 'Initial Investment',
                amount: -inv.amount, // Debit from investor's perspective for investment
                status: 'Paid',
            });
        }
    });

    // Add monthly payouts
    currentInvestor.propertiesInvested.forEach(investment => {
      const propertyDetails = properties.find(p => p.id === investment.propertyId);
      if (propertyDetails && propertyDetails.monthlyLedgerData) {
        const ownershipPercentage = (investment.amount / propertyDetails.investmentGoal) * 100;
        propertyDetails.monthlyLedgerData.forEach(entry => {
          if (targetMonths.includes(entry.month)) {
            const investorPayout = entry.totalPayoutToInvestors * (ownershipPercentage / 100);
            if (investorPayout > 0) { // Only list actual payouts
                 generatedTransactions.push({
                    id: `payout-${propertyDetails.id}-${entry.month}`,
                    date: entry.month, // Store as YYYY-MM for payout "date"
                    propertyId: propertyDetails.id,
                    propertyName: propertyDetails.name,
                    type: 'Monthly Payout',
                    amount: investorPayout, // Credit to investor
                    status: 'Paid', // Mock status
                });
            }
          }
        });
      }
    });

    generatedTransactions.sort((a, b) => {
        // For 'YYYY-MM' dates, append a day to make them comparable as full dates
        const dateA = a.date.length === 7 ? new Date(a.date + '-15') : new Date(a.date);
        const dateB = b.date.length === 7 ? new Date(b.date + '-15') : new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Sort descending by date
    });
    
    return { transactions: generatedTransactions, currentPeriodLabel: periodLabel };

  }, [currentInvestor, properties, periodType, selectedMonth, selectedQuarter, selectedYearForQuarter, selectedYearForAnnual]);


  if (!currentInvestor) {
    return <PageTitle title="Error" subtitle="No investor logged in." />;
  }

  return (
    <div className="pb-4">
      <PageTitle title="My Finances & Payouts" subtitle={`Transaction history for ${currentPeriodLabel}.`} />

       <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold text-neutral-700 mb-3">Select Period</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          {(['monthly', 'quarterly', 'annually'] as const).map(type => (
            <label key={type} className="flex items-center space-x-1 cursor-pointer">
              <input type="radio" name="periodType" value={type} checked={periodType === type} 
                onChange={(e) => setPeriodType(e.target.value as 'monthly' | 'quarterly' | 'annually')}
                className="form-radio h-4 w-4 text-primary focus:ring-primary"/>
              <span className="text-sm text-neutral-600 capitalize">{type}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {periodType === 'monthly' && (
            <div className="md:col-span-1">
              <label htmlFor="select-month" className="block text-xs font-medium text-neutral-500 mb-1">Month</label>
              <input type="month" id="select-month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"/>
            </div>
          )}
          {periodType === 'quarterly' && (
            <>
              <div className="md:col-span-1">
                <label htmlFor="select-quarter" className="block text-xs font-medium text-neutral-500 mb-1">Quarter</label>
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
              <label htmlFor="select-year" className="block text-xs font-medium text-neutral-500 mb-1">Year</label>
              <input type="number" id="select-year" value={selectedYearForAnnual} onChange={(e) => setSelectedYearForAnnual(Number(e.target.value))}
                placeholder="Year" className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                min="2020" max={new Date().getFullYear() + 5}/>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-neutral-50 border-b-2 border-neutral-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase">Date</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase">Property</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase">Type</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase">Amount</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-neutral-500 uppercase">Status</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {transactions.length > 0 ? transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-neutral-50">
                <td className="py-3.5 px-4 text-sm text-neutral-600">{formatDate(tx.date, tx.date.length === 7 ? {month:'long', year:'numeric'} : undefined)}</td>
                <td className="py-3.5 px-4 text-sm text-neutral-700 font-medium">{tx.propertyName || 'N/A'}</td>
                <td className="py-3.5 px-4 text-sm text-neutral-600">{tx.type}</td>
                <td className={`py-3.5 px-4 text-sm text-right font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </td>
                <td className="py-3.5 px-4 text-sm text-center">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    tx.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-sm text-center space-x-2">
                  <button onClick={() => alert(`Downloading receipt for ${tx.type} (Mock)`)} className="text-primary hover:underline text-xs">Receipt</button>
                  {tx.type === 'Monthly Payout' && <button onClick={() => alert('Downloading TDS Certificate (Mock)')} className="text-primary hover:underline text-xs">TDS Cert.</button>}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-neutral-500">
                  No transactions found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestorTransactionsPage;