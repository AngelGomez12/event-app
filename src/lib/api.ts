export enum SubscriptionPlan {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE",
}

export enum TenantStatus {
  TRIAL = "TRIAL",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_PAYMENT = "PENDING_PAYMENT",
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  address?: string;
  city?: string;
  country?: string;
  contactPhone?: string;
  contactEmail?: string;
  maxGuestCapacity: number;
  timezone: string;
  defaultCurrency: string;
  subscriptionPlan: SubscriptionPlan;
  status: TenantStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN_SALON = "SALON_ADMIN",
  ORGANIZADOR = "ORGANIZER",
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  tenantId?: string;
}

export interface OnboardingRegisterDto {
  salonName: string;
  email: string;
  password: string;
  plan: SubscriptionPlan;
}

export enum EventType {
  WEDDING = "WEDDING",
  SWEET_15 = "SWEET_15",
  CORPORATE = "CORPORATE",
  OTHER = "OTHER",
}

export enum EventStatus {
  PENDING_DEPOSIT = "PENDING_DEPOSIT",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CASH = "CASH",
  TRANSFER = "TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  MERCADO_PAGO = "MERCADO_PAGO",
  OTHER = "OTHER",
}

export interface EventPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  eventId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  honoreeName: string;
  type: EventType;
  date: string; // ISO string
  status: EventStatus;
  approximateGuestCount: number;
  basePrice: number;
  tenantId: string;
  organizerId: string;
  payments?: EventPayment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventDto {
  honoreeName: string;
  type: EventType;
  date: string;
  approximateGuestCount: number;
  organizerId: string;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password?: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  post: async (endpoint: string, data: unknown) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  put: async (endpoint: string, data: unknown) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  delete: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
};
