import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Maximize, Home } from 'lucide-react';
import { Apartment, ListingType } from '../types';

// --- Card Component ---
interface ApartmentCardProps {
  apartment: Apartment;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={apartment.imageUrl} 
          alt={apartment.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                apartment.type === ListingType.RENT 
                ? 'bg-blue-600 text-white' 
                : 'bg-emerald-600 text-white'
            }`}>
                {apartment.type === ListingType.RENT ? 'For Rent' : 'For Sale'}
            </span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{apartment.title}</h3>
            <p className="text-lg font-bold text-indigo-600 whitespace-nowrap">
                ${apartment.price.toLocaleString()}
                {apartment.type === ListingType.RENT && <span className="text-sm text-gray-500 font-normal">/mo</span>}
            </p>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4 text-sm">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{apartment.city}, {apartment.address}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 text-sm text-gray-600 mt-auto">
            <div className="flex items-center justify-center">
                <Bed className="w-4 h-4 mr-1.5" />
                <span>{apartment.rooms} Beds</span>
            </div>
            <div className="flex items-center justify-center">
                <Maximize className="w-4 h-4 mr-1.5" />
                <span>{apartment.area} m²</span>
            </div>
            <div className="flex items-center justify-center">
                <Home className="w-4 h-4 mr-1.5" />
                <span>Fl {apartment.floor}</span>
            </div>
        </div>

        <Link 
            to={`/apartments/${apartment.id}`}
            className="mt-4 w-full block text-center py-2.5 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors border border-gray-200"
        >
            View Details
        </Link>
      </div>
    </div>
  );
};

// --- Form Components ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <input 
            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${className}`}
            {...props}
        />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <div className="relative">
            <select 
                className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white ${className}`}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyle = "w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
        danger: "bg-red-600 text-white hover:bg-red-700"
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
