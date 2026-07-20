/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, Nfc, Smartphone, Settings, Plus, Search, 
  Trash2, Copy, Check, Sparkles, Sliders, MapPin, 
  Clock, Share2, Eye, ShieldCheck, Heart, AlertTriangle, 
  SmartphoneNfc, Info, Wifi, WifiOff, Download, Code,
  Wrench, Home, MessageSquare, ChevronRight, Play, ExternalLink,
  Facebook, Instagram, Linkedin, Twitter, Youtube, ChevronLeft, LayoutDashboard
} from 'lucide-react';
import { TapProfile, ParsedTapProfile, Testimonial, Service } from './types';
import { createProfile, deleteProfile, loadProfiles, saveProfile } from './services/api';
import TapCardPreview from './components/TapCardPreview';
import NfcProgrammer from './components/NfcProgrammer';
import DatabaseExporter from './components/DatabaseExporter';
import { mediaUrl } from './utils/media';

export default function App() {
  const [profiles, setProfiles] = useState<ParsedTapProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'identity' | 'contact' | 'hours' | 'socials' | 'content' | 'developer'>('identity');
  
  // PWA & Browser Status State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'fullscreen'>('split');
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
      gallery: [
        "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=80"
      ],
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
      pik: `PK-${Math.floor(1000 + Math.random() * 9000)}`,
      office_hours_monday: "09:00 AM - 05:00 PM",
      office_hours_tuesday: "09:00 AM - 05:00 PM",
      office_hours_wednesday: "09:00 AM - 05:00 PM",
      office_hours_thursday: "09:00 AM - 05:00 PM",
      office_hours_friday: "09:00 AM - 05:00 PM",
      office_hours_saturday: "Closed",
      office_hours_sunday: "Closed",
      website: null,
      directions: null,
      reviews: null,
      work_hours: "Standard working hours.",
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
      handleInputChange('gallery', [...activeProfile.gallery, url]);
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
    setViewMode('split');
  };

  const handleSelectProfile = (id: number) => {
    setActiveProfileId(id);
    setActiveTab('identity');
    setWorkspaceView('editor');
    setViewMode('split');
  };

  const quickActions = [
    { id: 'identity', label: 'Identity & Branding', description: 'Update the logo, cover, profile name, URL slug, and core brand details.', icon: Sliders, iconClass: 'bg-blue-500/15 text-blue-400' },
    { id: 'contact', label: 'Contact Details', description: 'Manage phone numbers, email, office address, website, and map location.', icon: MapPin, iconClass: 'bg-emerald-500/15 text-emerald-400' },
    { id: 'hours', label: 'Working Hours', description: 'Set the weekly opening schedule and additional availability information.', icon: Clock, iconClass: 'bg-amber-500/15 text-amber-400' },
    { id: 'socials', label: 'Socials & Links', description: 'Connect social profiles, booking pages, reviews, and external actions.', icon: Share2, iconClass: 'bg-violet-500/15 text-violet-400' },
    { id: 'content', label: 'Media & Services', description: 'Curate gallery images, services, testimonials, and rich profile content.', icon: Sparkles, iconClass: 'bg-rose-500/15 text-rose-400' },
    { id: 'developer', label: 'Developer & NFC', description: 'Export profile data, inspect integration details, and program NFC tags.', icon: Code, iconClass: 'bg-orange-500/15 text-orange-400' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col h-screen overflow-hidden" id="qla-main-dashboard">
      
      {/* HEADER SECTION (PWA & STATUS CONTROL BAR) */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 shrink-0 flex items-center justify-between z-30">
        <button onClick={() => { setWorkspaceView('home'); setViewMode('split'); }} className="flex items-center gap-3 text-left cursor-pointer" title="Open dashboard home">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <SmartphoneNfc className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white">QLA Tap CMS</span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-400">TABLET EDITION</span>
            </div>
            <p className="text-xs text-slate-400">Digital Business Cards & NFC Programmer Hub</p>
          </div>
        </button>

        {/* Dynamic PWA Status indicators */}
        <div className="flex items-center gap-3">
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
              <span>Install PWA App</span>
            </button>
          ) : isInstalled ? (
            <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-300 text-xs flex items-center gap-1.5 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>PWA Installed</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-slate-850/50 text-slate-500 text-xs rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>PWA Offline-Ready</span>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="bg-slate-950 rounded-lg p-0.5 border border-slate-800 flex text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'split' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => { setWorkspaceView('editor'); setViewMode('fullscreen'); }}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'fullscreen' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preview Mode
            </button>
          </div>
        </div>
      </header>

      {/* CORE BODY WRAPPER */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* COLUMN 1: SIDEBAR (PROFILES & ANALYTICS DIRECTORY) */}
        {viewMode === 'split' && (
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
            
            {/* Bento Quick Metrics */}
            {!sidebarCollapsed ? (
            <div className="p-4 border-b border-slate-800 bg-slate-950/20">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <div className="text-slate-500 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">TOTAL TAPS</div>
                  <div className="font-display font-bold text-xl text-white flex items-baseline gap-1.5">
                    {profiles.length}
                    <span className="text-xs font-normal text-slate-500">cards</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <div className="text-slate-500 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">GLOBAL VIEWS</div>
                  <div className="font-display font-bold text-xl text-indigo-400 flex items-baseline gap-1.5">
                    {profiles.reduce((sum, p) => sum + p.views, 0)}
                    <span className="text-xs font-normal text-slate-500">hits</span>
                  </div>
                </div>
              </div>

              {/* Add New Profile Link */}
              <button
                onClick={handleCreateProfile}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/10 cursor-pointer active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4" /> Create New Profile
              </button>
            </div>
            ) : (
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

            {/* Quick Helper Tip in sidebar footer */}
            {!sidebarCollapsed && <div className="p-4 mt-auto border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-500 leading-relaxed font-mono">
              <span className="font-semibold block text-slate-400 mb-1">PROTOTYPE SYNC MODE</span>
              Changes are synchronized with the Laravel profile API.
            </div>}
          </aside>
        )}

        {/* DASHBOARD HOME: QUICK ACTION LANDING */}
        {viewMode === 'split' && workspaceView === 'home' && (
          <main className="flex-grow overflow-y-auto bg-[#171717] px-8 py-10 lg:px-16 lg:py-14 scrollbar">
            <div className="max-w-[1180px] mx-auto min-h-full flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-7">
                <div>
                  <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-slate-500 mb-3">QLA Tap workspace</p>
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
        {viewMode === 'split' && workspaceView === 'editor' && activeProfile && (
          <main className="flex-grow bg-slate-950 border-r border-slate-800 flex flex-col overflow-hidden">
            
            {/* Section tabs header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 shrink-0 flex gap-2 overflow-x-auto scrollbar">
              {[
                { id: 'identity', label: 'Identity', icon: Sliders },
                { id: 'contact', label: 'Contact', icon: MapPin },
                { id: 'hours', label: 'Work Hours', icon: Clock },
                { id: 'socials', label: 'Socials & Links', icon: Share2 },
                { id: 'content', label: 'Media & Services', icon: Sparkles },
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
                    <p className="text-xs text-slate-500">Configure core metadata, URL routing, and security credentials</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">NAME (MySQL: name)</label>
                      <input
                        type="text"
                        value={activeProfile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">URL SLUG (MySQL: slug)</label>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">EMAIL (MySQL: email)</label>
                      <input
                        type="email"
                        value={activeProfile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">PASSWORD (MySQL: password)</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={activeProfile.password || ''}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">SUBTITLE / SLOGAN (MySQL: title)</label>
                    <input
                      type="text"
                      value={activeProfile.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">ABOUT ME / DESCRIPTION (MySQL: about_me)</label>
                    <textarea
                      rows={4}
                      value={activeProfile.about_me || ''}
                      onChange={(e) => handleInputChange('about_me', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-3 rounded-xl text-sm font-medium transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">PROFILE AVATAR URL (MySQL: profile_image)</label>
                      <input
                        type="text"
                        value={activeProfile.profile_image || ''}
                        onChange={(e) => handleInputChange('profile_image', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-xs font-mono mb-2"
                        placeholder="https://..."
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                          Upload Local Photo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload('profile_image', e)} 
                            className="hidden" 
                          />
                        </label>
                        <span className="text-[10px] text-slate-500">PNG / JPG (max 2MB)</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">COVER PHOTO URL (MySQL: cover_image)</label>
                      <input
                        type="text"
                        value={activeProfile.cover_image || ''}
                        onChange={(e) => handleInputChange('cover_image', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-xs font-mono mb-2"
                        placeholder="https://..."
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                          Upload Local Cover
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload('cover_image', e)} 
                            className="hidden" 
                          />
                        </label>
                        <span className="text-[10px] text-slate-500">PNG / JPG (max 2MB)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">PARTNER KEY / ID (MySQL: pik)</label>
                      <input
                        type="text"
                        value={activeProfile.pik || ''}
                        onChange={(e) => handleInputChange('pik', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">GOOGLE SEARCH REDIRECT (MySQL: google_redirect)</label>
                      <select
                        value={activeProfile.google_redirect ? 1 : 0}
                        onChange={(e) => handleInputChange('google_redirect', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-semibold"
                      >
                        <option value={0}>Disabled (Show qla.dev landing page)</option>
                        <option value={1}>Enabled (Auto redirect directly to Google reviews)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT & LOCATION */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 mb-4">
                    <h3 className="font-display font-semibold text-base text-white">Contact & Locational Data</h3>
                    <p className="text-xs text-slate-500">Provide direct communication links for client actions</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">TELEPHONE (MySQL: phone_number)</label>
                      <input
                        type="tel"
                        value={activeProfile.phone_number || ''}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">OFFICE LINE (MySQL: office_number)</label>
                      <input
                        type="tel"
                        value={activeProfile.office_number || ''}
                        onChange={(e) => handleInputChange('office_number', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">OFFICE STREET ADDRESS (MySQL: office_address)</label>
                    <input
                      type="text"
                      value={activeProfile.office_address || ''}
                      onChange={(e) => handleInputChange('office_address', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">MAPS EMBED EMBED / TARGET (MySQL: map_location)</label>
                    <input
                      type="text"
                      value={activeProfile.map_location || ''}
                      onChange={(e) => handleInputChange('map_location', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-xs font-mono"
                      placeholder="https://maps.google.com/?q=..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">WEBSITE LINK (MySQL: website)</label>
                    <input
                      type="url"
                      value={activeProfile.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-sm font-mono"
                      placeholder="https://..."
                    />
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

                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                    const key = `office_hours_${day}` as keyof ParsedTapProfile;
                    return (
                      <div key={day} className="grid grid-cols-3 gap-4 items-center border-b border-slate-900 pb-3">
                        <label className="text-xs font-mono font-bold text-slate-400 uppercase col-span-1">{day}</label>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={activeProfile[key] as string || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            placeholder="09:00 AM - 05:00 PM (or 'Closed')"
                            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">ADDITIONAL HOURS NOTE (MySQL: work_hours)</label>
                    <input
                      type="text"
                      value={activeProfile.work_hours || ''}
                      onChange={(e) => handleInputChange('work_hours', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2.5 rounded-xl text-xs font-medium"
                      placeholder="e.g. Standard Shopping Mall hours. Holiday timings may vary."
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: SOCIALS & LINKS */}
              {activeTab === 'socials' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-850 pb-2 mb-4">
                    <h3 className="font-display font-semibold text-base text-white">Socials & Extended Links</h3>
                    <p className="text-xs text-slate-500">Connect external channels and API appointment listings</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Facebook className="w-3.5 h-3.5 text-blue-500" /> FACEBOOK URL
                      </label>
                      <input
                        type="url"
                        value={activeProfile.facebook || ''}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5 text-pink-500" /> INSTAGRAM URL
                      </label>
                      <input
                        type="url"
                        value={activeProfile.instagram || ''}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WHATSAPP WHATSAPP
                      </label>
                      <input
                        type="url"
                        value={activeProfile.whatsapp || ''}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        placeholder="https://wa.me/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Linkedin className="w-3.5 h-3.5 text-indigo-400" /> LINKEDIN URL
                      </label>
                      <input
                        type="url"
                        value={activeProfile.linkedin || ''}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        placeholder="https://linkedin.com/in/..."
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
                        value={activeProfile.twitter || ''}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                        <Youtube className="w-3.5 h-3.5 text-red-500" /> YOUTUBE CHANNEL URL
                      </label>
                      <input
                        type="url"
                        value={activeProfile.youtube || ''}
                        onChange={(e) => handleInputChange('youtube', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-4 mt-2">
                    <div className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">External Bookings & Redirects</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">CALENDLY BOOKING (MySQL: booking)</label>
                        <input
                          type="url"
                          value={activeProfile.booking || ''}
                          onChange={(e) => handleInputChange('booking', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                          placeholder="https://calendly.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">AIRBNB DIRECT LINK (MySQL: airbnb)</label>
                        <input
                          type="url"
                          value={activeProfile.airbnb || ''}
                          onChange={(e) => handleInputChange('airbnb', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                          placeholder="https://airbnb.com/..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">GOOGLE BUSINESS PAGE (MySQL: google)</label>
                        <input
                          type="url"
                          value={activeProfile.google || ''}
                          onChange={(e) => handleInputChange('google', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                          placeholder="https://google.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5 uppercase">GOOGLE REVIEWS PATH (MySQL: reviews)</label>
                        <input
                          type="url"
                          value={activeProfile.reviews || ''}
                          onChange={(e) => handleInputChange('reviews', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none p-2 rounded-lg text-xs font-mono"
                          placeholder="https://search.google.com/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA & CONTENT SHOWCASES */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  
                  {/* Photo Gallery Manager */}
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-base text-white">Media Gallery</h3>
                        <p className="text-xs text-slate-500">Add portfolio layouts to display on the tap page (MySQL: gallery)</p>
                      </div>
                      <button
                        onClick={handleAddGalleryUrl}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Photo URL
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {activeProfile.gallery.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
                          <img src={mediaUrl(url)} alt={`Gallery item ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-base text-white">Services Offered</h3>
                        <p className="text-xs text-slate-500">Configure product catalogs or consultations (MySQL: services)</p>
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
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-base text-white">Testimonials & Reviews</h3>
                        <p className="text-xs text-slate-500">Showcase user-rated feedback to build brand loyalty (MySQL: testimonials)</p>
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
                  
                  {/* Database Exporter (MySQL 43-column query generator) */}
                  <DatabaseExporter profile={activeProfile} />

                  {/* Web NFC tag programming module */}
                  <NfcProgrammer profile={activeProfile} />

                </div>
              )}

            </div>
          </main>
        )}

        {/* COLUMN 3: REAL-TIME MOBILE CARD VISUAL PREVIEW */}
        {workspaceView === 'editor' && activeProfile && (viewMode === 'fullscreen' || viewMode === 'split') && (
          <section className={`bg-slate-950 flex flex-col items-center justify-center relative p-6 shrink-0 border-slate-800 ${
            viewMode === 'fullscreen' ? 'w-full overflow-y-auto' : 'w-[420px] border-l overflow-hidden'
          }`}>
            
            {/* Top Device Orientation Header */}
            {viewMode === 'split' && (
              <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-semibold">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span>MOBILE PREVIEW</span>
                </div>
                <a 
                  href={`${window.location.origin}/${activeProfile.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                >
                  Open in New Tab <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Simulated Smartphone Screen Wrapper */}
            <div className={`w-full max-w-[360px] h-[720px] rounded-[38px] bg-slate-950 border-[10px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col ${
              viewMode === 'fullscreen' ? 'my-auto scale-105' : 'scale-95'
            }`}>
              
              {/* Dynamic Screen Punch Hole Bezel */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 z-40 flex justify-center">
                <div className="w-24 h-4 bg-black rounded-b-xl border-x border-b border-slate-900" />
              </div>

              {/* Card Container frame with independent scrollbar */}
              <div className="flex-grow overflow-y-auto pt-6 scrollbar">
                <TapCardPreview profile={activeProfile} isStandalone={false} />
              </div>
            </div>

            {/* Quick helper tag at preview bottom */}
            {viewMode === 'split' && (
              <p className="text-[10px] text-slate-500 text-center font-mono max-w-xs mt-3 leading-relaxed">
                * Drag and drop, select items, or type fields on the left. The preview frame refreshes on every keypress!
              </p>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
