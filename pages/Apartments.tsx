import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Apartment, ListingType, FilterParams } from '../types';
import { ApartmentCard, Input, Select, Button } from '../components/Shared';
import { Filter } from 'lucide-react';

export const Apartments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterParams>({
    city: searchParams.get('city') || '',
    type: (searchParams.get('type') as ListingType) || undefined,
    minPrice: undefined,
    maxPrice: undefined,
    rooms: undefined
  });

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const res = await api.apartments.list({ ...filters, page: 1, limit: 50, sort: 'newest' });
      setApartments(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Re-fetch when URL params change, though we manage local state mostly

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApartments();
    setShowMobileFilters(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name === 'rooms' || name.includes('Price') ? Number(value) : value)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
            <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center justify-center w-full py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium"
            >
                <Filter className="w-4 h-4 mr-2" />
                {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`md:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
            </h2>
            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <Select 
                label="Type"
                name="type"
                value={filters.type || ''}
                onChange={handleChange}
                options={[
                    { value: '', label: 'Any' },
                    { value: 'rent', label: 'Rent' },
                    { value: 'sale', label: 'Sale' }
                ]}
              />

              <Input 
                label="City"
                name="city"
                type="text"
                placeholder="e.g. New York"
                value={filters.city || ''}
                onChange={handleChange}
              />

              <Input 
                label="Min Rooms"
                name="rooms"
                type="number"
                min="0"
                value={filters.rooms || ''}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input 
                    label="Min Price"
                    name="minPrice"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={handleChange}
                />
                <Input 
                    label="Max Price"
                    name="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={handleChange}
                />
              </div>

              <div className="pt-2">
                <Button type="submit">Apply Filters</Button>
              </div>
            </form>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-grow">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    {loading ? 'Searching...' : `${apartments.length} Properties Found`}
                </h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select className="text-sm border-none bg-transparent font-medium text-gray-700 focus:ring-0 cursor-pointer">
                        <option>Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : apartments.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apartments.map(apt => (
                            <ApartmentCard key={apt.id} apartment={apt} />
                        ))}
                    </div>
                    {/* Pagination UI Placeholder */}
                    <div className="mt-10 flex justify-center space-x-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium">1</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">3</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Next</button>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                    <button 
                        onClick={() => setFilters({})}
                        className="mt-4 text-indigo-600 font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};