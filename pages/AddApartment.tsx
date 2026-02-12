import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ListingType } from '../types';
import { Button, Input, Select } from '../components/Shared';

export const AddApartment: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'rent' as ListingType,
    city: '',
    address: '',
    rooms: '',
    area: '',
    floor: '',
    imageUrl: 'https://picsum.photos/800/600'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.apartments.create({
        ...formData,
        price: Number(formData.price),
        rooms: Number(formData.rooms),
        area: Number(formData.area),
        floor: Number(formData.floor),
      });
      navigate('/profile');
    } catch (error) {
      console.error('Failed to create apartment', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 pb-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-500">Fill in the details about the property you want to list.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Property Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Modern Apartment in Downtown"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select 
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                    { value: 'rent', label: 'For Rent' },
                    { value: 'sale', label: 'For Sale' }
                ]}
            />
            <Input 
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            />
            <Input 
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Input 
                label="Rooms"
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
                required
            />
            <Input 
                label="Area (m²)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                required
            />
             <Input 
                label="Floor"
                name="floor"
                type="number"
                value={formData.floor}
                onChange={handleChange}
                required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea 
                name="description"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the key features..."
            />
          </div>

          <Input 
            label="Image URL (Placeholder)"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />

          <div className="pt-4 flex items-center justify-end space-x-4">
             <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
             >
                Cancel
             </button>
             <Button type="submit" className="w-auto px-8" disabled={loading}>
                {loading ? 'Creating...' : 'Create Listing'}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};