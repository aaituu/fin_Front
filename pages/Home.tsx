import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import { Apartment } from '../types';
import { ApartmentCard } from '../components/Shared';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredApartments, setFeaturedApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [city, setCity] = useState('');
  const [type, setType] = useState('rent');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.apartments.list({ page: 1, limit: 6, sort: 'newest' });
        setFeaturedApartments(res.items.slice(0, 3)); // Show top 3
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (city) query.append('city', city);
    if (type) query.append('type', type);
    navigate(`/apartments?${query.toString()}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 py-20 md:py-32 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Find your next <span className="text-indigo-300">perfect home</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Search millions of apartments, houses, and rooms. The most trusted place to rent or buy real estate.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-xl max-w-4xl mx-auto transform transition-all hover:scale-[1.01]">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="City or Neighborhood" 
                  className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="relative">
                <select 
                  className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
              <div className="relative">
                <select 
                  className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">Any Price</option>
                  <option value="low">Under $1,000</option>
                  <option value="mid">$1,000 - $3,000</option>
                  <option value="high">$3,000+</option>
                </select>
              </div>
              <button 
                type="submit"
                className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
                <p className="text-gray-500 mt-2">Hand-picked selection of quality places</p>
            </div>
            <button 
                onClick={() => navigate('/apartments')}
                className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
                View All &rarr;
            </button>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl h-96 animate-pulse border border-gray-200">
                        <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                        <div className="p-6 space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredApartments.map(apt => (
                    <ApartmentCard key={apt.id} apartment={apt} />
                ))}
            </div>
        )}
        
        <div className="mt-8 md:hidden text-center">
            <button 
                onClick={() => navigate('/apartments')}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
                View All Properties &rarr;
            </button>
        </div>
      </section>
      
      {/* Promo Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8 max-w-xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">List your property on Rentify</h2>
                    <p className="text-gray-600 text-lg">
                        Join thousands of landlords and sellers who trust Rentify to find the best tenants and buyers.
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/apartments/new')}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg whitespace-nowrap"
                >
                    Add Your Property
                </button>
            </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
            Rentify is a simple rental platform built for our final project. We help people publish apartments,
            review listings through admin moderation, and connect tenants with owners safely via requests.
            Our goal is to make renting clear, fast, and convenient.
          </p>
          <div className="mt-6 text-gray-500 text-sm">
            Tip: Use the <span className="font-semibold">Help Center</span> in the footer to send us a request.
          </div>
        </div>
      </section>
    </div>
  );
};