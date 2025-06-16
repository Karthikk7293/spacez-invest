
import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import { THEME_COLORS } from '../../constants';

// Icons for Investor Portal
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 14.25v4.5A2.25 2.25 0 0 0 6 21h12a2.25 2.25 0 0 0 2.25-2.25v-4.5M3.75 14.25H6M18 14.25h2.25m-7.5 0V3M9 16.5v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V16.5m-7.5-4.875h7.5" /></svg>;
const DocumentReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" /></svg>;
const QuestionMarkCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>;
const MagnifyingGlassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>;
const SiteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronDoubleLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>;
const ChevronDoubleRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>;


const InvestorPortalLayout: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    appContext.logoutInvestor();
    navigate('/investor-login');
  };

  const navItems = [
    { path: '/portal/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/portal/reports', label: 'My Reports', icon: <DocumentReportIcon /> },
    { path: '/portal/finances', label: 'My Finances', icon: <CreditCardIcon /> },
    { path: '/portal/explore', label: 'Explore Investments', icon: <MagnifyingGlassIcon /> },
    { path: '/portal/support', label: 'Support', icon: <QuestionMarkCircleIcon /> },
  ];
  
  const getPageTitle = () => {
    const currentNavItem = navItems.find(item => location.pathname.startsWith(item.path));
    if (currentNavItem) return currentNavItem.label;
    if (location.pathname === '/portal') return 'Dashboard'; // Default to Dashboard if at /portal
    return 'Investor Portal';
  }
  const currentPageTitle = getPageTitle();
  
  const getInvestorInitials = () => {
    if (!appContext.currentInvestor?.name) return "IP"; // Investor Portal
    const nameParts = appContext.currentInvestor.name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length -1]) {
      return nameParts[0][0].toUpperCase() + nameParts[nameParts.length - 1][0].toUpperCase();
    }
    return nameParts[0] ? nameParts[0].substring(0, 2).toUpperCase() : "IP";
  };

  const SidebarContent: React.FC<{isMini: boolean}> = ({ isMini }) => (
     <>
        <div className={`p-6 text-center border-b border-primary/50 ${isMini ? 'h-16 flex items-center justify-center' : 'h-20 flex items-center justify-center'}`}>
          <Link 
            to="/portal/dashboard" 
            className={`font-bold text-white hover:text-secondary transition-colors truncate ${isMini ? 'text-xl' : 'text-xl leading-tight'}`}
          >
            {isMini ? getInvestorInitials() : `${appContext.currentInvestor?.name}'s Portal`}
          </Link>
        </div>
        <nav className="flex-grow px-3 py-4 space-y-1.5">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              // End prop logic: exact match for dashboard, startsWith for others
              end={item.path === '/portal/dashboard'} 
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out group
                ${isMini ? 'justify-center' : ''}
                ${isActive ? 'bg-primary text-white shadow-inner' : 'text-neutral-300 hover:bg-primary/80 hover:text-white'}`
              }
              title={isMini ? item.label : undefined}
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
            >
              <span className="group-hover:scale-110 transition-transform duration-150">{item.icon}</span>
              {!isMini && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className={`p-3 mt-auto border-t border-primary/50 ${isMini ? 'space-y-2' : ''}`}>
          {!isMini && (
            <Link 
                to="/" 
                target="_blank"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-primary/80 hover:text-white transition-colors group"
            >
                <SiteIcon />
                <span>Back to Spacez.co</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 mt-1 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors group ${isMini ? 'justify-center' : ''}`}
            title={isMini ? "Logout" : undefined}
          >
            <LogoutIcon />
            {!isMini && <span className="group-hover:underline">Logout</span>}
          </button>
        </div>
    </>
  );

  return (
    <div className="flex h-screen bg-neutral-100">
      <aside className={`hidden md:flex flex-col bg-primary-dark text-neutral-200 shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent isMini={isCollapsed} />
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center p-1.5 mx-auto my-2 text-neutral-300 hover:text-white hover:bg-primary/50 rounded-full transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
        </button>
      </aside>

      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
        ></div>
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-dark text-neutral-200 flex flex-col shadow-lg transform md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="absolute top-4 right-4 text-neutral-300 hover:text-white p-1"
            aria-label="Close menu"
          >
            <XIcon />
          </button>
          <SidebarContent isMini={false} />
      </aside>

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}>
        <header className="bg-white shadow-md p-4 sticky top-0 z-20 flex items-center">
           <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="md:hidden text-neutral-600 hover:text-primary p-2 mr-2"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <h2 className="text-xl font-semibold text-neutral-700">{currentPageTitle}</h2>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-6 md:p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default InvestorPortalLayout;