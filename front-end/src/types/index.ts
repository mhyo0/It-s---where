export type UserRole = 'youth' | 'center_manager' | 'odej_admin';
export type Language = 'ar' | 'fr' | 'tz';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory = 
  | 'technology' | 'programming' | 'entrepreneurship' 
  | 'sports' | 'football' | 'art' | 'music' 
  | 'photography' | 'environment' | 'volunteering'
  | 'languages' | 'ai' | 'robotics' | 'gaming'
  | 'culture' | 'science' | 'education' | 'health'
  | 'workshop' | 'competition' | 'training';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  avatar?: string;
  role: UserRole;
  wilaya: string;
  city: string;
  interests: EventCategory[];
  savedEvents: string[];
  joinedEvents: string[];
  createdAt: string;
  lang: Language;
}

export interface YouthCenter {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  wilaya: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  capacity: number;
  facilities: string[];
  image?: string;
  rating: number;
  reviewCount: number;
}

export interface Event {
  id: string;
  title: string;
  titleAr: string;
  titleFr: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  category: EventCategory;
  tags: EventCategory[];
  status: EventStatus;
  startDate: string;
  endDate: string;
  location: string;
  wilaya: string;
  city: string;
  lat: number;
  lng: number;
  centerId: string;
  centerName: string;
  organizerName: string;
  image: string;
  capacity: number;
  registered: number;
  isFree: boolean;
  price?: number;
  ageRange: { min: number; max: number };
  requirements?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  eventId: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Notification {
  id: string;
  type: 'event' | 'deadline' | 'opportunity' | 'system';
  title: string;
  message: string;
  eventId?: string;
  read: boolean;
  createdAt: string;
}

export interface FilterState {
  search: string;
  wilaya: string;
  category: EventCategory | '';
  dateRange: 'all' | 'today' | 'week' | 'month';
  status: EventStatus | 'all';
  isFree: boolean | null;
}

export interface AdminStats {
  totalEvents: number;
  totalUsers: number;
  totalCenters: number;
  activeEvents: number;
  totalRegistrations: number;
  avgAttendance: number;
}
