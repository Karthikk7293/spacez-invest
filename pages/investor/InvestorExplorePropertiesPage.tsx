
import React, { useState, useMemo, useContext } from 'react';
import PropertyCard from '../../components/PropertyCard';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { PropertyStatus, Property } from '../../types';
import { THEME_COLORS } from '../../constants';

const InvestorExplorePropertiesPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { properties } = appContext;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'investmentGoal'>('name'); 

  const liveProperties = useMemo(() => {
    let filtered = properties.filter(p => p.status === PropertyStatus.Live);

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'investmentGoal') return (a.investmentGoal || 0) - (b.investmentGoal || 0) ;
      return 0;
    });
  }, [properties, searchTerm, sortBy]);

  return (
    <div className={`bg-neutral-50 min-h-screen`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageTitle 
            title="Explore New Investment Opportunities" 
            subtitle="Discover currently live properties available for investment." 
        />

        <div className={`mb-8 p-5 bg-white shadow-lg rounded-xl flex flex-col md:flex-row gap-4 items-center border border-neutral-200`}>
          <div className="flex-grow w-full md:w-auto relative">
            <label htmlFor="search" className="sr-only">Search Properties</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                placeholder="Search by name or city..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
           <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'name' | 'investmentGoal')}
            className="p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm bg-white transition-shadow w-full md:w-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="investmentGoal">Sort by Goal</option>
          </select>
        </div>
        
        {liveProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {liveProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-neutral-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0H15M3.75 21H15M3.75 21H3.75A2.25 2.25 0 011.5 18.75V16.5m1.5 4.5V7.875M3 16.5V7.875m0 0A2.25 2.25 0 015.25 5.625H18.75a2.25 2.25 0 012.25 2.25M3 7.875C3 6.839 3.84 6 4.875 6H19.125C20.16 6 21 6.839 21 7.875M21 16.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 16.5m18 0V18.75a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75V16.5m14.25-8.25h-2.625m2.625 0A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 8.25m14.25 0v2.625M3 8.25v2.625m0 0h18M3 10.875h18" />
            </svg>
            <p className="text-xl text-neutral-500">No live investment opportunities available at the moment.</p>
            <p className="text-sm text-neutral-400 mt-2">Please check back later or contact us for upcoming projects.</p>
          </div>
        )}

      </div>
    </div>
  );
};
export default InvestorExplorePropertiesPage;
