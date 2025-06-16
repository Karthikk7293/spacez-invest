
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { Property, InvestorInvestment, PropertyStatus, MonthlyLedgerEntry } from '../../types';
import { THEME_COLORS } from '../../constants';

const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const formatPercentage = (value: number | undefined, digits = 1) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `${value.toFixed(digits)}%`;
};

const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; linkTo?: string; linkText?: string; bgColorClass?: string; textColorClass?: string; }> = 
({ title, value, icon, linkTo, linkText, bgColorClass = `bg-white`, textColorClass = `text-primary` }) => (
  <div className={`${bgColorClass} p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between h-full`}>
    <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className={`text-sm sm:text-base font-medium text-neutral-500`}>{title}</h3>
        {icon && <div className={`p-1.5 sm:p-2 rounded-full ${textColorClass} bg-opacity-10 ${bgColorClass === `bg-white` ? `bg-primary/10` : ''}`}>
            {icon}
        </div>}
        </div>
        <p className={`text-2xl sm:text-3xl font-bold ${textColorClass}`}>{value}</p>
    </div>
    {linkTo && linkText && (
      <Link to={linkTo} className={`mt-3 sm:mt-4 inline-block text-xs sm:text-sm ${textColorClass} hover:underline font-medium`}>
        {linkText} &rarr;
      </Link>
    )}
  </div>
);


const InvestorDashboardPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { currentInvestor, properties } = appContext;

  const portfolioMetrics = useMemo(() => {
    if (!currentInvestor) return {
      totalCapitalInvested: 0,
      cumulativeProfitEarned: 0,
      activePropertiesCount: 0,
      averagePortfolioROIToDate: 0,
    };

    let totalCapital = 0;
    let cumulativeProfit = 0;
    let activeProps = 0;

    currentInvestor.propertiesInvested.forEach(investment => {
      totalCapital += investment.amount;
      const propertyDetails = properties.find(p => p.id === investment.propertyId);
      if (propertyDetails) {
        if (propertyDetails.status !== PropertyStatus.Closed) {
          activeProps++;
        }
        const ownershipPercentage = (investment.amount / propertyDetails.investmentGoal) * 100;
        propertyDetails.monthlyLedgerData?.forEach(entry => {
          cumulativeProfit += entry.netProfitActual * (ownershipPercentage / 100);
        });
      }
    });
    
    const averageROI = totalCapital > 0 ? (cumulativeProfit / totalCapital) * 100 : 0;

    return {
      totalCapitalInvested: totalCapital,
      cumulativeProfitEarned: cumulativeProfit,
      activePropertiesCount: activeProps,
      averagePortfolioROIToDate: averageROI,
    };
  }, [currentInvestor, properties]);

  if (!currentInvestor) {
    return <PageTitle title="Error" subtitle="No investor logged in." />;
  }
  
  const handleDownloadPortfolioReport = () => {
      alert("Downloading your consolidated Portfolio Report (Mock Download). This would typically generate a PDF or Excel file.");
  };

  return (
    <div className="pb-4">
      <PageTitle title="Portfolio Overview" subtitle={`Welcome back, ${currentInvestor.name}! Here's a snapshot of your investments.`} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard 
          title="Total Capital Invested"
          value={formatCurrency(portfolioMetrics.totalCapitalInvested)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6A5.25 5.25 0 0 0 8.25 11.25H18M3.75 4.5H21V18a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6c0-.87.348-1.682.924-2.276S5.13 3 6 3h12c.87 0 1.682.348 2.276.924S21 5.13 21 6v1.5M12 6.75v10.5M16.5 9.75v4.5M7.5 9.75v4.5M12 4.5V3M16.5 7.5V3M7.5 7.5V3" /></svg>}
          bgColorClass="bg-blue-50"
          textColorClass="text-blue-600"
        />
        <StatCard 
          title="Cumulative Profit Earned"
          value={formatCurrency(portfolioMetrics.cumulativeProfitEarned)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          bgColorClass="bg-green-50"
          textColorClass="text-green-600"
          linkTo="/portal/finances"
          linkText="View Payouts"
        />
        <StatCard 
          title="Active Properties"
          value={portfolioMetrics.activePropertiesCount}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 0 1 .375.375v11.25a.375.375 0 0 1-.375.375H9A.375.375 0 0 1 8.625 18.375V7.125A.375.375 0 0 1 9 6.75Z" /></svg>}
          bgColorClass="bg-indigo-50"
          textColorClass="text-indigo-600"
          linkTo="/portal/reports"
          linkText="View Reports"
        />
        <StatCard 
          title="Portfolio ROI to Date"
          value={formatPercentage(portfolioMetrics.averagePortfolioROIToDate)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>}
          bgColorClass="bg-amber-50"
          textColorClass="text-amber-600"
        />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-neutral-700 mb-4">Manage Your Investments</h3>
        <p className="text-neutral-500 mb-6 max-w-xl mx-auto">
          Dive deeper into your property reports, track your financial transactions, explore new opportunities, or get support.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link to="/portal/reports" className={`bg-primary text-white font-medium py-2.5 px-5 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base`}>
            View Detailed Reports
          </Link>
          <Link to="/portal/finances" className={`bg-secondary text-primary-dark font-medium py-2.5 px-5 rounded-lg hover:bg-secondary-dark transition-colors text-sm sm:text-base`}>
            Track My Finances
          </Link>
           <button 
            onClick={handleDownloadPortfolioReport}
            className={`bg-neutral-200 text-neutral-700 font-medium py-2.5 px-5 rounded-lg hover:bg-neutral-300 transition-colors text-sm sm:text-base`}
          >
            Download Portfolio Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardPage;