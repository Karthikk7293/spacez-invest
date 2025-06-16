
import React, { useContext } from 'react'; // Added useContext
import { Link } from 'react-router-dom'; // Added Link import
import PageTitle from '../../components/PageTitle';
import { MOCK_INVESTORS, THEME_COLORS } from '../../constants'; 
import { AppContext, AppContextType } from '../../App'; // Added AppContext import

const AdminInvestorManagementPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType; // Use AppContext to get investors if needed in future
  const investorsToDisplay = appContext.investors || MOCK_INVESTORS; // Fallback to MOCK_INVESTORS if context is empty

  return (
    <div>
      <PageTitle title="Investor Management" subtitle="View and manage investor information." />
      <div className={`bg-${THEME_COLORS.cardBackground} p-6 rounded-lg shadow-xl`}>
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search investors..." 
            className={`w-full p-2.5 border border-${THEME_COLORS.border} rounded-md focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary}`} 
          />
        </div>
        {investorsToDisplay.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className={`bg-gray-50 border-b-2 border-${THEME_COLORS.border}`}>
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Invested</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investorsToDisplay.map(investor => (
                  <tr key={investor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-700">{investor.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{investor.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">₹{investor.totalInvested.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{investor.propertiesInvested.length}</td>
                    <td className="py-3 px-4 text-sm">
                      <Link 
                        to={`/admin/investors/${investor.id}`} 
                        className={`text-${THEME_COLORS.primary} hover:underline mr-2 font-medium`}
                      >
                        View Details
                      </Link>
                      <button className="text-red-500 hover:underline font-medium">Contact</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`text-center text-${THEME_COLORS.textMuted}`}>No investors found.</p>
        )}
         <p className={`text-center text-sm text-${THEME_COLORS.textMuted} mt-6`}>
            Investor data is currently mocked. Full functionality requires backend integration.
          </p>
      </div>
    </div>
  );
};

export default AdminInvestorManagementPage;
