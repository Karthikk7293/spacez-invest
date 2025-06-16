

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { PropertyStatus } from '../../types';
import { THEME_COLORS, MOCK_INVESTORS } from '../../constants';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; linkTo?: string; bgColorClass?: string; textColorClass?: string; }> = 
({ title, value, icon, linkTo, bgColorClass = `bg-white`, textColorClass = `text-primary` }) => (
  <div className={`${bgColorClass} p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200`}>
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <h3 className={`text-sm sm:text-lg font-medium text-neutral-500`}>{title}</h3>
      <div className={`p-1.5 sm:p-2 rounded-full ${textColorClass} bg-opacity-20 ${bgColorClass === `bg-white` ? `bg-primary/10` : ''}`}>
         {icon}
      </div>
    </div>
    <p className={`text-2xl sm:text-3xl font-bold ${textColorClass}`}>{value}</p>
    {linkTo && (
      <Link to={linkTo} className={`mt-3 sm:mt-4 inline-block text-xs sm:text-sm ${textColorClass} hover:underline`}>
        View Details &rarr;
      </Link>
    )}
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { properties } = appContext;

  const totalProperties = properties.length;
  const liveProperties = properties.filter(p => p.status === PropertyStatus.Live).length;
  const draftProperties = properties.filter(p => p.status === PropertyStatus.Draft).length;
  const fundedProperties = properties.filter(p => p.status === PropertyStatus.FullyFunded).length;
  const totalInvestmentRaised = properties.reduce((sum, p) => sum + p.amountRaised, 0);
  const totalInvestmentGoal = properties.reduce((sum, p) => sum + (p.investmentGoal || 0), 0); 
  const totalInvestors = MOCK_INVESTORS.length; 

  return (
    <div>
      <PageTitle title="Admin Dashboard" subtitle="Overview of Spacez operations and investments." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard 
          title="Total Properties" 
          value={totalProperties} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 0 1 .375.375v11.25a.375.375 0 0 1-.375.375H9A.375.375 0 0 1 8.625 18.375V7.125A.375.375 0 0 1 9 6.75Z" /></svg>}
          linkTo="/admin/properties"
        />
        <StatCard 
          title="Live for Funding" 
          value={liveProperties} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          linkTo="/admin/properties?status=Live"
          bgColorClass={`bg-emerald-50`}
          textColorClass={`text-emerald-600`}
        />
         <StatCard 
          title="Total Investors" 
          value={totalInvestors} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.243-3.72a9.094 9.094 0 0 1-.479 3.741M18 18.72v-3.75m-12 2.832a9.091 9.091 0 0 1-.479-3.741m0 0a9.107 9.107 0 0 1 3.741-.479m-.243 3.72a9.09 9.09 0 0 0 .479 3.741M12 18.75v-3.75m9-.75a9 9 0 0 0-9-9s-9 2.25-9 9s2.25 9 9 9s9-2.25 9-9Zm-9-7.5A2.25 2.25 0 0 1 9.75 9V9.75A2.25 2.25 0 0 1 7.5 12v0a2.25 2.25 0 0 1 2.25-2.25h.75A2.25 2.25 0 0 1 12.75 12v0a2.25 2.25 0 0 1 2.25-2.25h.75A2.25 2.25 0 0 1 18 12v0a2.25 2.25 0 0 1-2.25 2.25h-.75A2.25 2.25 0 0 1 12.75 12V9.75A2.25 2.25 0 0 1 15 7.5v0Z" /></svg>}
          linkTo="/admin/investors"
        />
        <StatCard 
          title="Total Raised" 
          value={`₹${totalInvestmentRaised.toLocaleString('en-IN')}`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6A5.25 5.25 0 0 0 8.25 11.25H18M3.75 4.5H21V18a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6c0-.87.348-1.682.924-2.276S5.13 3 6 3h12c.87 0 1.682.348 2.276.924S21 5.13 21 6v1.5M12 6.75v10.5M16.5 9.75v4.5M7.5 9.75v4.5M12 4.5V3M16.5 7.5V3M7.5 7.5V3" /></svg>}
          bgColorClass={`bg-yellow-50`}
          textColorClass={`text-yellow-600`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className={`bg-white p-5 sm:p-6 rounded-xl shadow-lg`}>
          <h3 className={`text-lg sm:text-xl font-semibold text-neutral-800 mb-4`}>Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/properties/new" className={`block w-full text-center bg-primary text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm sm:text-base`}>
              + Add New Property
            </Link>
            <Link to="/admin/properties" className={`block w-full text-center bg-neutral-200 text-neutral-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-neutral-300 transition-colors font-medium text-sm sm:text-base`}>
              Manage All Properties
            </Link>
            <Link to="/admin/investors" className={`block w-full text-center bg-neutral-200 text-neutral-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-neutral-300 transition-colors font-medium text-sm sm:text-base`}>
              View Investor List
            </Link>
          </div>
        </div>

        <div className={`bg-white p-5 sm:p-6 rounded-xl shadow-lg`}>
          <h3 className={`text-lg sm:text-xl font-semibold text-neutral-800 mb-4`}>Recent Activity (Placeholder)</h3>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li className="flex justify-between items-center p-2 bg-neutral-50 rounded"><span>New investment in "Villa Amaya"</span> <span className="text-neutral-500">2 hours ago</span></li>
            <li className="flex justify-between items-center p-2 bg-neutral-50 rounded"><span>"Casa Verde" marked as Fully Funded</span> <span className="text-neutral-500">1 day ago</span></li>
            <li className="flex justify-between items-center p-2 bg-neutral-50 rounded"><span>New investor registered: Priya S.</span> <span className="text-neutral-500">2 days ago</span></li>
            <li className="flex justify-between items-center p-2 bg-neutral-50 rounded"><span>Monthly payouts processed</span> <span className="text-neutral-500">5 days ago</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;