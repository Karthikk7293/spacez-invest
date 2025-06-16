
import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import { THEME_COLORS } from '../../constants';
import { SupportTicketStatus } from '../../types'; // Import SupportTicketStatus

// Simple SVG Icons for Admin Sidebar
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 14.25v4.5A2.25 2.25 0 0 0 6 21h12a2.25 2.25 0 0 0 2.25-2.25v-4.5M3.75 14.25H6M18 14.25h2.25m-7.5 0V3M9 16.5v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V16.5m-7.5-4.875h7.5" /></svg>;
const PropertiesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21H8.25V10.5M8.25 21H3.75M21 21H17.25M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m0 0V3.75m3 9.75A1.5 1.5 0 0 1 9 13.5m0 0a1.5 1.5 0 0 0 3 0m0 0V6.75m0 0A1.5 1.5 0 0 1 15 5.25m0 0A1.5 1.5 0 0 0 13.5 3.75m0 0V1.5m0 0A1.5 1.5 0 0 1 15 0M3 1.5V3.75m0 0A1.5 1.5 0 0 1 4.5 5.25M4.5 5.25A1.5 1.5 0 0 0 3 6.75m0 0v6.75m0 0A1.5 1.5 0 0 1 1.5 15m0 0A1.5 1.5 0 0 0 0 16.5m0 0v3M1.5 21A1.5 1.5 0 0 0 3 19.5m0 0A1.5 1.5 0 0 1 4.5 18m0 0A1.5 1.5 0 0 0 6 16.5m0 0v-3.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V16.5m0 0A1.5 1.5 0 0 1 19.5 18m0 0a1.5 1.5 0 0 0 1.5-1.5m0 0v-3.375c0-.621-.504-1.125-1.125-1.125H18M19.5 21a1.5 1.5 0 0 0 1.5-1.5m0 0V1.5m0 0A1.5 1.5 0 0 0 19.5 0M18 1.5V3.75m0 0a1.5 1.5 0 0 0 1.5 1.5m1.5-1.5A1.5 1.5 0 0 1 18 3.75M15 6.75V5.25m0 1.5A1.5 1.5 0 0 1 13.5 8.25m0 0A1.5 1.5 0 0 0 12 9.75M9 6.75V5.25m0 1.5A1.5 1.5 0 0 1 7.5 8.25m0 0A1.5 1.5 0 0 0 6 9.75" /></svg>;
const InvestorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;
const PerformanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>;
const ProspectsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12.75v6.75a2.25 2.25 0 002.25 2.25Z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>;
const SiteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronDoubleLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>;
const ChevronDoubleRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>;


const AdminLayout: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    appContext.logoutAdmin();
    navigate('/admin/login');
  };
  
  const unresolvedSupportRequestsCount = appContext.supportRequests.filter(
    req => req.status === SupportTicketStatus.New || req.status === SupportTicketStatus.InProgress
  ).length;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/admin/properties', label: 'Manage Properties', icon: <PropertiesIcon /> },
    { path: '/admin/investors', label: 'Investor Management', icon: <InvestorsIcon /> },
    { path: '/admin/prospects', label: 'View Prospects', icon: <ProspectsIcon /> },
    { 
      path: '/admin/support-requests', 
      label: 'Support Requests', 
      icon: <SupportIcon />,
      badgeCount: unresolvedSupportRequestsCount
    },
    { path: '/admin/performance', label: 'Performance Tracking', icon: <PerformanceIcon /> },
  ];
  
  const getPageTitle = () => {
    if (location.pathname.match(/\/admin\/properties\/[^/]+\/update-ledger$/)) {
        const propertyId = location.pathname.split('/')[3];
        const property = appContext.properties.find(p => p.id === propertyId);
        return property ? `Update Ledger: ${property.name}` : 'Update Property Ledger';
    }
    const currentNavItem = navItems.find(item => location.pathname.startsWith(item.path) && item.path !== '/admin/properties/new');
    if (currentNavItem) return currentNavItem.label;
    if (location.pathname === '/admin/properties/new') return 'Add New Property';
    if (location.pathname.startsWith('/admin/properties/edit/')) return 'Edit Property';
    if (location.pathname === '/admin') return 'Dashboard';
    return 'Admin Panel';
  }

  const currentPageTitle = getPageTitle();

  const SidebarContent: React.FC<{isMini: boolean}> = ({ isMini }) => (
    <>
        <div className={`p-6 text-center border-b border-primary-light/20 ${isMini ? 'h-16 flex items-center justify-center' : 'h-20 flex items-center justify-center'}`}>
          <Link 
            to="/admin/dashboard" 
            className={`text-xl font-bold text-white hover:text-secondary transition-colors ${isMini ? 'text-2xl' : 'text-3xl'}`}
          >
            {isMini ? 'SA' : 'Spacez Admin'}
          </Link>
        </div>
        <nav className="flex-grow px-3 py-4 space-y-1.5">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin/dashboard' || item.path === '/admin/properties' || item.path === '/admin/investors' || item.path === '/admin/prospects' || item.path === '/admin/support-requests' || item.path === '/admin/performance' } 
              className={({ isActive }) =>
                `relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out group
                ${isMini ? 'justify-center' : ''}
                ${isActive ? 'bg-primary-dark text-white shadow-inner' : 'hover:bg-primary-dark/80 hover:text-white'}`
              }
              title={isMini ? item.label : undefined} // Show tooltip for label when collapsed
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)} // Close mobile menu on nav
            >
              <span className="group-hover:scale-110 transition-transform duration-150">{item.icon}</span>
              {!isMini && <span>{item.label}</span>}
              {item.badgeCount && item.badgeCount > 0 && (
                <span 
                  className={`absolute top-1 right-1 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2
                             ${isMini ? 'top-0 right-0 translate-x-1/4 -translate-y-1/4 text-[0.65rem] w-4 h-4' : 'w-5 h-5'}`}
                >
                  {item.badgeCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className={`p-3 mt-auto border-t border-primary-light/20 ${isMini ? 'space-y-2' : ''}`}>
          {!isMini && (
            <Link 
                to="/" 
                target="_blank"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark/80 hover:text-white transition-colors group"
            >
                <SiteIcon />
                <span>Back to Main Site</span>
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
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-primary text-neutral-200 shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}>
        <SidebarContent isMini={isCollapsed} />
         <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center p-2 mx-auto my-2 text-neutral-300 hover:text-white hover:bg-primary-dark/50 rounded-full transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
        </button>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
        ></div>
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-primary text-neutral-200 flex flex-col shadow-lg transform md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="absolute top-4 right-4 text-neutral-300 hover:text-white p-1"
            aria-label="Close menu"
          >
            <XIcon />
          </button>
          <SidebarContent isMini={false} />
      </aside>


      {/* Main Content Area */}
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

export default AdminLayout;
