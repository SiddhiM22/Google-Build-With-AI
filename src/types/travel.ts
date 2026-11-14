export type StopCategory = 'transit' | 'place' | 'stay' | 'food' | 'activity';

export interface TransitLeg {
  duration: string;
  mode: 'walk' | 'metro' | 'train' | 'bus' | 'taxi' | 'flight' | 'ferry';
  details: string;
}

export interface StopItem {
  id: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  title: string;
  subtitle: string;
  category: StopCategory;
  description: string;
  cost?: number;
  flightOrTrainCode?: string;
  confirmationCode?: string;
  isConfirmed?: boolean;
  isCompleted?: boolean;
  transitToNext?: TransitLeg;
  tip?: string;
  photoUrl?: string;
  coordinates: {
    x: number; // percentage 0-100 for custom illustrated map
    y: number; // percentage 0-100 for custom illustrated map
    label?: string;
    lat?: number; // Real geographic latitude for Google Maps & Street View
    lng?: number; // Real geographic longitude for Google Maps & Street View
  };
  tags?: string[];
  groundingSources?: { title: string; url: string }[];
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  date: string;
  stops: StopItem[];
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'documents' | 'gear' | 'clothing' | 'toiletries' | 'zine';
  isPacked: boolean;
  essential: boolean;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'transit' | 'stay' | 'food' | 'activity' | 'souvenir';
  dayNumber?: number;
  date: string;
}

export interface Trip {
  id: string;
  title: string;
  subtitle: string;
  destination: string;
  country: string;
  dateRange: string;
  currency: string;
  currencySymbol: string;
  totalBudget: number;
  coverImage: string;
  introZineNote: string;
  days: DayPlan[];
  packingList: PackingItem[];
  expenses: ExpenseItem[];
}
