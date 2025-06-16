
import React from 'react';
import PageTitle from '../components/PageTitle';
import { THEME_COLORS } from '../constants';

const InvestorDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <PageTitle title="Investor Dashboard" subtitle="Track your investments and returns." />
      <div className={`bg-${THEME_COLORS.cardBackground} p-8 rounded-lg shadow-xl text-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-16 h-16 mx-auto text-${THEME_COLORS.primary} mb-4`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <h2 className={`text-2xl font-semibold text-${THEME_COLORS.textBase} mb-3`}>Coming Soon!</h2>
        <p className={`text-${THEME_COLORS.textMuted} mb-6`}>
          The investor dashboard is currently under development. Please check back later to view your investments, track payouts, and manage your account.
        </p>
        <p className={`text-${THEME_COLORS.textMuted}`}>
          For now, this feature requires login and backend integration.
        </p>
      </div>
    </div>
  );
};

export default InvestorDashboardPage;
