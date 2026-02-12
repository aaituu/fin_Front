import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Apartment, ContactRequest } from '../types';
import { api } from '../services/api';
import { Button } from '../components/Shared';
import { Edit2, Trash2, User as UserIcon, Plus } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [myApartments, setMyApartments] = useState<Apartment[]>([]);
  const [incoming, setIncoming] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIncoming, setLoadingIncoming] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const mine = await api.apartments.getMine();
        setMyApartments(mine);
      } finally {
        setLoading(false);
      }
    };

    const loadIncoming = async () => {
      setLoadingIncoming(true);
      try {
        const items = await api.requests.incoming();
        setIncoming(items);
      } finally {
        setLoadingIncoming(false);
      }
    };

    load();
    loadIncoming();

    const interval = setInterval(() => {
      loadIncoming();
    }, 10000);

    return () => clearInterval(interval);
  }, [navigate, user?.token, location.key]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    await api.apartments.delete(id);
    setMyApartments(prev => prev.filter(a => a.id !== id));
  };

  const handleDeclineRequest = async (id: string) => {
    if (!confirm('Decline and delete this request?')) return;
    await api.requests.delete(id);
    setIncoming((prev) => prev.filter((r) => r.id !== id));
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <UserIcon className="w-10 h-10" />
        </div>
        <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Verified User</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Landlord</span>
            </div>
        </div>
        <div className="flex-shrink-0">
             <Link to="/apartments/new">
                <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Property</span>
                </Button>
             </Link>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : myApartments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myApartments.map(apt => (
                            <tr key={apt.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                                            <img className="h-10 w-10 object-cover" src={apt.imageUrl} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{apt.title}</div>
                                            <div className="text-sm text-gray-500">{apt.rooms} Beds</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {apt.type === 'rent' ? 'Rent' : 'Sale'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${apt.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {apt.city}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        (apt.status || 'pending') === 'approved'
                                          ? 'bg-green-100 text-green-800'
                                          : (apt.status || 'pending') === 'rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}
                                    >
                                      {(apt.status || 'pending') === 'approved'
                                        ? 'Approved'
                                        : (apt.status || 'pending') === 'rejected'
                                        ? 'Rejected'
                                        : 'Pending approval'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      title="Edit (not implemented in UI)"
                                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                                      onClick={() => navigate(`/apartments/${apt.id}/edit`)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      title="Delete"
                                      className="text-red-600 hover:text-red-900"
                                      onClick={() => handleDelete(apt.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <h3 className="text-lg font-medium text-gray-900">No properties listed yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new listing.</p>
        </div>
      )}

      {/* Incoming Requests */}
      <div className="mt-10 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Incoming Requests</h2>
      </div>

      {loadingIncoming ? (
        <div>Loading requests...</div>
      ) : incoming.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {incoming.map((r) => (
              <div key={r.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Property</div>
                    <div className="text-lg font-semibold text-gray-900">{r.apartment?.title}</div>
                    <div className="text-sm text-gray-500">{r.apartment?.city}</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">From: {r.fromUser?.name || 'User'} ({r.fromUser?.email || 'no email'})</div>
                    <div>Phone: {r.phone}</div>
                    <div className="mt-2 whitespace-pre-wrap text-gray-600">{r.message}</div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleDeclineRequest(r.id)}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
          <p className="text-gray-500">No incoming requests yet.</p>
        </div>
      )}
    </div>
  );
};