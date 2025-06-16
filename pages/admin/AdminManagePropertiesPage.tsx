
import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { Property, PropertyStatus } from '../../types';
import { THEME_COLORS } from '../../constants';
import { usePropertyCalculations } from '../../hooks/usePropertyCalculations';

const formatCurrency = (value?: number) => value != null ? `₹${value.toLocaleString('en-IN')}` : 'N/A';

const AdminPropertyRow: React.FC<{property: Property; onStatusChange: (propertyId: string, newStatus: PropertyStatus) => void}> = ({ property, onStatusChange }) => {
    const metrics = usePropertyCalculations({
        capexDetails: property.capexDetails,
        opexDetails: property.opexDetails,
        revenueAssumptions: property.revenueAssumptions,
    });
    const investmentGoal = metrics?.totalCapex ?? property.investmentGoal;
    const raisedPercentage = investmentGoal > 0 ? (property.amountRaised / investmentGoal) * 100 : 0;

    return (
        <tr className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
            <td className="py-3.5 px-4 text-sm text-neutral-700 font-medium">{property.name}</td>
            <td className="py-3.5 px-4 text-sm text-neutral-600">{property.city}</td>
            <td className="py-3.5 px-4 text-sm">
                <select 
                    value={property.status} 
                    onChange={(e) => onStatusChange(property.id, e.target.value as PropertyStatus)}
                    className={`p-1.5 text-xs font-medium rounded-md border focus:ring-2 focus:ring-opacity-50 transition-colors
                        ${ property.status === PropertyStatus.Live ? 'bg-green-50 text-green-700 border-green-300 focus:ring-green-500' :
                          property.status === PropertyStatus.Draft ? 'bg-yellow-50 text-yellow-700 border-yellow-300 focus:ring-yellow-500' :
                          property.status === PropertyStatus.FullyFunded ? 'bg-primary/10 text-primary border-primary/30 focus:ring-primary' : 
                          'bg-neutral-100 text-neutral-700 border-neutral-300 focus:ring-neutral-500'
                        }`}
                >
                    {Object.values(PropertyStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </td>
            <td className="py-3.5 px-4 text-sm text-neutral-600">
                {formatCurrency(property.amountRaised)} / {formatCurrency(investmentGoal)} 
                <div className="w-24 bg-neutral-200 rounded-full h-1.5 mt-1">
                    <div className={`bg-secondary h-1.5 rounded-full`} style={{width: `${raisedPercentage}%`}}></div>
                </div>
            </td>
            <td className="py-3.5 px-4 text-sm text-neutral-600 text-center">{property.numberOfInvestmentSlots}</td>
            <td className="py-3.5 px-4 text-sm text-green-600 font-semibold">
                {metrics?.roiProjections[0]?.annualReturnPercentage.toFixed(1)}%
            </td>
            <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                <Link 
                    to={`/admin/properties/edit/${property.id}`} 
                    className={`text-primary hover:underline font-medium mr-3 transition-colors`}
                >
                    Edit
                </Link>
                <button 
                    onClick={() => {
                        if(confirm(`Are you sure you want to delete "${property.name}"? This action cannot be undone.`)) {
                             alert(`Deleting ${property.name} (placeholder - not implemented)`);
                             // appContext.deleteProperty(property.id); // Future implementation
                        }
                    }} 
                    className="text-red-500 hover:underline font-medium transition-colors"
                >
                    Delete
                </button>
            </td>
        </tr>
    )
}


const AdminManagePropertiesPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { properties, updatePropertyStatus } = appContext; 
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Added state for forcing re-render

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const statusMatch = filterStatus === 'All' || p.status === filterStatus;
      const searchMatch = searchTerm === '' || 
                          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.city.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    }).sort((a,b) => a.name.localeCompare(b.name)); 
  }, [properties, filterStatus, searchTerm, refreshKey]); // Added refreshKey to dependencies

  const handleStatusChange = (propertyId: string, newStatus: PropertyStatus) => {
    const property = properties.find(p => p.id === propertyId);
    if (property && window.confirm(`Are you sure you want to change the status of "${property.name}" to "${newStatus}"?`)) {
        updatePropertyStatus(propertyId, newStatus);
    } else {
        // If user cancels, force a re-render of this page to ensure the select dropdown
        // (which is controlled by property.status from context) visually resets.
        setRefreshKey(oldKey => oldKey + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <PageTitle title="Manage Properties" subtitle={`Viewing ${filteredProperties.length} of ${properties.length} properties`} />
        <Link
          to="/admin/properties/new"
          className={`bg-primary text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-primary-dark transition-colors shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
        >
          + Add New Property
        </Link>
      </div>

      <div className={`mb-6 p-4 bg-white shadow rounded-lg flex flex-col md:flex-row gap-4 items-center`}>
        <input
            type="text"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-grow p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow`}
        />
        <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PropertyStatus | 'All')}
            className={`p-3.5 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm bg-white transition-shadow w-full md:w-auto`}
        >
            <option value="All">All Statuses</option>
            {Object.values(PropertyStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filteredProperties.length > 0 ? (
        <div className={`bg-white shadow-xl rounded-lg overflow-x-auto`}>
          <table className="w-full min-w-max">
            <thead className={`bg-neutral-50 border-b-2 border-neutral-200`}>
              <tr>
                {['Name', 'City', 'Status', 'Funding Progress', 'Total Slots', 'Est. Y1 ROI', 'Actions'].map(header => (
                  <th key={header} className={`py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider ${header === 'Total Slots' ? 'text-center' : ''}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProperties.map(property => (
                <AdminPropertyRow key={property.id} property={property} onStatusChange={handleStatusChange} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`text-center py-12 bg-white shadow rounded-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-neutral-400 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.063a4.5 4.5 0 005.038 4.34L15 8.25H9.75V3.104ZM14.25 8.25a4.5 4.5 0 005.038-4.34V3.104a4.5 4.5 0 00-5.038 4.34L15 8.25h-.75ZM9.75 12h4.5M3 9.75V21a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 21V9.75M3 9.75H21m-12 6a2.25 2.25 0 002.25-2.25V12a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12v1.5A2.25 2.25 0 006.75 15.75h4.5Z" />
          </svg>
          <p className={`text-neutral-500 text-lg`}>No properties found.</p>
          {properties.length > 0 && <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filter.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminManagePropertiesPage;
