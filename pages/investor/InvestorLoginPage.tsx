
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import { THEME_COLORS, MOCK_INVESTORS } from '../../constants';
import PageTitle from '../../components/PageTitle';

const InvestorLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const appContext = useContext(AppContext) as AppContextType;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    // Try to find investor by username (which is their email in MOCK_INVESTORS)
    const investor = MOCK_INVESTORS.find(
      inv => inv.username?.toLowerCase() === username.toLowerCase() && inv.password === password
    );

    if (investor) {
      appContext.loginInvestor(investor.id);
      navigate('/portal/dashboard');
    } else {
      // For demo purposes, allow generic "investor" / "password" if no specific match found
      // This part can be removed if strict matching against MOCK_INVESTORS is preferred.
      if (username.toLowerCase() === 'investor' && password === 'password' && MOCK_INVESTORS.length > 0) {
         // Log in as the first mock investor for demo purposes
        appContext.loginInvestor(MOCK_INVESTORS[0].id);
        navigate('/portal/dashboard');
        return;
      }
      setError('Invalid username/email or password.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center flex-grow min-h-[calc(100vh-16rem)]">
      <div className={`bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md`}>
        <PageTitle title="Investor Portal Login" subtitle="Access your personalized investment dashboard."/>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium text-neutral-700`}>
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm`}
              placeholder="Enter your username or email"
            />
          </div>
           <div>
            <label htmlFor="password" className={`block text-sm font-medium text-neutral-700`}>
              Password 
              <span className="text-xs text-neutral-500 ml-1">(For demo, try any investor's email with 'password', or 'investor'/'password')</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm`}
              placeholder="Enter your password"
            />
          </div>
          {error && <p className={`text-sm text-red-500 text-center`}>{error}</p>}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
            >
              Login to Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestorLoginPage;
