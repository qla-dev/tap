/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TapProfile, ParsedTapProfile, Testimonial, Service } from '../types';

// Initial high-fidelity template for the "mi-store" digital card
const INITIAL_PROFILES: TapProfile[] = [
  {
    id: 1,
    name: "Xiaomi Mi Store",
    slug: "mi-store",
    email: "mi-store@qla.dev",
    email_verified_at: "2026-07-20 08:00:00",
    remember_token: null,
    created_at: "2026-07-20 08:00:00",
    updated_at: "2026-07-20 08:00:00",
    phone_number: "+1 (555) 942-6644",
    office_number: "+1 (555) 942-0010",
    office_address: "452 Silicon Boulevard, Suite A, San Jose, CA",
    profile_image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80",
    cover_image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&auto=format&fit=crop&q=80",
    title: "Official Xiaomi Reseller & IoT Hub",
    about_me: "Your trusted center for the latest Xiaomi tech ecosystem. Explore top-tier smartphones, smart lighting, cameras, robot vacuums, and professional authorized repair services in one immersive showroom. Tap to call, view location, book service, or follow our global community.",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558885561-56c2a4e2f3bc?w=600&auto=format&fit=crop&q=80"
    ]),
    map_location: "https://maps.google.com/?q=452+Silicon+Boulevard+San+Jose+CA",
    testimonials: JSON.stringify([
      {
        name: "Sarah Jenkins",
        text: "Incredible customer service! They replaced my phone display in under 45 minutes using certified parts.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
      },
      {
        name: "Alex Rivera",
        text: "The smart home ecosystem display is mind-blowing. Staff is super helpful with configuring the Mi Home app.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      },
      {
        name: "Mikael Chen",
        text: "Great launch bundle offers on the new flagship series. Fast setup and friendly vibes.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
      }
    ]),
    services: JSON.stringify([
      {
        title: "Flagship Device Showroom",
        description: "Hands-on testing for all modern smartphones, tablets, and wearable accessories with specialized product advisors.",
        price: "Free Access",
        icon: "Smartphone"
      },
      {
        title: "Smart Home Consultations",
        description: "Tailored layout planning to automate your home with smart lights, cameras, sensors, and voice integration systems.",
        price: "Complimentary",
        icon: "Home"
      },
      {
        title: "Authorized Screen & Battery Service",
        description: "Quick, certified screen replacements and hardware tuneups with genuine Xiaomi components on site.",
        price: "Quote On-Site",
        icon: "Wrench"
      }
    ]),
    facebook: "https://facebook.com/xiaomiglobal",
    instagram: "https://instagram.com/xiaomi.global",
    whatsapp: "https://wa.me/15559426644",
    linkedin: "https://linkedin.com/company/xiaomi",
    twitter: "https://twitter.com/xiaomi",
    youtube: "https://youtube.com/xiaomiglobal",
    booking: "https://calendly.com/mi-store-appointment",
    airbnb: "",
    google: "https://google.com/search?q=Xiaomi+Official+Store",
    pik: "XI-8842",
    office_hours_monday: "09:00 AM - 08:00 PM",
    office_hours_tuesday: "09:00 AM - 08:00 PM",
    office_hours_wednesday: "09:00 AM - 08:00 PM",
    office_hours_thursday: "09:00 AM - 08:00 PM",
    office_hours_friday: "09:00 AM - 08:00 PM",
    office_hours_saturday: "10:00 AM - 06:00 PM",
    office_hours_sunday: "11:00 AM - 05:00 PM",
    website: "https://mi.com",
    directions: "https://maps.google.com/?q=452+Silicon+Boulevard+San+Jose+CA",
    reviews: "https://search.google.com/local/reviews?placeid=mi-store",
    work_hours: "Standard Shopping Mall hours. Holiday timings may vary.",
    views: 482,
    google_redirect: 0
  },
  {
    id: 2,
    name: "Elena Rostova",
    slug: "elena-design",
    email: "elena@qla.dev",
    email_verified_at: "2026-07-20 08:00:00",
    remember_token: null,
    created_at: "2026-07-20 08:00:00",
    updated_at: "2026-07-20 08:00:00",
    phone_number: "+1 (555) 321-7788",
    office_number: null,
    office_address: "Arts District Loft 14, Los Angeles, CA",
    profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    cover_image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80",
    title: "Senior UX Designer & Brand Strategist",
    about_me: "Hi, I am Elena! I help seed-stage startups and global tech companies architect elegant, high-converting digital products. Specializing in visual design systems, interactive prototypes, and modern spatial interfaces. Open to selective consulting contracts.",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&auto=format&fit=crop&q=80"
    ]),
    map_location: "https://maps.google.com/?q=Los+Angeles+Arts+District",
    testimonials: JSON.stringify([
      {
        name: "Marcus Aurelius",
        text: "Elena singlehandedly redesigned our SaaS application. Our user onboarding completion rate surged by 45%.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
      }
    ]),
    services: JSON.stringify([
      {
        title: "Product Interface Design",
        description: "Interactive UX/UI screen layout design from lo-fi wireframes to final pixel-perfect interactive handoff specs.",
        price: "$150 / hr",
        icon: "PenTool"
      },
      {
        title: "Design System Engineering",
        description: "Creating unified token-based styles, custom component libraries, and visual guidelines compatible with Figma & Tailwind.",
        price: "Fixed Quote",
        icon: "Layers"
      }
    ]),
    facebook: "",
    instagram: "https://instagram.com/elenadesign",
    whatsapp: "https://wa.me/15553217788",
    linkedin: "https://linkedin.com/in/elenadesign",
    twitter: "https://twitter.com/elenadesign",
    youtube: "",
    booking: "https://calendly.com/elena-ux",
    airbnb: "",
    google: "",
    pik: "EL-009",
    office_hours_monday: "10:00 AM - 06:00 PM",
    office_hours_tuesday: "10:00 AM - 06:00 PM",
    office_hours_wednesday: "10:00 AM - 06:00 PM",
    office_hours_thursday: "10:00 AM - 06:00 PM",
    office_hours_friday: "10:00 AM - 04:00 PM",
    office_hours_saturday: "Closed",
    office_hours_sunday: "Closed",
    website: "https://elena.design",
    directions: "",
    reviews: "",
    work_hours: "Freelance availability. Virtual consultations only.",
    views: 125,
    google_redirect: 0
  }
];

export const parseProfile = (p: TapProfile): ParsedTapProfile => {
  let gallery: string[] = [];
  let testimonials: Testimonial[] = [];
  let services: Service[] = [];

  try {
    gallery = Array.isArray(p.gallery) ? p.gallery : (p.gallery ? JSON.parse(p.gallery) : []);
  } catch (e) {
    console.error("Error parsing gallery JSON", e);
  }

  try {
    testimonials = Array.isArray(p.testimonials) ? p.testimonials : (p.testimonials ? JSON.parse(p.testimonials) : []);
  } catch (e) {
    console.error("Error parsing testimonials JSON", e);
  }

  try {
    services = Array.isArray(p.services) ? p.services : (p.services ? JSON.parse(p.services) : []);
  } catch (e) {
    console.error("Error parsing services JSON", e);
  }

  return {
    ...p,
    gallery,
    testimonials,
    services
  };
};

export const serializeProfile = (p: ParsedTapProfile): TapProfile => {
  return {
    ...p,
    gallery: JSON.stringify(p.gallery),
    testimonials: JSON.stringify(p.testimonials),
    services: JSON.stringify(p.services)
  };
};

const API_URL = '/api/admin/profiles';
const saveQueues = new Map<number, Promise<ParsedTapProfile>>();

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `API request failed (${response.status})`);
  }

  return response.status === 204 ? (undefined as T) : response.json();
};

const apiPayload = (profile: ParsedTapProfile) => {
  const { id, created_at, updated_at, email_verified_at, remember_token, views, ...payload } = profile;
  return payload;
};

export const loadProfiles = async (): Promise<ParsedTapProfile[]> => {
  const profiles = await request<TapProfile[]>(API_URL);
  return profiles.map(parseProfile);
};

export const createProfile = async (profile: ParsedTapProfile): Promise<ParsedTapProfile> => {
  const created = await request<TapProfile>(API_URL, {
    method: 'POST',
    body: JSON.stringify(apiPayload(profile)),
  });
  return parseProfile(created);
};

export const saveProfile = (profile: ParsedTapProfile): Promise<ParsedTapProfile> => {
  const previous = saveQueues.get(profile.id) ?? Promise.resolve(profile);
  const next = previous.catch(() => profile).then(async () => {
    const saved = await request<TapProfile>(`${API_URL}/${profile.id}`, {
      method: 'PUT',
      body: JSON.stringify(apiPayload(profile)),
    });
    return parseProfile(saved);
  });

  saveQueues.set(profile.id, next);
  next.finally(() => {
    if (saveQueues.get(profile.id) === next) saveQueues.delete(profile.id);
  });
  return next;
};

export const deleteProfile = async (id: number): Promise<void> => {
  await request<void>(`${API_URL}/${id}`, { method: 'DELETE' });
};

// Helper to escape string for MySQL INSERT queries
const escapeSqlString = (str: string | null): string => {
  if (str === null) return 'NULL';
  const escaped = str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  return `'${escaped}'`;
};

export const generateSqlInsert = (p: ParsedTapProfile): string => {
  const dbProfile = serializeProfile(p);
  
  const columns = [
    'id', 'name', 'slug', 'email', 'email_verified_at', 'password', 'remember_token',
    'created_at', 'updated_at', 'phone_number', 'office_number', 'office_address',
    'profile_image', 'cover_image', 'title', 'about_me', 'gallery', 'map_location',
    'testimonials', 'services', 'facebook', 'instagram', 'whatsapp', 'linkedin',
    'twitter', 'youtube', 'booking', 'airbnb', 'google', 'pik', 'office_hours_monday',
    'office_hours_tuesday', 'office_hours_wednesday', 'office_hours_thursday',
    'office_hours_friday', 'office_hours_saturday', 'office_hours_sunday',
    'website', 'directions', 'reviews', 'work_hours', 'views', 'google_redirect'
  ];

  const values = [
    dbProfile.id,
    escapeSqlString(dbProfile.name),
    escapeSqlString(dbProfile.slug),
    escapeSqlString(dbProfile.email),
    dbProfile.email_verified_at ? escapeSqlString(dbProfile.email_verified_at) : 'NULL',
    dbProfile.password ? escapeSqlString(dbProfile.password) : "NULL",
    dbProfile.remember_token ? escapeSqlString(dbProfile.remember_token) : 'NULL',
    escapeSqlString(dbProfile.created_at),
    escapeSqlString(dbProfile.updated_at),
    dbProfile.phone_number ? escapeSqlString(dbProfile.phone_number) : 'NULL',
    dbProfile.office_number ? escapeSqlString(dbProfile.office_number) : 'NULL',
    dbProfile.office_address ? escapeSqlString(dbProfile.office_address) : 'NULL',
    dbProfile.profile_image ? escapeSqlString(dbProfile.profile_image) : 'NULL',
    dbProfile.cover_image ? escapeSqlString(dbProfile.cover_image) : 'NULL',
    dbProfile.title ? escapeSqlString(dbProfile.title) : 'NULL',
    dbProfile.about_me ? escapeSqlString(dbProfile.about_me) : 'NULL',
    escapeSqlString(dbProfile.gallery),
    dbProfile.map_location ? escapeSqlString(dbProfile.map_location) : 'NULL',
    escapeSqlString(dbProfile.testimonials),
    escapeSqlString(dbProfile.services),
    dbProfile.facebook ? escapeSqlString(dbProfile.facebook) : 'NULL',
    dbProfile.instagram ? escapeSqlString(dbProfile.instagram) : 'NULL',
    dbProfile.whatsapp ? escapeSqlString(dbProfile.whatsapp) : 'NULL',
    dbProfile.linkedin ? escapeSqlString(dbProfile.linkedin) : 'NULL',
    dbProfile.twitter ? escapeSqlString(dbProfile.twitter) : 'NULL',
    dbProfile.youtube ? escapeSqlString(dbProfile.youtube) : 'NULL',
    dbProfile.booking ? escapeSqlString(dbProfile.booking) : 'NULL',
    dbProfile.airbnb ? escapeSqlString(dbProfile.airbnb) : 'NULL',
    dbProfile.google ? escapeSqlString(dbProfile.google) : 'NULL',
    dbProfile.pik ? escapeSqlString(dbProfile.pik) : 'NULL',
    dbProfile.office_hours_monday ? escapeSqlString(dbProfile.office_hours_monday) : 'NULL',
    dbProfile.office_hours_tuesday ? escapeSqlString(dbProfile.office_hours_tuesday) : 'NULL',
    dbProfile.office_hours_wednesday ? escapeSqlString(dbProfile.office_hours_wednesday) : 'NULL',
    dbProfile.office_hours_thursday ? escapeSqlString(dbProfile.office_hours_thursday) : 'NULL',
    dbProfile.office_hours_friday ? escapeSqlString(dbProfile.office_hours_friday) : 'NULL',
    dbProfile.office_hours_saturday ? escapeSqlString(dbProfile.office_hours_saturday) : 'NULL',
    dbProfile.office_hours_sunday ? escapeSqlString(dbProfile.office_hours_sunday) : 'NULL',
    dbProfile.website ? escapeSqlString(dbProfile.website) : 'NULL',
    dbProfile.directions ? escapeSqlString(dbProfile.directions) : 'NULL',
    dbProfile.reviews ? escapeSqlString(dbProfile.reviews) : 'NULL',
    dbProfile.work_hours ? escapeSqlString(dbProfile.work_hours) : 'NULL',
    dbProfile.views,
    dbProfile.google_redirect ? 1 : 0
  ];

  return `INSERT INTO users (\n  ${columns.join(',\n  ')}\n) VALUES (\n  ${values.join(',\n  ')}\n);`;
};
