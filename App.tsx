

import React, { useState, useEffect, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AvailablePropertiesPage from './pages/AvailablePropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
// Investor Portal
import InvestorLoginPage from './pages/investor/InvestorLoginPage';
import InvestorPortalLayout from './pages/investor/InvestorPortalLayout';
import InvestorDashboardPage from './pages/investor/InvestorDashboardPage';
import InvestorExplorePropertiesPage from './pages/investor/InvestorExplorePropertiesPage'; 
import InvestorReportsPage from './pages/investor/InvestorReportsPage'; // New
import InvestorTransactionsPage from './pages/investor/InvestorTransactionsPage'; // New
import InvestorSupportPage from './pages/investor/InvestorSupportPage'; // New


import SuccessStoriesPage from './pages/SuccessStoriesPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCreatePropertyPage from './pages/admin/AdminCreatePropertyPage';
import AdminManagePropertiesPage from './pages/admin/AdminManagePropertiesPage';
import AdminInvestorManagementPage from './pages/admin/AdminInvestorManagementPage';
import AdminInvestorDetailPage from './pages/admin/AdminInvestorDetailPage'; // Import new page
import AdminPerformanceTrackingPage from './pages/admin/AdminPerformanceTrackingPage';
import AdminUpdateLedgerPage from './pages/admin/properties/AdminUpdateLedgerPage'; 
import AdminProspectsPage from './pages/admin/AdminProspectsPage';
import AdminSupportRequestsPage from './pages/admin/AdminSupportRequestsPage'; 
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage'; 
import ContactSupportPage from './pages/ContactSupportPage';
import FAQPage from './pages/FAQPage'; 
import BlogPage from './pages/BlogPage'; 
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage'; 
import TermsOfServicePage from './pages/legal/TermsOfServicePage'; 
import DisclaimerPage from './pages/legal/DisclaimerPage'; 

import { Property, MOCK_PROPERTIES, MOCK_INVESTORS, Investor, MOCK_SUPPORT_REQUESTS } from './constants'; // Added MOCK_SUPPORT_REQUESTS
import { Prospect, SupportRequest, SupportTicketStatus, MonthlyLedgerEntry, OpexDetails, LedgerUpdateLogEntry } from './types';

// Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const BuildingOfficeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 0 1 .375.375v11.25a.375.375 0 0 1-.375.375H9A.375.375 0 0 1 8.625 18.375V7.125A.375.375 0 0 1 9 6.75ZM9.75 6.75V4.5m4.5 2.25V4.5m2.25.75V5.25m0 2.25v2.25m-8.25-4.5v2.25m-2.25 2.25V7.5M9 12h6m-6 3h6m-6 3h6M3.75 6.75h1.5v1.5h-1.5v-1.5Zm0 3h1.5v1.5h-1.5v-1.5Zm0 3h1.5v1.5h-1.5v-1.5Zm0 3h1.5v1.5h-1.5v-1.5Zm15-9.75h-1.5v1.5h1.5v-1.5Zm0 3h-1.5v1.5h1.5v-1.5Zm0 3h-1.5v1.5h1.5v-1.5Zm0 3h-1.5v1.5h1.5v-1.5Z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.5 13.5h3.75m0 0v3.75m0-3.75L15 15m5.25-1.5L21.75 15" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h3.75c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-3.75A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-3.75a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-3.75a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;


// Social Media Icons
const FacebookIcon = () => <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" /></svg>;
const TwitterIcon = () => <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.422.724-.665 1.56-.665 2.452 0 1.69.86 3.174 2.166 4.049-.79-.024-1.533-.241-2.17-.598v.056c0 2.362 1.682 4.331 3.907 4.782-.407.11-.835.169-1.28.169-.314 0-.618-.03-.916-.086.621 1.931 2.422 3.336 4.553 3.375-1.671 1.307-3.778 2.086-5.997 2.086-.388 0-.77-.023-1.144-.067 2.161 1.388 4.723 2.201 7.479 2.201 8.969 0 13.878-7.431 13.878-13.878 0-.212 0-.423-.015-.633.952-.687 1.778-1.547 2.43-2.522z" /></svg>;
const LinkedInIcon = () => <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
const InstagramIcon = () => <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919.058-1.265.069-1.645.069-4.849h0zm0 1.441c-3.117 0-3.481.011-4.697.067-2.635.121-3.947 1.404-4.065 4.065-.057 1.218-.067 1.583-.067 4.697s.011 3.481.067 4.697c.117 2.662 1.429 3.946 4.065 4.065.057 1.218.067 1.583.067 4.697s.011 3.481.067 4.697c.117 2.662 1.429 3.946 4.065 4.065 1.217.055 1.582.067 4.697.067 3.117 0 3.481-.011 4.697-.067 2.635-.121 3.947 1.404 4.065-4.065.057-1.218.067-1.583.067-4.697s-.011-3.481-.067-4.697c-.117-2.662-1.429 3.946-4.065-4.065-1.217-.055-1.582.067-4.697-.067h0zm0 5.838c-1.914 0-3.471 1.557-3.471 3.471s1.557 3.471 3.471 3.471 3.471-1.557 3.471-3.471-1.557-3.471-3.471-3.471zm0 5.525c-1.138 0-2.053-.915-2.053-2.053s.915-2.053 2.053-2.053 2.053.915 2.053 2.053-.915 2.053-2.053 2.053zm4.686-6.776c0 .538-.436.974-.974.974s-.974-.436-.974-.974.436-.974.974-.974.974.436.974.974h.001z"/></svg>;

const LOGO_URL = "https://www.spacez.co/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdz3tveb47%2Fimage%2Fupload%2Fv1741425295%2Flogo_for_websiter_1_1_iz3hbc.png&w=2048&q=75";


export interface AppContextType {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  investors: Investor[]; 
  prospects: Prospect[];
  addProspect: (prospect: Prospect) => void;
  updateProspectStatus: (prospectId: string, status: Prospect['status']) => void;
  supportRequests: SupportRequest[];
  addSupportRequest: (request: SupportRequest) => void;
  updateSupportRequestStatus: (requestId: string, status: SupportTicketStatus, adminComments?: string) => void; // Added adminComments
  
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string) => void; // Pass username to potentially store admin user info
  logoutAdmin: () => void;
  
  currentInvestor: Investor | null; 
  loginInvestor: (investorId: string) => void;
  logoutInvestor: () => void;

  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  updatePropertyStatus: (propertyId: string, status: Property['status']) => void;
  updatePropertyLedger: (
    propertyId: string, 
    newLedgerEntry: Omit<MonthlyLedgerEntry, 'month' | 'totalOperatingExpensesActual' | 'netProfitActual'> & { month: string },
    updatedBy: string, 
    notes: string
  ) => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

const NavLinkItem: React.FC<{ to: string; label: string; icon?: React.ReactNode; currentPath: string; onClick?: () => void; isButton?: boolean; className?: string }> = 
  ({ to, label, icon, currentPath, onClick, isButton = false, className = '' }) => {
  const baseClasses = `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-150 ease-in-out`;
  // Updated active/inactive classes for white navbar
  const activeClasses = isButton ? 'bg-secondary text-primary-dark hover:bg-secondary-dark' : 'bg-primary/10 text-primary font-semibold'; 
  const inactiveClasses = isButton ? 'bg-secondary text-primary-dark hover:bg-secondary-dark' : 'text-neutral-600 hover:bg-primary/10 hover:text-primary';
  
  const linkClassName = `${baseClasses} ${currentPath === to && !isButton ? activeClasses : inactiveClasses} ${className}`;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={linkClassName}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};


const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const appContext = useContext(AppContext);

  const isAdminPage = location.pathname.startsWith('/admin');
  const isInvestorPortalPage = location.pathname.startsWith('/portal');

  if ((isAdminPage && location.pathname !== '/admin/login') || (isInvestorPortalPage && location.pathname !== '/investor-login')) {
    return null; 
  }

  const navItems = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/properties', label: 'Properties', icon: <BuildingOfficeIcon /> },
    { to: '/success-stories', label: 'Success Stories', icon: <SparklesIcon /> },
  ];
  
  if (appContext?.currentInvestor) {
    navItems.push({ to: '/portal/dashboard', label: 'My Portal', icon: <ChartBarIcon /> });
  } else {
    navItems.push({ to: '/investor-login', label: 'Investor Login', icon: <UserCircleIcon /> });
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white text-neutral-600 shadow-lg sticky top-0 z-50"> {/* Changed bg to white */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={LOGO_URL} alt="Spacez Logo" className="h-16 w-auto" /> {/* Increased size to h-16 */}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <NavLinkItem key={item.label} to={item.to} label={item.label} icon={item.icon} currentPath={location.pathname} />
            ))}
             <NavLinkItem 
                to="/contact-support" 
                label="Get Started" 
                currentPath={location.pathname} 
                className="ml-2 bg-secondary text-primary-dark hover:bg-secondary-dark font-semibold" // Keep button style
                isButton={true}
              />
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" // Adjusted colors for white bg
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <NavLinkItem key={item.label} to={item.to} label={item.label} icon={item.icon} currentPath={location.pathname} onClick={closeMobileMenu} />
            ))}
            <NavLinkItem 
                to="/contact-support" 
                label="Get Started" 
                currentPath={location.pathname} 
                className="w-full justify-center bg-secondary text-primary-dark hover:bg-secondary-dark font-semibold"
                isButton={true}
                onClick={closeMobileMenu}
              />
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isInvestorPortalPage = location.pathname.startsWith('/portal');

  if ((isAdminPage && location.pathname !== '/admin/login') || (isInvestorPortalPage && location.pathname !== '/investor-login')) {
    return null; 
  }

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' }, 
      { label: 'Blog', path: '/blog' },
    ],
    resources: [
      { label: 'How It Works', path: '/#how-it-works' }, 
      { label: 'FAQs', path: '/faq' },
      { label: 'Contact & Support', path: '/contact-support' }, 
    ],
    legal: [
      { label: 'Privacy Policy', path: '/legal/privacy-policy' }, 
      { label: 'Terms of Service', path: '/legal/terms-of-service' }, 
      { label: 'Disclaimer', path: '/legal/disclaimer' }, 
      { label: 'Admin Login', path: '/admin/login'}
    ],
  };

  const socialMedia = [
    { label: 'Facebook', icon: <FacebookIcon />, path: 'https://facebook.com/spacez' },
    { label: 'Twitter', icon: <TwitterIcon />, path: 'https://twitter.com/spacez' },
    { label: 'LinkedIn', icon: <LinkedInIcon />, path: 'https://linkedin.com/company/spacez' },
    { label: 'Instagram', icon: <InstagramIcon />, path: 'https://instagram.com/spacez' },
  ];

  return (
    <footer className="bg-neutral-800 text-neutral-300"> 
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          <div>
             <Link to="/" className="flex-shrink-0">
              <img src={LOGO_URL} alt="Spacez Logo" className="h-14 w-auto mb-3" /> {/* Increased size to h-14 */}
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Your gateway to fractional ownership in luxury villas. Invest smarter, live grander.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Company</h5>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.label}><Link to={link.path} className="hover:text-secondary transition-colors text-sm">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Resources</h5>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.label}><Link to={link.path} className="hover:text-secondary transition-colors text-sm">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Legal & Admin</h5>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.label}><Link to={link.path} className="hover:text-secondary transition-colors text-sm">{link.label}</Link></li>
              ))}
               <li><Link to="/investor-login" className="hover:text-secondary transition-colors text-sm">Investor Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-neutral-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Spacez Global Holdings. All rights reserved.
          </p>
          <div className="flex space-x-5">
            {socialMedia.map(social => (
              <a key={social.label} href={social.path} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="text-neutral-400 hover:text-secondary transition-colors">
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};


const ProtectedAdminRoute: React.FC = () => {
  const appContext = React.useContext(AppContext);
  if (!appContext?.isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

const ProtectedInvestorRoute: React.FC = () => {
  const appContext = React.useContext(AppContext);
  if (!appContext?.currentInvestor) {
    return <Navigate to="/investor-login" replace />;
  }
  return <Outlet />;
};


const AppInternal: React.FC = () => {
  const location = useLocation();
  const isAdminPanelPage = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  const isInvestorPortalPage = location.pathname.startsWith('/portal') && location.pathname !== '/investor-login';
  const isHomePage = location.pathname === '/';

  const needsMainPadding = !isAdminPanelPage && !isInvestorPortalPage && !isHomePage;


  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Navbar />
      <main className={`flex-grow ${needsMainPadding ? 'pt-0' : ''}` }> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<AvailablePropertiesPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<NotFoundPage message="Careers page coming soon! We are always looking for talent." />} />
          <Route path="/contact-support" element={<ContactSupportPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<FAQPage />} />
          
          <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/legal/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/legal/disclaimer" element={<DisclaimerPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="properties/new" element={<AdminCreatePropertyPage />} />
              <Route path="properties/edit/:id" element={<AdminCreatePropertyPage isEditMode={true} />} />
              <Route path="properties/:propertyId/update-ledger" element={<AdminUpdateLedgerPage />} />
              <Route path="properties" element={<AdminManagePropertiesPage />} />
              <Route path="investors" element={<AdminInvestorManagementPage />} />
              <Route path="investors/:investorId" element={<AdminInvestorDetailPage />} /> {/* New Detail Route */}
              <Route path="prospects" element={<AdminProspectsPage />} />
              <Route path="support-requests" element={<AdminSupportRequestsPage />} />
              <Route path="performance" element={<AdminPerformanceTrackingPage />} />
            </Route>
          </Route>

          {/* Investor Portal Routes */}
          <Route path="/investor-login" element={<InvestorLoginPage />} />
          <Route element={<ProtectedInvestorRoute />}>
            <Route path="/portal" element={<InvestorPortalLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<InvestorDashboardPage />} />
              <Route path="reports" element={<InvestorReportsPage />} />
              <Route path="finances" element={<InvestorTransactionsPage />} />
              <Route path="explore" element={<InvestorExplorePropertiesPage />} /> 
              <Route path="support" element={<InvestorSupportPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [investors, setInvestors] = useState<Investor[]>(MOCK_INVESTORS); // Initialize with MOCK_INVESTORS
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(MOCK_SUPPORT_REQUESTS); // Initialize with MOCK_SUPPORT_REQUESTS
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentInvestor, setCurrentInvestor] = useState<Investor | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<string | null>(null); // Store admin username


  const loginAdmin = (username: string) => { // Accept username
    setIsAdminAuthenticated(true);
    setCurrentAdminUser(username);
  };
  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
  };

  const loginInvestor = (investorId: string) => {
    const investor = MOCK_INVESTORS.find(inv => inv.id === investorId);
    if (investor) { 
      setCurrentInvestor(investor);
    }
  };
  const logoutInvestor = () => setCurrentInvestor(null);
  
  const addProperty = (property: Property) => {
    const investmentGoal = property.capexDetails.setupCost + property.capexDetails.securityDeposit + property.capexDetails.workingCapital + property.capexDetails.emergencyFund;
    setProperties(prev => [{ ...property, id: property.id || `new-${Date.now()}`, investmentGoal, monthlyLedgerData: [], ledgerUpdateLog: []}, ...prev]);
  };

  const updateProperty = (updatedProperty: Property) => {
    const investmentGoal = updatedProperty.capexDetails.setupCost + updatedProperty.capexDetails.securityDeposit + updatedProperty.capexDetails.workingCapital + updatedProperty.capexDetails.emergencyFund;
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? {...updatedProperty, investmentGoal} : p));
  };
  
  const updatePropertyStatus = (propertyId: string, status: Property['status']) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? {...p, status} : p));
  };

  const updatePropertyLedger = (
    propertyId: string, 
    newLedgerEntryData: Omit<MonthlyLedgerEntry, 'month' | 'totalOperatingExpensesActual' | 'netProfitActual'> & { month: string },
    updatedBy: string,
    notes: string
  ) => {
    setProperties(prevProps => prevProps.map(p => {
      if (p.id === propertyId) {
        const { month, revenue, occupancyRateActual, opexActual, totalPayoutToInvestors } = newLedgerEntryData;
        
        const totalOperatingExpensesActual = Object.values(opexActual).reduce((sum, val) => sum + (val || 0), 0);
        const netProfitActual = revenue - totalOperatingExpensesActual;

        const completeNewLedgerEntry: MonthlyLedgerEntry = {
            month,
            revenue,
            occupancyRateActual,
            opexActual,
            totalOperatingExpensesActual,
            netProfitActual,
            totalPayoutToInvestors
        };

        const existingLedger = p.monthlyLedgerData || [];
        const entryIndex = existingLedger.findIndex(entry => entry.month === month);
        
        let updatedLedgerData;
        if (entryIndex > -1) {
          updatedLedgerData = [...existingLedger];
          updatedLedgerData[entryIndex] = completeNewLedgerEntry;
        } else {
          updatedLedgerData = [...existingLedger, completeNewLedgerEntry].sort((a,b) => b.month.localeCompare(a.month)); 
        }

        const newLogEntry: LedgerUpdateLogEntry = {
          logId: `log-${Date.now()}`,
          updatedAt: new Date().toISOString(),
          updatedBy: updatedBy || currentAdminUser || "Admin", // Use current admin or fallback
          monthUpdated: month,
          notes,
        };
        const updatedLog = [...(p.ledgerUpdateLog || []), newLogEntry];

        return { ...p, monthlyLedgerData: updatedLedgerData, lastLedgerUpdate: new Date().toISOString(), ledgerUpdateLog: updatedLog };
      }
      return p;
    }));
  };


  const addProspect = (prospect: Prospect) => {
    setProspects(prev => [{...prospect, id: `prospect-${Date.now()}-${Math.random().toString(36).substring(2,7)}` }, ...prev]);
  };
  
  const updateProspectStatus = (prospectId: string, status: Prospect['status']) => {
    setProspects(prev => prev.map(p => p.id === prospectId ? {...p, status} : p));
  };

  const addSupportRequest = (request: SupportRequest) => {
    setSupportRequests(prev => [{...request, id: `ticket-${Date.now()}-${Math.random().toString(36).substring(2,7)}`}, ...prev]);
  };

  const updateSupportRequestStatus = (requestId: string, status: SupportTicketStatus, adminComments?: string) => {
    setSupportRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const updatedRequest = { ...r, status };
        if (adminComments) {
          // This assumes SupportRequest type is updated to include adminComments.
          // For this example, we'll just log it or append to message if type is not changed.
          // If SupportRequest has adminComments field: (updatedRequest as any).adminComments = adminComments;
          console.log(`Admin comment for ${requestId}: ${adminComments}`);
        }
        return updatedRequest;
      }
      return r;
    }));
  };


  return (
    <AppContext.Provider value={{ 
        properties, setProperties, 
        investors, 
        prospects, addProspect, updateProspectStatus,
        supportRequests, addSupportRequest, updateSupportRequestStatus,
        isAdminAuthenticated, loginAdmin, logoutAdmin, 
        currentInvestor, loginInvestor, logoutInvestor,
        addProperty, updateProperty, updatePropertyStatus, updatePropertyLedger
      }}>
      <HashRouter>
        <AppInternal />
      </HashRouter>
    </AppContext.Provider>
  );
}

export default App;
