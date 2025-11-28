
export interface UserProfile {
  name: string;
  email?: string; // New
  password?: string; // New
  whatsapp: string;
  isPhoneVerified?: boolean; // New: For Push Notifications security
  notificationsEnabled: boolean;
  notificationZone: string;
  isPremium: boolean;
  level: string; // User's self-assessed level
  reputation: number; // 0-5 score based on ratings
  matchesPlayed: number; // Counter
  playSide: 'right' | 'backhand' | 'indifferent'; // Preference
  dominantHand: 'right' | 'left'; // Hand
}

export interface Match {
  id: number;
  club: string;
  zone: string;
  locationDetail?: string;
  date: string;
  time: string;
  duration: number; // Duration in minutes
  level: string;
  price: number;
  matchType: 'competitive' | 'friendly';
  genderCategory: 'male' | 'female' | 'mixed';
  courtType: 'indoor' | 'outdoor';
  wallType: 'glass' | 'wall';    
  hasBeer: boolean;
  hasBalls: boolean; 
  acceptsCash: boolean;
  preferredPosition: 'right' | 'backhand' | 'indifferent'; // New field
  creator: string;
  creatorReputation?: number; // New: For trust score
  creatorLevel?: string; // New: For reference
  whatsapp: string;
  isPremium: boolean;
  status: 'Open' | 'Closed' | 'Finished';
  createdAt: string;
  players: string[];
  isRated?: boolean; // Track if current user rated this match
  cancellationRequests?: string[]; // New: List of players requesting to leave < 3h
}

export type ViewState = 'feed' | 'active' | 'profile';
