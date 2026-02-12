import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { ListingType } from '../types';
import { Button, Input, Select } from '../components/Shared';

export const EditApartment: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    price: '',
    type: 'rent' as ListingType,
    city: '',
    address: '',
    rooms: '',
    area: '',
    floor: '',
    imageUrl: ''
  });

  React.useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const apt = await api.apartments.getById(id);
        if (!apt) {
          navigate('/profile');
          return;
        }
        setFormData({
          title: apt.title,
          description: apt.description,
          price: String(apt.price),
          type: apt.type,
          city: apt.city,
          address: apt.address,
          rooms: String(apt.rooms),
          area: String(apt.area),
          floor: String(apt.floor),
          imageUrl: apt.imageUrl
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await api.apartments.update(id, {
        ...formData,
        price: Number(formData.price),
        rooms: Number(formData.rooms),
        area: Number(formData.area),
        floor: Number(formData.floor)
      } as any);
      navigate('/profile', { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert('Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 pb-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-500">Update your listing details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Property Title" name="title" value={formData.title} onChange={handleChange} required />

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
            <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Input label="Rooms" name="rooms" type="number" value={formData.rooms} onChange={handleChange} required />
            <Input label="Area (m²)" name="area" type="number" value={formData.area} onChange={handleChange} required />
            <Input label="Floor" name="floor" type="number" value={formData.floor} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />

          <div className="pt-4 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" className="w-auto px-8" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
