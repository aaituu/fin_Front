import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Apartment, ListingType } from '../types';
import { Button, Input } from '../components/Shared';
import { MapPin, Bed, Maximize, Home, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const ApartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await api.apartments.get(id);
        setApartment(data || null);
      } catch {
        setApartment(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apartment) return;

    const stored = localStorage.getItem('rentify_user');
    if (!stored) {
      navigate('/login');
      return;
    }
    
    // Requests are stored in MongoDB and shown to the owner in Profile -> Incoming Requests
    await api.requests.create(apartment.id, contactForm.phone, contactForm.message);
    setIsSubmitted(true);
    // Reset form after 3 seconds for demo purposes
    setTimeout(() => {
        setIsSubmitted(false);
        setContactForm({ name: '', phone: '', message: '' });
    }, 3000);
  };

  if (loading) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="animate-pulse space-y-8">
                  <div className="h-96 bg-gray-200 rounded-xl w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
          </div>
      )
  }

  if (!apartment) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900">Apartment not found</h2>
            <Button className="mt-4 w-auto" onClick={() => navigate('/apartments')}>Back to listings</Button>
        </div>
    );
  }

  const isOwner = !!user && !!apartment.ownerId && apartment.ownerId === user.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm relative">
                <img src={apartment.imageUrl} alt={apartment.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${
                        apartment.type === ListingType.RENT 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-emerald-600 text-white'
                    }`}>
                        {apartment.type === ListingType.RENT ? 'For Rent' : 'For Sale'}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{apartment.title}</h1>
                        <div className="flex items-center text-gray-500">
                            <MapPin className="w-5 h-5 mr-1" />
                            <span className="text-lg">{apartment.address}, {apartment.city}</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <div className="text-3xl font-bold text-indigo-600">
                            ${apartment.price.toLocaleString()}
                            {apartment.type === ListingType.RENT && <span className="text-lg text-gray-500 font-normal">/mo</span>}
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6 mb-6">
                    <div className="flex flex-col items-center justify-center text-center p-2">
                        <Bed className="w-8 h-8 text-indigo-500 mb-2" />
                        <span className="text-xl font-bold text-gray-900">{apartment.rooms}</span>
                        <span className="text-sm text-gray-500">Bedrooms</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-2 border-l border-gray-100">
                        <Maximize className="w-8 h-8 text-indigo-500 mb-2" />
                        <span className="text-xl font-bold text-gray-900">{apartment.area}</span>
                        <span className="text-sm text-gray-500">Square Meters</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-2 border-l border-gray-100">
                        <Home className="w-8 h-8 text-indigo-500 mb-2" />
                        <span className="text-xl font-bold text-gray-900">{apartment.floor}</span>
                        <span className="text-sm text-gray-500">Floor Number</span>
                    </div>
                </div>

                <div className="prose max-w-none text-gray-600">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                    <p className="leading-relaxed">{apartment.description}</p>
                </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{isOwner ? 'Your Listing' : 'Contact Owner'}</h3>

            {isOwner ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">You are the owner of this property. You can edit it from here.</p>
                <Button className="w-full" onClick={() => navigate(`/apartments/${apartment.id}/edit`)}>
                  Edit Property
                </Button>
              </div>
            ) : isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-green-50 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <h4 className="text-lg font-bold text-green-900">Request Sent!</h4>
                <p className="text-green-700">The owner will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                    placeholder="I am interested in this apartment..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Send Request</Button>
                <p className="text-xs text-center text-gray-400 mt-4">By sending a request, you agree to our Terms of Service.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};