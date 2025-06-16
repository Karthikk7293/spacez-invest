
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { Property, CapexDetails, OpexDetails, RevenueAssumptions, PropertyStatus, CalculatedMetrics } from '../types';
import { usePropertyCalculations } from '../hooks/usePropertyCalculations';
import { DEFAULT_CAPEX, DEFAULT_OPEX, DEFAULT_REVENUE_ASSUMPTIONS, THEME_COLORS, DEFAULT_NUMBER_OF_INVESTMENT_SLOTS } from '../constants';
import PageTitle from './PageTitle'; // Corrected import

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (propertyData: Property) => void;
  isEditMode?: boolean;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className={`text-xl font-semibold text-primary mt-8 mb-4 pb-2 border-b border-neutral-300`}>{children}</h3>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; description?: string }> = ({ label, name, description, type="text", ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      {...props}
      className="mt-1 block w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow"
    />
    {description && <p className="mt-1 text-xs text-neutral-500">{description}</p>}
  </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string; }> = ({ label, name, ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    <textarea
      name={name}
      id={name}
      rows={4}
      {...props}
      className="mt-1 block w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow"
    />
  </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; name: string; children: React.ReactNode}> = ({label, name, children, ...props}) => (
    <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    <select
      name={name}
      id={name}
      {...props}
      className="mt-1 block w-full p-3.5 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm bg-white transition-shadow"
    >
        {children}
    </select>
  </div>
)

const formatCurrency = (value: number | undefined, digits = 0) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, isEditMode = false }) => {
  const [formData, setFormData] = useState<Omit<Property, 'id' | 'calculatedMetrics' | 'investmentGoal'>>(() => ({
    name: initialData?.name || '',
    city: initialData?.city || '',
    images: initialData?.images?.length ? initialData.images : [''], // Ensure at least one image field
    description: initialData?.description || '',
    amountRaised: initialData?.amountRaised || 0,
    status: initialData?.status || PropertyStatus.Draft,
    numberOfInvestmentSlots: initialData?.numberOfInvestmentSlots || DEFAULT_NUMBER_OF_INVESTMENT_SLOTS,
    capexDetails: initialData?.capexDetails || { ...DEFAULT_CAPEX },
    opexDetails: initialData?.opexDetails || { ...DEFAULT_OPEX },
    revenueAssumptions: initialData?.revenueAssumptions || { ...DEFAULT_REVENUE_ASSUMPTIONS, numberOfRooms: initialData?.revenueAssumptions?.numberOfRooms || 4 }, // Default rooms if new
  }));

  const calculatedMetrics = usePropertyCalculations({
    capexDetails: formData.capexDetails,
    opexDetails: formData.opexDetails,
    revenueAssumptions: formData.revenueAssumptions,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    if (field) { // Nested object (capexDetails, opexDetails, revenueAssumptions)
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as object),
          [field]: e.target.type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else { // Top-level field
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'number' ? parseFloat(value) : name === 'status' ? value as PropertyStatus : value,
      }));
    }
  };
  
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };
  
  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const investmentGoal = calculatedMetrics?.totalCapex ?? 0;
    const propertyData: Property = {
      ...formData,
      id: initialData?.id || `prop_${Date.now()}`,
      investmentGoal,
      calculatedMetrics: calculatedMetrics || undefined,
      // Ensure revenueAssumptions in the final data doesn't have reserveSlots if it was accidentally carried over
      revenueAssumptions: {
        numberOfRooms: formData.revenueAssumptions.numberOfRooms,
        tariffPerRoom: formData.revenueAssumptions.tariffPerRoom,
        occupancyRate: formData.revenueAssumptions.occupancyRate,
      }
    };
    onSubmit(propertyData);
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 md:p-8 bg-white shadow-2xl rounded-xl`}>
      <PageTitle title={isEditMode ? 'Edit Property Details' : 'Create New Property Listing'} />

      <SectionTitle>Basic Information</SectionTitle>
      <div className="grid md:grid-cols-2 gap-x-6">
        <InputField label="Villa Name" name="name" value={formData.name} onChange={handleInputChange} required />
        <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} required />
      </div>
      <TextareaField label="Description" name="description" value={formData.description} onChange={handleInputChange} required />
      
      <SectionTitle>Images</SectionTitle>
        {formData.images.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
            <InputField 
                label={`Image URL ${index + 1}`} 
                name={`image-${index}`}
                value={url} 
                onChange={(e) => handleImageChange(index, e.target.value)} 
                placeholder="https://example.com/image.jpg"
                type="url"
            />
            {formData.images.length > 1 && (
                <button type="button" onClick={() => removeImageField(index)} className="mt-6 p-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs font-medium">Remove</button>
            )}
            </div>
        ))}
        <button type="button" onClick={addImageField} className={`mt-2 text-sm bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark font-medium`}>+ Add Image URL</button>


      <SectionTitle>Investment & Status</SectionTitle>
      <div className="grid md:grid-cols-3 gap-x-6">
        <InputField label="Amount Raised (₹)" name="amountRaised" type="number" value={formData.amountRaised.toString()} onChange={handleInputChange} required />
        <InputField label="Number of Investment Slots" name="numberOfInvestmentSlots" type="number" value={formData.numberOfInvestmentSlots.toString()} onChange={handleInputChange} min="1" required description="How many shares the property is divided into." />
         <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange}>
            {Object.values(PropertyStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </SelectField>
      </div>

      <SectionTitle>Property Configuration</SectionTitle>
      <div className="grid md:grid-cols-2 gap-x-6"> {/* Updated to reflect single input */}
        <InputField label="Total Number of Rooms (All Rentable)" name="revenueAssumptions.numberOfRooms" type="number" value={formData.revenueAssumptions.numberOfRooms.toString()} onChange={handleInputChange} required />
        {/* Reserve Slots input removed */}
      </div>


      <SectionTitle>Capital Expenditure (CapEx) - One-Time Costs</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6">
        {Object.entries(formData.capexDetails).map(([key, value]) => (
          <InputField key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + " (₹)"} name={`capexDetails.${key}`} type="number" value={value.toString()} onChange={handleInputChange} required />
        ))}
      </div>

      <SectionTitle>Operational Expenditure (OpEx) - Monthly Costs</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6">
         {Object.entries(formData.opexDetails).map(([key, value]) => (
          <InputField key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + " (₹)"} name={`opexDetails.${key}`} type="number" value={value.toString()} onChange={handleInputChange} required />
        ))}
      </div>

      <SectionTitle>Revenue Assumptions (Dynamic)</SectionTitle>
      <div className="grid md:grid-cols-2 gap-x-6"> {/* Simplified to 2 columns as rooms are now fixed */}
        <InputField label="Tariff per Rentable Room (₹)" name="revenueAssumptions.tariffPerRoom" type="number" value={formData.revenueAssumptions.tariffPerRoom.toString()} onChange={handleInputChange} required />
        <InputField label="Occupancy Rate (0-1)" name="revenueAssumptions.occupancyRate" type="number" step="0.01" min="0" max="1" value={formData.revenueAssumptions.occupancyRate.toString()} onChange={handleInputChange} required description="e.g., 0.8 for 80%"/>
      </div>
      
      {calculatedMetrics && (
        <div className={`mt-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200 shadow-inner`}>
          <h4 className={`text-lg font-semibold text-primary mb-4`}>Auto-Calculated Metrics:</h4>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <p><strong>Total CapEx (Investment Goal):</strong> {formatCurrency(calculatedMetrics.totalCapex)}</p>
            <p><strong>Value Per Investment Slot:</strong> {formatCurrency(calculatedMetrics.totalCapex / formData.numberOfInvestmentSlots)} (for {formData.numberOfInvestmentSlots} slots)</p>
            <p><strong>Total Monthly OpEx:</strong> {formatCurrency(calculatedMetrics.totalOpexMonthly)}</p>
            <p><strong>Annual OpEx:</strong> {formatCurrency(calculatedMetrics.annualOpex)}</p>
            <p><strong>Projected Annual Net Revenue:</strong> {formatCurrency(calculatedMetrics.annualNetRevenue)}</p>
            <p><strong>Projected Annual Net Profit:</strong> <span className="font-bold text-green-600">{formatCurrency(calculatedMetrics.annualNetProfit)}</span></p>
            <p><strong>Projected Annual Investor Share (50%):</strong> <span className="font-bold text-green-600">{formatCurrency(calculatedMetrics.annualInvestorShare)}</span></p>
            {calculatedMetrics.roiProjections[0] && (
              <p><strong>Projected Year 1 ROI:</strong> <span className="font-bold text-green-600">{calculatedMetrics.roiProjections[0].annualReturnPercentage.toFixed(1)}%</span></p>
            )}
             <p><strong>Total Rentable Rooms:</strong> {calculatedMetrics.rentableRooms}</p>
          </div>
        </div>
      )}

      <div className="mt-10 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className={`py-3 px-6 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors`}
        >
          {isEditMode ? 'Save Changes' : 'Publish Property'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;