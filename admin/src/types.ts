/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Testimonial {
  name: string;
  text: string;
  rating: number; // 1-5
  avatar?: string;
}

export interface Service {
  title: string;
  description: string;
  price?: string;
  icon?: string; // Lucide icon name
}

export interface TapProfile {
  id: number; // bigint(20) UNSIGNED
  name: string;
  slug: string;
  email: string;
  email_verified_at: string | null;
  password?: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  phone_number: string | null;
  office_number: string | null;
  office_address: string | null;
  profile_image: string | null;
  cover_image: string | null;
  title: string | null;
  about_me: string | null;
  gallery: string | null; // JSON string of string[] (image URLs)
  map_location: string | null; // maps embed URL or iframe code
  testimonials: string | null; // JSON string of Testimonial[]
  services: string | null; // JSON string of Service[]
  facebook: string | null;
  instagram: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  twitter: string | null;
  youtube: string | null;
  booking: string | null;
  airbnb: string | null;
  google: string | null;
  pik: string | null;
  office_hours_monday: string | null;
  office_hours_tuesday: string | null;
  office_hours_wednesday: string | null;
  office_hours_thursday: string | null;
  office_hours_friday: string | null;
  office_hours_saturday: string | null;
  office_hours_sunday: string | null;
  website: string | null;
  directions: string | null;
  reviews: string | null;
  work_hours: string | null; // General note
  views: number;
  google_redirect: boolean | number; // 0 or 1
}

// Helper structures for UI parsing
export interface ParsedTapProfile extends Omit<TapProfile, 'gallery' | 'testimonials' | 'services'> {
  gallery: string[];
  testimonials: Testimonial[];
  services: Service[];
}
