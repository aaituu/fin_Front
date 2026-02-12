export enum ListingType {
  RENT = 'rent',
  SALE = 'sale'
}

export interface Apartment {
  id: string;
  title: string;
  description: string;
  price: number;
  type: ListingType;
  city: string;
  address: string;
  rooms: number;
  area: number;
  floor: number;
  imageUrl: string;
  ownerId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  isHidden?: boolean;
  categoryId?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  isBanned?: boolean;
  token?: string;
}

export interface FilterParams {
  city?: string;
  type?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  categoryId?: string;
}

export interface ContactRequest {
  id: string;
  apartment: Apartment;
  fromUser: { id?: string; name?: string; email?: string };
  phone: string;
  message: string;
  createdAt?: string;
}

export interface ContactMessagePayload {
  name?: string;
  phone?: string;
  email?: string;
  message: string;
}

export interface ReportItem {
  id: string;
  apartment: Apartment | null;
  reporter: User | null;
  reason: string;
  status: 'open' | 'resolved';
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  message: string;
  createdAt?: string;
}
