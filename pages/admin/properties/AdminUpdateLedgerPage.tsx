

import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../../App';
import { Property, MonthlyLedgerEntry, OpexDetails, LedgerUpdateLogEntry } from '../../../types';
import PageTitle from '../../../components/PageTitle';
import { DEFAULT_OPEX } from '../../../constants';

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; description?: string }> = ({ label, name, description, type="text", ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    <input type={type} name={name} id={name} {...props} className="mt-1 block w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow"/>
    {description && <p className="mt-1 text-xs text-neutral-500">{description}</p>}
  </div>
);

const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', options || { year: 'numeric', month: 'short', day: 'numeric', hour:'2-digit', minute: '2-digit' });
};

// FIX: Added formatCurrency helper function
const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};


const AdminUpdateLedgerPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const appContext = useContext(AppContext) as AppContextType;

  const [property, setProperty] = useState<Property | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().substring(0, 7)); // Default to current YYYY-MM
  
  const initialFormState = {
      revenue: 0,
      occupancyRateActual: 0,
      opexActual: { ...DEFAULT_OPEX }, // Start with default opex structure
      totalPayoutToInvestors: 0,
      notes: '',
  };
  const [formData, setFormData] = useState(initialFormState);


  useEffect(() => {
    if (propertyId) {
      const foundProperty = appContext.properties.find(p => p.id === propertyId);
      setProperty(foundProperty || null);
      if (foundProperty) {
        // Load existing ledger entry for selectedMonth if available
        const existingEntry = foundProperty.monthlyLedgerData?.find(entry => entry.month === selectedMonth);
        if (existingEntry) {
          setFormData({
            revenue: existingEntry.revenue,
            occupancyRateActual: existingEntry.occupancyRateActual,
            opexActual: { ...existingEntry.opexActual },
            totalPayoutToInvestors: existingEntry.totalPayoutToInvestors,
            notes: '', // Notes are per-update, not stored in ledger entry
          });
        } else {
           setFormData(initialFormState); // Reset if no entry for new month
        }
      }
    }
  }, [propertyId, appContext.properties, selectedMonth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('opexActual.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
            ...prev,
            opexActual: {
                ...prev.opexActual,
                [field]: type === 'number' ? parseFloat(value) : value,
            }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    }
  };
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
    // Form data will be updated by useEffect when selectedMonth changes
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!property || !selectedMonth) {
        alert("Property or month not selected.");
        return;
    }
    if (formData.notes.trim() === '') {
        alert("Please provide notes for this update (e.g., 'Monthly data entry', 'Correction').");
        return;
    }

    const ledgerEntryPayload = {
        month: selectedMonth,
        revenue: formData.revenue,
        occupancyRateActual: formData.occupancyRateActual,
        opexActual: formData.opexActual,
        totalPayoutToInvestors: formData.totalPayoutToInvestors,
    };
    
    appContext.updatePropertyLedger(property.id, ledgerEntryPayload, "Admin User", formData.notes); // Assuming "Admin User" for updatedBy
    alert(`Ledger for ${property.name} for ${selectedMonth} updated successfully.`);
    // Optionally, reset notes or navigate away
    setFormData(prev => ({ ...prev, notes: ''})); 
  };
  
  const calculatedTotalOpex = Object.values(formData.opexActual).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const calculatedNetProfit = formData.revenue - calculatedTotalOpex;

  if (!property) {
    return <div className="p-6">Loading property data or property not found...</div>;
  }

  return (
    <div className="space-y-8">
      <PageTitle 
        title={`Update Ledger: ${property.name}`} 
        subtitle={`Manage monthly performance data for ${property.city}. Last overall update: ${formatDate(property.lastLedgerUpdate)}`}
      />
      
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-xl rounded-lg">
        <h3 className="text-xl font-semibold text-primary mb-4">Update Performance for Month</h3>
        <InputField label="Select Month (YYYY-MM)" name="selectedMonth" type="month" value={selectedMonth} onChange={handleMonthChange} />

        <div className="grid md:grid-cols-2 gap-x-6 mt-6">
            <InputField label="Actual Gross Revenue (₹)" name="revenue" type="number" value={formData.revenue.toString()} onChange={handleInputChange} required />
            <InputField label="Actual Occupancy Rate (0-1)" name="occupancyRateActual" type="number" step="0.01" min="0" max="1" value={formData.occupancyRateActual.toString()} onChange={handleInputChange} required description="e.g., 0.75 for 75%"/>
        </div>

        <h4 className="text-lg font-semibold text-neutral-700 mt-6 mb-3">Actual Operational Expenses (OpEx) for {selectedMonth}</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6">
            {(Object.keys(DEFAULT_OPEX) as Array<keyof OpexDetails>).map(key => (
                 <InputField 
                    key={key} 
                    label={`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} (₹)`} 
                    name={`opexActual.${key}`} 
                    type="number" 
                    value={(formData.opexActual[key] || 0).toString()} 
                    onChange={handleInputChange} 
                 />
            ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-6 mt-4">
            <InputField label="Total Payout to Investors (₹)" name="totalPayoutToInvestors" type="number" value={formData.totalPayoutToInvestors.toString()} onChange={handleInputChange} required description="Actual amount distributed from net profit."/>
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-md border border-neutral-200">
            <h4 className="text-md font-semibold text-primary mb-2">Calculated for {selectedMonth}:</h4>
            <p><strong>Total Actual OpEx:</strong> {formatCurrency(calculatedTotalOpex)}</p>
            <p><strong>Actual Net Profit:</strong> <span className={calculatedNetProfit >= 0 ? 'text-green-600' : 'text-red-500'}>{formatCurrency(calculatedNetProfit)}</span></p>
        </div>

        <div className="mt-6">
             <InputField label="Notes for this Update (Required)" name="notes" type="text" value={formData.notes} onChange={handleInputChange} required description="E.g., Monthly data entry, Correction for utilities, etc."/>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Link to="/admin/properties" className="py-2.5 px-5 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</Link>
          <button type="submit" className="py-2.5 px-6 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-dark shadow-sm">
            Save Ledger Update for {selectedMonth}
          </button>
        </div>
      </form>

      <div className="p-6 bg-white shadow-xl rounded-lg mt-8">
        <h3 className="text-xl font-semibold text-primary mb-4">Ledger Update History for {property.name}</h3>
        {property.ledgerUpdateLog && property.ledgerUpdateLog.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase">Date of Update</th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase">Month Affected</th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase">Updated By</th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                        {[...(property.ledgerUpdateLog || [])].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(log => (
                            <tr key={log.logId}>
                                <td className="py-2 px-3 text-sm text-neutral-600">{formatDate(log.updatedAt)}</td>
                                <td className="py-2 px-3 text-sm text-neutral-600">{log.monthUpdated}</td>
                                <td className="py-2 px-3 text-sm text-neutral-600">{log.updatedBy}</td>
                                <td className="py-2 px-3 text-sm text-neutral-600 whitespace-pre-wrap max-w-xs">{log.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-neutral-500">No update history found for this property.</p>
        )}
      </div>

    </div>
  );
};

export default AdminUpdateLedgerPage;