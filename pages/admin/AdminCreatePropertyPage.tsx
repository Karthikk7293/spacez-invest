
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyForm from '../../components/PropertyForm';
import { Property } from '../../types';
import { AppContext, AppContextType } from '../../App';

interface AdminCreatePropertyPageProps {
  isEditMode?: boolean;
}

const AdminCreatePropertyPage: React.FC<AdminCreatePropertyPageProps> = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { id: propertyId } = useParams<{ id?: string }>();
  const appContext = useContext(AppContext) as AppContextType;

  const initialData = isEditMode && propertyId 
    ? appContext.properties.find(p => p.id === propertyId) 
    : undefined;

  const handleSubmit = (propertyData: Property) => {
    if (isEditMode && initialData) {
      appContext.updateProperty(propertyData);
       alert('Property updated successfully!');
    } else {
      appContext.addProperty(propertyData);
      alert('Property created successfully!');
    }
    navigate('/admin/properties');
  };
  
  if (isEditMode && propertyId && !initialData) {
      return <div className="container mx-auto p-6">Property not found for editing.</div>;
  }

  return (
    <div>
      <PropertyForm onSubmit={handleSubmit} initialData={initialData} isEditMode={isEditMode} />
    </div>
  );
};

export default AdminCreatePropertyPage;
