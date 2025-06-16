
import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { Prospect } from '../../types';
import { THEME_COLORS } from '../../constants';

const formatCurrency = (value?: number) => value != null ? `₹${value.toLocaleString('en-IN')}` : 'N/A';
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const AdminProspectsPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { prospects, properties, updateProspectStatus } = appContext;
  const [filterProperty, setFilterProperty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProspects = useMemo(() => {
    return prospects
      .filter(p => {
        const propertyMatch = filterProperty === 'All' || p.propertyId === filterProperty;
        const searchMatch = searchTerm === '' ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
        return propertyMatch && searchMatch;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()); // Sort by most recent
  }, [prospects, filterProperty, searchTerm]);

  const handleStatusChange = (prospectId: string, newStatus: Prospect['status']) => {
    updateProspectStatus(prospectId, newStatus);
  };

  return (
    <div>
      <PageTitle title="Investment Prospects" subtitle="Manage and track potential investor leads." />

      <div className={`mb-6 p-4 bg-${THEME_COLORS.cardBackground} shadow rounded-lg flex flex-col md:flex-row gap-4 items-center`}>
        <input
          type="text"
          placeholder="Search by name, email, property..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-grow w-full md:w-auto p-2.5 border border-${THEME_COLORS.border} rounded-md shadow-sm focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary} sm:text-sm`}
        />
        <select
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
          className={`w-full md:w-auto p-2.5 border border-${THEME_COLORS.border} rounded-md shadow-sm focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary} sm:text-sm bg-white`}
        >
          <option value="All">All Properties</option>
          {properties.map(prop => (
            <option key={prop.id} value={prop.id}>{prop.name}</option>
          ))}
        </select>
      </div>

      {filteredProspects.length > 0 ? (
        <div className={`bg-${THEME_COLORS.cardBackground} shadow-lg rounded-lg overflow-x-auto`}>
          <table className="w-full min-w-max">
            <thead className={`bg-gray-50 border-b-2 border-${THEME_COLORS.border}`}>
              <tr>
                {['Prospect Name', 'Email', 'Phone', 'Property', 'Intended Investment', 'Submitted At', 'Status', 'Actions'].map(header => (
                  <th key={header} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProspects.map(prospect => (
                <tr key={prospect.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700">{prospect.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700"><a href={`mailto:${prospect.email}`} className={`text-${THEME_COLORS.primary} hover:underline`}>{prospect.email}</a></td>
                  <td className="py-3 px-4 text-sm text-gray-700"><a href={`tel:${prospect.phone}`} className={`text-${THEME_COLORS.primary} hover:underline`}>{prospect.phone}</a></td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <Link to={`/property/${prospect.propertyId}`} target="_blank" className={`text-${THEME_COLORS.primary} hover:underline`}>
                        {prospect.propertyName}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(prospect.intendedInvestment)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDate(prospect.submittedAt)}</td>
                  <td className="py-3 px-4 text-sm">
                    <select 
                        value={prospect.status} 
                        onChange={(e) => handleStatusChange(prospect.id, e.target.value as Prospect['status'])}
                        className={`p-1.5 border text-xs border-${THEME_COLORS.border} rounded-md shadow-sm focus:ring-${THEME_COLORS.primary} focus:border-${THEME_COLORS.primary} bg-white`}
                    >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => alert(`Viewing details for ${prospect.name} (placeholder)`)}
                      className={`text-${THEME_COLORS.primary} hover:underline font-medium`}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`text-center py-10 bg-${THEME_COLORS.cardBackground} shadow rounded-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 mx-auto text-${THEME_COLORS.textMuted} mb-4`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <p className={`text-${THEME_COLORS.textMuted}`}>No prospects found matching your criteria.</p>
          {prospects.length === 0 && <p className={`text-sm text-${THEME_COLORS.textMuted} mt-2`}>No prospects have submitted interest yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminProspectsPage;
