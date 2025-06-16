

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import { THEME_COLORS, MOCK_ADMIN_USERS } from '../../constants'; // Import MOCK_ADMIN_USERS

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const appContext = useContext(AppContext) as AppContextType;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const adminUser = MOCK_ADMIN_USERS.find(
      admin => admin.username.toLowerCase() === username.toLowerCase() && admin.password === password
    );

    if (adminUser) {
      // FIX: Pass username to loginAdmin
      appContext.loginAdmin(adminUser.username);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    // Container to center the login card within the main content area (between Navbar and Footer)
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center flex-grow min-h-[calc(100vh-16rem)]"> {/* Adjust min-height based on approx Nav/Footer height */}
      <div className={`bg-${THEME_COLORS.cardBackground} p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md`}>
        <h1 className={`text-3xl font-bold text-center text-${THEME_COLORS.primary} mb-2`}>Spacez Admin</h1>
        <p className={`text-center text-${THEME_COLORS.textMuted} mb-8`}>Access your control panel</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium text-${THEME_COLORS.textBase}`}>
              Username (Email)
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`mt-1 block w-full px-4 py-3 border border-${THEME_COLORS.border} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-${THEME_COLORS.primary} focus:border-transparent sm:text-sm`}
              placeholder="e.g., hardik@spacez.co"
            />
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium text-${THEME_COLORS.textBase}`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-1 block w-full px-4 py-3 border border-${THEME_COLORS.border} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-${THEME_COLORS.primary} focus:border-transparent sm:text-sm`}
            />
          </div>
          {error && <p className={`text-sm text-${THEME_COLORS.error} text-center`}>{error}</p>}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-${THEME_COLORS.primary} hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${THEME_COLORS.primary} transition-colors`}
            >
              Sign In
            </button>
          </div>
        </form>
         <p className="mt-6 text-center text-xs text-gray-500">
            Demo Admins: hardik@spacez.co / password, shubham@spacez.co / password, rounak@spacez.co / password
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;