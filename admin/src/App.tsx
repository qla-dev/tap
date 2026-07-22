/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, Nfc, Smartphone, Settings, Plus, Search, 
  Trash2, Copy, Check, Sparkles, Sliders, MapPin, 
  Clock, Share2, Eye, ShieldCheck, Heart, AlertTriangle, 
  Info, Wifi, WifiOff, Download, Code,
  Wrench, Home, MessageSquare, ChevronRight, Play, ExternalLink,
  Facebook, Instagram, Linkedin, Twitter, Youtube, ChevronLeft, LayoutDashboard
} from 'lucide-react';
import { TapProfile, ParsedTapProfile, Testimonial, Service } from './types';
import { createProfile, deleteProfile, loadProfiles, saveProfile } from './services/api';
import TapCardPreview from './components/TapCardPreview';
import NfcProgrammer from './components/NfcProgrammer';
import { mediaUrl } from './utils/media';

const WORK_DAYS = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'] as const;
const WORK_HOURS_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d - (?:[01]\d|2[0-3]):[0-5]\d$/;

const formatWorkHours = (value: string): string | null => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6), digits.slice(6, 8)];

  if (parts[0].length === 2 && Number(parts[0]) > 23) return null;
  if (parts[1].length === 2 && Number(parts[1]) > 59) return null;
  if (parts[2].length === 2 && Number(parts[2]) > 23) return null;
  if (parts[3].length === 2 && Number(parts[3]) > 59) return null;

  if (digits.length <= 2) return parts[0];
  if (digits.length <= 4) return `${parts[0]}:${parts[1]}`;
  if (digits.length <= 6) return `${parts[0]}:${parts[1]} - ${parts[2]}`;
  return `${parts[0]}:${parts[1]} - ${parts[2]}:${parts[3]}`;
};

const prefixedUrlValue = (value: string | null, prefix: string): string => {
  if (!value) return prefix;
  if (value.startsWith(prefix)) return value;

  try {
    const url = new URL(value);
    return `${prefix}${url.pathname.replace(/^\/+/, '')}${url.search}${url.hash}`;
  } catch {
    return `${prefix}${value.replace(/^\/+/, '')}`;
  }
};

export default function App() {
  const [profiles, setProfiles] = useState<ParsedTapProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'identity' | 'gallery' | 'google' | 'hours' | 'socials' | 'developer'>('identity');
  
  // PWA & Browser Status State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [workspaceView, setWorkspaceView] = useState<'home' | 'editor'>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Form input validation helper state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize and register status triggers
  useEffect(() => {
    // Load database profiles
    loadProfiles()
      .then((loaded) => {
        setProfiles(loaded);
        if (loaded.length > 0) setActiveProfileId(loaded[0].id);
      })
      .catch((error) => {
        console.error('Unable to load profiles from Laravel', error);
        alert('Unable to load profiles from the server.');
      });

    // Monitor Online/Offline Status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor PWA Installation Trigger
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('[PWA] beforeinstallprompt event captured');
    });

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('[PWA] Application successfully installed');
    });

    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  // Keep the UI responsive while persisting changes to Laravel in order.
  const handleUpdateProfile = (updated: ParsedTapProfile) => {
    const nextList = profiles.map(p => p.id === updated.id ? updated : p);
    setProfiles(nextList);
    void saveProfile(updated).catch((error) => {
      console.error('Unable to save profile', error);
    });
  };

  const handleCreateProfile = async () => {
    const nextId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
    const newProfile: ParsedTapProfile = {
      id: nextId,
      name: "New Tap Card",
      slug: `new-slug-${nextId}`,
      email: `tap-${Date.now()}@qla.dev`,
      email_verified_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      remember_token: null,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      phone_number: "+1 (555) 000-0000",
      office_number: null,
      office_address: null,
      profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      title: "Title / Job Role",
      about_me: "Write a short elegant greeting or store summary here...",
      gallery: [{
        image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=80",
        zoom: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=1200&auto=format&fit=crop&q=85",
        alt: "Gallery image 1",
      }],
      map_location: null,
      testimonials: [
        { name: "John Client", text: "Exceptional quality and professional workflow!", rating: 5 }
      ],
      services: [
        { title: "Standard Consult", description: "Strategic layout review and custom business brief.", price: "$99", icon: "Smartphone" }
      ],
      facebook: null,
      instagram: null,
      whatsapp: null,
      linkedin: null,
      twitter: null,
      youtube: null,
      booking: null,
      airbnb: null,
      google: null,
      pik: "https://olx.ba/",
      website: null,
      directions: null,
      reviews: null,
      work_hours: {
        Ponedjeljak: "09:00 - 17:00",
        Utorak: "09:00 - 17:00",
        Srijeda: "09:00 - 17:00",
        Četvrtak: "09:00 - 17:00",
        Petak: "09:00 - 17:00",
        Subota: "Zatvoreno",
        Nedjelja: "Zatvoreno",
      },
      views: 0,
      google_redirect: 0
    };

    try {
      const created = await createProfile(newProfile);
      setProfiles(current => [...current, created]);
      setActiveProfileId(created.id);
      setActiveTab('identity');
      setWorkspaceView('editor');
    } catch (error) {
      console.error('Unable to create profile', error);
      alert('Unable to create the profile. Check that its email and slug are unique.');
    }
  };

  const handleDeleteProfile = async (id: number) => {
    if (profiles.length <= 1) {
      alert("At least one template profile is required.");
      return;
    }
    if (confirm("Are you sure you want to delete this tap card profile? This cannot be undone.")) {
      try {
        await deleteProfile(id);
        const nextList = profiles.filter(p => p.id !== id);
        setProfiles(nextList);
        setActiveProfileId(nextList[0].id);
      } catch (error) {
        console.error('Unable to delete profile', error);
        alert('Unable to delete the profile from the server.');
      }
    }
  };

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted installation');
        } else {
          console.log('[PWA] User dismissed installation');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleInputChange = (field: keyof ParsedTapProfile, value: any) => {
    if (!activeProfile) return;

    // Validate slugs to keep them URL-friendly
    if (field === 'slug') {
      const sanitized = value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const slugExists = profiles.some(p => p.slug === sanitized && p.id !== activeProfile.id);
      
      if (slugExists) {
        setFormErrors(prev => ({ ...prev, slug: 'This URL slug is already taken' }));
      } else {
        setFormErrors(prev => {
          const next = { ...prev };
          delete next.slug;
          return next;
        });
      }
      
      handleUpdateProfile({
        ...activeProfile,
        [field]: sanitized
      });
      return;
    }

    // Auto-generate slug if name changes and slug matches old name
    if (field === 'name') {
      const oldSlug = activeProfile.slug;
      const expectedOldSlug = activeProfile.name.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      if (oldSlug === expectedOldSlug || !oldSlug) {
        const nextSlug = value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
        handleUpdateProfile({
          ...activeProfile,
          name: value,
          slug: nextSlug
        });
        return;
      }
    }

    handleUpdateProfile({
      ...activeProfile,
      [field]: value
    });
  };

  const handlePrefixedUrlChange = (field: keyof ParsedTapProfile, prefix: string, value: string) => {
    if (!value.startsWith(prefix)) return;
    handleInputChange(field, value);
  };

  // Add/Remove Helpers for Complex JSON objects (services, testimonials, gallery)
  const handleAddService = () => {
    if (!activeProfile) return;
    const newSvc: Service = { title: "New Service", description: "Short details of the service...", price: "Quote", icon: "Wrench" };
    handleInputChange('services', [...activeProfile.services, newSvc]);
  };

  const handleUpdateService = (idx: number, key: keyof Service, val: string) => {
    if (!activeProfile) return;
    const nextSvcs = [...activeProfile.services];
    nextSvcs[idx] = { ...nextSvcs[idx], [key]: val };
    handleInputChange('services', nextSvcs);
  };

  const handleRemoveService = (idx: number) => {
    if (!activeProfile) return;
    const nextSvcs = activeProfile.services.filter((_, i) => i !== idx);
    handleInputChange('services', nextSvcs);
  };

  const handleAddTestimonial = () => {
    if (!activeProfile) return;
    const newTest: Testimonial = { name: "Client Name", text: "Feedback description...", rating: 5 };
    handleInputChange('testimonials', [...activeProfile.testimonials, newTest]);
  };

  const handleUpdateTestimonial = (idx: number, key: keyof Testimonial, val: any) => {
    if (!activeProfile) return;
    const nextTests = [...activeProfile.testimonials];
    nextTests[idx] = { ...nextTests[idx], [key]: val };
    handleInputChange('testimonials', nextTests);
  };

  const handleRemoveTestimonial = (idx: number) => {
    if (!activeProfile) return;
    const nextTests = activeProfile.testimonials.filter((_, i) => i !== idx);
    handleInputChange('testimonials', nextTests);
  };

  const handleAddGalleryUrl = () => {
    if (!activeProfile) return;
    const url = prompt("Enter complete image URL:");
    if (url) {
      handleInputChange('gallery', [...activeProfile.gallery, {
        image: url,
        zoom: url,
        alt: `Gallery image ${activeProfile.gallery.length + 1}`,
      }]);
    }
  };

  const handleRemoveGalleryUrl = (idx: number) => {
    if (!activeProfile) return;
    const nextGallery = activeProfile.gallery.filter((_, i) => i !== idx);
    handleInputChange('gallery', nextGallery);
  };

  // Image Upload base64 simulation
  const handleImageUpload = (field: 'profile_image' | 'cover_image', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditor = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setWorkspaceView('editor');
    setViewMode('edit');
  };

  const handleSelectProfile = (id: number) => {
    setActiveProfileId(id);
    setActiveTab('identity');
    setWorkspaceView('editor');
    setViewMode('edit');
  };

  const quickActions = [
    { id: 'identity', label: 'Identity & Branding', description: 'Update the profile name, URL slug, email, slogan, and core brand details.', icon: Sliders, iconClass: 'bg-blue-500/15 text-blue-400' },
    { id: 'gallery', label: 'Gallery', description: 'Manage profile and cover images, gallery items, services, and testimonials.', icon: Sparkles, iconClass: 'bg-emerald-500/15 text-emerald-400' },
    { id: 'google', label: 'Google', description: 'Configure location, embedded map, directions, business page, and reviews.', icon: MapPin, iconClass: 'bg-rose-500/15 text-rose-400' },
    { id: 'hours', label: 'Working Hours', description: 'Set the weekly opening schedule and additional availability information.', icon: Clock, iconClass: 'bg-amber-500/15 text-amber-400' },
    { id: 'socials', label: 'Social & Contact', description: 'Connect contact details, social profiles, booking pages, and partner ID.', icon: Share2, iconClass: 'bg-violet-500/15 text-violet-400' },
    { id: 'developer', label: 'Developer & NFC', description: 'Export profile data, inspect integration details, and program NFC tags.', icon: Code, iconClass: 'bg-orange-500/15 text-orange-400' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col h-screen overflow-hidden" id="qla-main-dashboard">
      
      {/* HEADER SECTION (PWA & STATUS CONTROL BAR) */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 py-3 sm:px-6 sm:py-3.5 shrink-0 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between z-30">
        <button onClick={() => { setWorkspaceView('home'); setViewMode('edit'); }} className="flex min-w-0 items-center gap-3 text-left cursor-pointer" title="Open dashboard home">
          <img
            src="https://deklarant.ai/build/images/logo-qla-dark.png"
            alt="qla.dev"
            className="h-8 w-auto max-w-[112px] object-contain sm:h-9 sm:max-w-[132px]"
            referrerPolicy="no-referrer"
          />
          <div className="h-7 w-px bg-slate-700" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-[0.16em] text-white">TAP</span>
            </div>
            <p className="text-xs leading-snug text-slate-400">Digital Business Cards & NFC Programmer Hub</p>
          </div>
        </button>

        {/* Dynamic PWA Status indicators */}
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-0.5 lg:w-auto lg:gap-3 lg:overflow-visible lg:pb-0">
          {/* Online/Offline Badge */}
          <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${
            isOnline 
              ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' 
              : 'bg-rose-500/15 border-rose-500/25 text-rose-400'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-bounce" />
                <span>Offline Mode</span>
              </>
            )}
          </div>

          {/* PWA Register Button */}
          {deferredPrompt ? (
            <button
              onClick={handleInstallPWA}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install PWA App</span>
            </button>
          ) : isInstalled ? (
            <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-300 text-xs flex items-center gap-1.5 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">PWA Installed</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-slate-850/50 text-slate-500 text-xs rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PWA Offline-Ready</span>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="ml-auto shrink-0 bg-slate-950 rounded-lg p-0.5 border border-slate-800 flex text-xs lg:ml-0">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'edit' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="sm:hidden">Edit</span>
              <span className="hidden sm:inline">Edit Mode</span>
            </button>
            <button
              onClick={() => { setWorkspaceView('editor'); setViewMode('preview'); }}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="sm:hidden">Preview</span>
              <span className="hidden sm:inline">Preview Mode</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE BODY WRAPPER */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* COLUMN 1: SIDEBAR (PROFILES & ANALYTICS DIRECTORY) */}
        {viewMode === 'edit' && (
          <aside className={`${sidebarCollapsed ? 'w-[76px]' : 'w-80'} bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden transition-[width] duration-300 ease-out`}>

            <div className={`h-12 border-b border-slate-800 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between px-4'} shrink-0`}>
              {!sidebarCollapsed && (
                <button onClick={() => setWorkspaceView('home')} className={`flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${workspaceView === 'home' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
              )}
              <button
                onClick={() => setSidebarCollapsed(value => !value)}
                className="w-8 h-8 rounded-lg border border-slate-700/70 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
            
            {sidebarCollapsed && (
              <div className="p-3 border-b border-slate-800 flex flex-col items-center gap-2">
                <button
                  onClick={() => setWorkspaceView('home')}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${workspaceView === 'home' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                  title="Dashboard home"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCreateProfile}
                  className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Create new profile"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Profiles List with Search */}
            <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} flex-grow flex flex-col overflow-hidden`}>
              {!sidebarCollapsed && (
              <>
              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search profiles or slugs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 pl-9 pr-4 py-2 text-xs rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono font-bold tracking-wider uppercase mb-2">ACTIVE SITES DIRECTORY</div>
              </>
              )}
              
              {/* Profile Scroll Container */}
              <div className={`${sidebarCollapsed ? 'space-y-2 px-1' : 'space-y-2 pr-1'} overflow-y-auto flex-grow scrollbar`}>
                {filteredProfiles.map((p) => {
                  const isActive = p.id === activeProfileId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProfile(p.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleSelectProfile(p.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      title={sidebarCollapsed ? p.name : undefined}
                      className={`group ${sidebarCollapsed ? 'p-2 justify-center' : 'p-3 justify-between'} rounded-xl transition-all flex items-center cursor-pointer outline-none focus:bg-slate-800 ${
                        isActive
                          ? 'bg-slate-800/80 shadow-sm'
                          : 'bg-slate-950/40 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {p.profile_image ? (
                          <img 
                            src={mediaUrl(p.profile_image)}
                            alt={p.name} 
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-display font-bold text-slate-400 text-sm shrink-0">
                            {p.name.charAt(0)}
                          </div>
                        )}
                        {!sidebarCollapsed && <div className="min-w-0">
                          <h4 className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>{p.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono block truncate">/{p.slug}</span>
                        </div>}
                      </div>

                      {!sidebarCollapsed && <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-0.5">
                          <Eye className="w-3 h-3" /> {p.views}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProfile(p.id);
                          }}
                          className="p-1.5 text-slate-600 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>}
                    </div>
                  );
                })}

                {filteredProfiles.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-xs italic">
                    {sidebarCollapsed ? '—' : 'No profiles match your search criteria.'}
                  </div>
                )}
              </div>
            </div>

            {!sidebarCollapsed && (
              <div className="p-4 mt-auto border-t border-slate-800 bg-slate-950/40">
                <button
                  onClick={handleCreateProfile}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/10 cursor-pointer active:scale-98 transition-all"
                >
                  <Plus className="w-4 h-4" /> Create New Profile
                </button>
              </div>
            )}
          </aside>
        )}

        {/* DASHBOARD HOME: QUICK ACTION LANDING */}
        {viewMode === 'edit' && workspaceView === 'home' && (
          <main className="flex-grow overflow-y-auto bg-[#171717] px-8 py-10 lg:px-16 lg:py-14 scrollbar">
            <div className="max-w-[1180px] mx-auto min-h-full flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-7">
                <div>
                  <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-slate-500 mb-3">qla.dev TAP workspace</p>
                  <h1 className="font-sans text-4xl lg:text-[44px] font-normal tracking-[-0.035em] text-slate-100">Manage your digital profiles</h1>
                  <p className="text-sm text-slate-500 mt-3">Choose a quick option to update {activeProfile?.name || 'a profile'}.</p>
                </div>
                <div className="rounded-full bg-[#202020] border border-[#2d2d2d] p-1 flex text-xs shrink-0 self-start sm:self-auto">
                  <button className="px-4 py-2 rounded-full bg-[#303030] text-slate-100 font-semibold">Quick options</button>
                  <button onClick={() => openEditor('identity')} className="px-4 py-2 rounded-full text-slate-500 hover:text-slate-200 transition-colors cursor-pointer">Full editor</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {quickActions.map(action => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => openEditor(action.id)}
                      disabled={!activeProfile}
                      className="group min-h-[176px] rounded-2xl border border-[#303030] bg-[#202020] hover:bg-[#242424] hover:border-[#3b3b3b] p-5 text-left transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.iconClass}`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-[17px] font-semibold text-slate-200 group-hover:text-white transition-colors">{action.label}</span>
                      </div>
                      <p className="text-sm leading-6 text-[#929292] max-w-sm">{action.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button onClick={() => openEditor('identity')} disabled={!activeProfile} className="px-4 py-2 rounded-xl border border-[#303030] bg-[#1b1b1b] hover:bg-[#252525] text-sm font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50">
                  Start editing
                </button>
                <button onClick={handleCreateProfile} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create new profile
                </button>
              </div>
            </div>
          </main>
        )}

        {/* COLUMN 2: RICH CMS FORM EDITORS */}
        {viewMode === 'edit' && workspaceView === 'editor' && activeProfile && (
          <main className="flex-grow bg-slate-950 border-r border-slate-800 flex flex-col overflow-hidden">
            
            {/* Section tabs header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 shrink-0 flex gap-2 overflow-x-auto scrollbar">
              {[
                { id: 'identity', label: 'Identity', icon: Sliders },
                { id: 'gallery', label: 'Gallery', icon: Sparkles },
                { id: 'google', label: 'Google', icon: MapPin },
                { id: 'hours', label: 'Work Hours', icon: Clock },
                { id: 'socials', label: 'Social', icon: Share2 },
                { id: 'developer', label: 'Developer Sync & NFC', icon: Code },
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isSelected 
                        ? 'bg-blue-600/10 border border-blue-500/25 text-blue-400 font-bold shadow' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Editing Pane Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar">
              
              {/* TAB 1: GENERAL & IDENTITY */}
              {activeTab === 'identity' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 mb-4">
                    <h3 className="font-display font-semibold text-base text-white">Identity & Branding</h3>
                    <p className="text-xs text-slate-500">Configure core profile metadata, branding, and the public URL.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">NAME</label>
                      <input
                        type="text"
                        value={activeProfile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">URL SLUG</label>
                      <input
                        type="text"
                        value={activeProfile.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className={`w-full bg-slate-900 border focus:outline-none p-2.5 rounded-xl text-sm font-mono transition-all ${
                          formErrors.slug ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.slug && <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.slug}</span>}
                    </div>
                  </div>

                  <div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">EMAIL</label>
                      <input
                        type="email"
                        value={activeProfile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">SUBTITLE / SLOGAN</label>
                    <input
                      type="text"
                      value={activeProfile.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">ABOUT ME / DESCRIPTION</label>
                    <textarea
                      rows={4}
                      value={activeProfile.about_me || ''}
                      onChange={(e) => handleInputChange('about_me', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-3 rounded-xl text-sm font-medium transition-all resize-none"
                    />
                  </div>

                </div>
              )}

              {/* GOOGLE, LOCATION & REVIEWS */}
              {activeTab === 'google' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 mb-4">
                    <h3 className="font-display font-semibold text-base text-white">Google & Location</h3>
                    <p className="text-xs text-slate-500">Configure the address, embedded map, directions, business profile, and reviews.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">LOCATION / STREET ADDRESS</label>
                    <input
                      type="text"
                      value={activeProfile.office_address || ''}
                      onChange={(e) => handleInputChange('office_address', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">EMBEDDED MAP URL</label>
                    <input
                      type="url"
                      value={activeProfile.map_location ?? 'https://www.google.com/maps/embed?pb='}
                      onChange={(e) => handleInputChange('map_location', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">DIRECTIONS URL</label>
                      <input type="url" value={activeProfile.directions ?? 'https://www.google.com/maps/dir/?api=1&destination='} onChange={(e) => handleInputChange('directions', e.target.value)} className="w-full bg-slate-900 focus:outline-none p-2.5 rounded-xl text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">GOOGLE MAP / BUSINESS PAGE</label>
                      <input type="url" value={activeProfile.google ?? 'https://www.google.com/search?q='} onChange={(e) => handleInputChange('google', e.target.value)} className="w-full bg-slate-900 focus:outline-none p-2.5 rounded-xl text-xs font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">GOOGLE REVIEWS URL</label>
                      <input type="url" value={activeProfile.reviews ?? 'https://search.google.com/local/reviews?placeid='} onChange={(e) => handleInputChange('reviews', e.target.value)} className="w-full bg-slate-900 focus:outline-none p-2.5 rounded-xl text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">GOOGLE REVIEW REDIRECT</label>
                      <select value={activeProfile.google_redirect ? 1 : 0} onChange={(e) => handleInputChange('google_redirect', Number(e.target.value))} className="w-full bg-slate-900 focus:outline-none p-2.5 rounded-xl text-sm font-semibold">
                        <option value={0}>Disabled — show profile</option>
                        <option value={1}>Enabled — redirect to reviews</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WORKING HOURS */}
              {activeTab === 'hours' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 mb-4">
                    <h3 className="font-display font-semibold text-base text-white">Office Operating Hours</h3>
                    <p className="text-xs text-slate-500">Provide weekly timetables. Highlighting handles current day active states.</p>
                  </div>

                  {WORK_DAYS.map((day) => (
                      <div key={day} className="grid grid-cols-3 gap-4 items-center border-b border-slate-900 pb-3">
                        <label className="text-xs font-mono font-bold text-slate-400 uppercase col-span-1">{day}</label>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={activeProfile.work_hours[day] || ''}
                            onChange={(e) => {
                              const formatted = formatWorkHours(e.target.value);
                              if (formatted === null) return;
                              handleInputChange('work_hours', {
                                ...activeProfile.work_hours,
                                [day]: formatted,
                              });
                            }}
                            inputMode="numeric"
                            pattern="(?:[01][0-9]|2[0-3]):[0-5][0-9] - (?:[01][0-9]|2[0-3]):[0-5][0-9]"
                            maxLength={13}
                            placeholder="09:00 - 17:00"
                            aria-invalid={Boolean(activeProfile.work_hours[day]) && activeProfile.work_hours[day] !== 'Zatvoreno' && !WORK_HOURS_PATTERN.test(activeProfile.work_hours[day])}
                            className={`w-full bg-slate-900 border focus:outline-none p-2 rounded-lg text-xs font-mono ${
                              activeProfile.work_hours[day] && activeProfile.work_hours[day] !== 'Zatvoreno' && !WORK_HOURS_PATTERN.test(activeProfile.work_hours[day])
                                ? 'border-rose-500 focus:border-rose-400'
                                : 'border-slate-800 focus:border-blue-500'
                            }`}
                          />
                          <p className="mt-1 text-[10px] text-slate-500">24-hour format: HH:MM - HH:MM</p>
                        </div>
                      </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SOCIALS & LINKS */}
              {activeTab === 'socials' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 mb-4">
                    <h3 className="font-display font-semibold text-base text-white">Social & Contact</h3>
                    <p className="text-xs text-slate-500">Manage direct contact, social channels, bookings, and partner integrations.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">TELEPHONE</label>
                      <input type="tel" value={activeProfile.phone_number || ''} onChange={(e) => handleInputChange('phone_number', e.target.value)} className="w-full bg-slate-900 focus:outline-none p-2 rounded-lg text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">OFFICE LINE</label>
                      <input type="tel" value={activeProfile.office_number || ''} onChange={(e) => handleInputChange('office_number', e.target.value)} className="w-full bg-slate-900 focus:outline-none p-2 rounded-lg text-xs font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">WEBSITE</label>
                      <input type="url" value={activeProfile.website ?? 'https://'} onChange={(e) => handleInputChange('website', e.target.value)} className="w-full bg-slate-900 focus:outline-none p-2 rounded-lg text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">OLX/PIK</label>
                      <input type="url" value={prefixedUrlValue(activeProfile.pik, 'https://olx.ba/')} onChange={(e) => handlePrefixedUrlChange('pik', 'https://olx.ba/', e.target.value)} className="w-full bg-slate-900 focus:outline-none p-2 rounded-lg text-xs font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Facebook className="w-3.5 h-3.5 text-blue-500" /> FACEBOOK URL
                      </label>
                      <input
                        type="url"
                        value={prefixedUrlValue(activeProfile.facebook, 'https://facebook.com/')}
                        onChange={(e) => handlePrefixedUrlChange('facebook', 'https://facebook.com/', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5 text-pink-500" /> INSTAGRAM URL
                      </label>
                      <input
                        type="url"
                        value={prefixedUrlValue(activeProfile.instagram, 'https://instagram.com/')}
                        onChange={(e) => handlePrefixedUrlChange('instagram', 'https://instagram.com/', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WHATSAPP
                      </label>
                      <input
                        type="url"
                        value={prefixedUrlValue(activeProfile.whatsapp, 'https://wa.me/')}
                        onChange={(e) => handlePrefixedUrlChange('whatsapp', 'https://wa.me/', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Linkedin className="w-3.5 h-3.5 text-indigo-400" /> LINKEDIN URL
                      </label>
                      <input
                        type="url"
                        value={prefixedUrlValue(activeProfile.linkedin, 'https://linkedin.com/')}
                        onChange={(e) => handlePrefixedUrlChange('linkedin', 'https://linkedin.com/', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Twitter className="w-3.5 h-3.5 text-sky-450" /> TWITTER / X URL
                      </label>
                      <input
                        type="url"
                        value={prefixedUrlValue(activeProfile.twitter, 'https://x.com/')}
                        onChange={(e) => handlePrefixedUrlChange('twitter', 'https://x.com/', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Youtube className="w-3.5 h-3.5 text-red-500" /> YOUTUBE CHANNEL URL
                      </label>
                      <input
                        type="url"
                        value={prefixedUrlValue(activeProfile.youtube, 'https://youtube.com/')}
                        onChange={(e) => handlePrefixedUrlChange('youtube', 'https://youtube.com/', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-4 mt-2">
                    <div className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">External Bookings & Redirects</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">CALENDLY BOOKING</label>
                        <input
                          type="url"
                          value={prefixedUrlValue(activeProfile.booking, 'https://calendly.com/')}
                          onChange={(e) => handlePrefixedUrlChange('booking', 'https://calendly.com/', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">AIRBNB DIRECT LINK</label>
                        <input
                          type="url"
                          value={prefixedUrlValue(activeProfile.airbnb, 'https://airbnb.com/')}
                          onChange={(e) => handlePrefixedUrlChange('airbnb', 'https://airbnb.com/', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* GALLERY, PROFILE & COVER MEDIA */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">

                  <div>
                    <div className="border-b border-slate-850 pb-2 mb-4">
                      <h3 className="font-display font-semibold text-base text-white">Profile & Cover Images</h3>
                      <p className="text-xs text-slate-500">Manage the primary logo and cover used by the public profile.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">PROFILE IMAGE</label>
                        {activeProfile.profile_image && activeProfile.profile_image !== 'https://' && (
                          <div className="mb-3 flex h-28 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50">
                            <img
                              src={mediaUrl(activeProfile.profile_image)}
                              alt="Profile image preview"
                              className="h-20 w-20 rounded-full border-2 border-slate-700 object-cover shadow-lg"
                            />
                          </div>
                        )}
                        <label className="inline-flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                          Upload Profile Image
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload('profile_image', e)} className="hidden" />
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">COVER IMAGE</label>
                        {activeProfile.cover_image && activeProfile.cover_image !== 'https://' && (
                          <div className="mb-3 h-28 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
                            <img
                              src={mediaUrl(activeProfile.cover_image)}
                              alt="Cover image preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <label className="inline-flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                          Upload Cover Image
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover_image', e)} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Photo Gallery Manager */}
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-base text-white">Media Gallery</h3>
                        <p className="text-xs text-slate-500">Add portfolio layouts to display on the tap page.</p>
                      </div>
                      <button
                        onClick={handleAddGalleryUrl}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Photo URL
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {activeProfile.gallery.map((item, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
                          <img src={mediaUrl(item.image)} alt={item.alt || `Gallery item ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            onClick={() => handleRemoveGalleryUrl(i)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 hover:text-rose-300 font-semibold text-xs transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {activeProfile.gallery.length === 0 && (
                        <div className="col-span-4 py-8 border border-dashed border-slate-850 rounded-xl text-center text-xs text-slate-600 italic">
                          No images loaded in gallery. Press "Add Photo URL" above.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Services List Builder */}
                  <div className="hidden">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-base text-white">Services Offered</h3>
                        <p className="text-xs text-slate-500">Configure product catalogs or consultations.</p>
                      </div>
                      <button
                        onClick={handleAddService}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Service
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeProfile.services.map((svc, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-850 p-4 rounded-xl relative space-y-3">
                          <button
                            onClick={() => handleRemoveService(i)}
                            className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 p-1 rounded transition-all cursor-pointer"
                            title="Remove Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">SERVICE TITLE</label>
                              <input
                                type="text"
                                value={svc.title}
                                onChange={(e) => handleUpdateService(i, 'title', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none p-1.5 rounded-lg text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">PRICE TAG</label>
                              <input
                                type="text"
                                value={svc.price || ''}
                                onChange={(e) => handleUpdateService(i, 'price', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none p-1.5 rounded-lg text-xs font-mono text-blue-400 font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">DESCRIPTION</label>
                              <input
                                type="text"
                                value={svc.description}
                                onChange={(e) => handleUpdateService(i, 'description', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none p-1.5 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">ICON</label>
                              <select
                                value={svc.icon || 'Sparkles'}
                                onChange={(e) => handleUpdateService(i, 'icon', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:outline-none p-1.5 rounded-lg text-xs font-semibold"
                              >
                                <option value="Smartphone">Smartphone Icon</option>
                                <option value="Wrench">Wrench Icon</option>
                                <option value="Home">Home Icon</option>
                                <option value="Layers">Layers Icon</option>
                                <option value="Sparkles">Sparkles Icon</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      {activeProfile.services.length === 0 && (
                        <div className="py-8 border border-dashed border-slate-850 rounded-xl text-center text-xs text-slate-600 italic bg-slate-900/10">
                          No services added. Press "Add Service" above.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Testimonial / Review Builder */}
                  <div className="hidden">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-base text-white">Testimonials & Reviews</h3>
                        <p className="text-xs text-slate-500">Showcase user-rated feedback to build brand loyalty.</p>
                      </div>
                      <button
                        onClick={handleAddTestimonial}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Testimonial
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeProfile.testimonials.map((test, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-850 p-4 rounded-xl relative space-y-3">
                          <button
                            onClick={() => handleRemoveTestimonial(i)}
                            className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 p-1 rounded transition-all cursor-pointer"
                            title="Remove Testimonial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">CLIENT NAME</label>
                              <input
                                type="text"
                                value={test.name}
                                onChange={(e) => handleUpdateTestimonial(i, 'name', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none p-1.5 rounded-lg text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">STAR RATING</label>
                              <select
                                value={test.rating}
                                onChange={(e) => handleUpdateTestimonial(i, 'rating', Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 focus:outline-none p-1.5 rounded-lg text-xs font-semibold text-yellow-500"
                              >
                                {[5, 4, 3, 2, 1].map(r => (
                                  <option key={r} value={r}>{'★'.repeat(r) + '☆'.repeat(5-r)}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">FEEDBACK / TEXT</label>
                            <textarea
                              rows={2}
                              value={test.text}
                              onChange={(e) => handleUpdateTestimonial(i, 'text', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">AVATAR URL</label>
                            <input
                              type="text"
                              value={test.avatar || ''}
                              onChange={(e) => handleUpdateTestimonial(i, 'avatar', e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none p-1.5 rounded-lg text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      ))}
                      {activeProfile.testimonials.length === 0 && (
                        <div className="py-8 border border-dashed border-slate-850 rounded-xl text-center text-xs text-slate-600 italic bg-slate-900/10">
                          No testimonials added. Press "Add Testimonial" above.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 6: DEVELOPER SYNC TOOLS & NFC TAG WRITING */}
              {activeTab === 'developer' && (
                <div className="space-y-6">
                  
                  {/* Web NFC tag programming module */}
                  <NfcProgrammer profile={activeProfile} />

                </div>
              )}

            </div>
          </main>
        )}

        {/* COLUMN 3: REAL-TIME MOBILE CARD VISUAL PREVIEW */}
        {workspaceView === 'editor' && activeProfile && viewMode === 'preview' && (
          <section className="bg-slate-950 flex flex-col items-center justify-center relative p-6 shrink-0 w-full overflow-y-auto">
            <a
              href={`${window.location.origin}/${activeProfile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-6 px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
            >
              Open in New Tab <ExternalLink className="w-3 h-3" />
            </a>

            {/* Simulated Smartphone Screen Wrapper */}
            <div className="w-full max-w-[360px] h-[720px] rounded-[38px] bg-slate-950 border-[10px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col my-auto scale-105">
              
              {/* Dynamic Screen Punch Hole Bezel */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 z-40 flex justify-center">
                <div className="w-24 h-4 bg-black rounded-b-xl border-x border-b border-slate-900" />
              </div>

              {/* Card Container frame with independent scrollbar */}
              <div className="flex-grow overflow-y-auto pt-6 scrollbar">
                <TapCardPreview profile={activeProfile} isStandalone={false} />
              </div>
            </div>

          </section>
        )}

      </div>
    </div>
  );
}
