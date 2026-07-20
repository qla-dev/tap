/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Phone, Mail, MapPin, Globe, Clock, Smartphone, Wrench, Home, 
  Layers, Star, ExternalLink, Calendar, ChevronDown, ChevronUp, 
  Instagram, Linkedin, Facebook, Twitter, Youtube, Eye, Sparkles,
  Share2, ArrowUpRight, ShieldCheck, Heart, AppWindow, UserCheck,
  Check, Copy, Navigation, MessageSquare
} from 'lucide-react';
import { ParsedTapProfile, Service, Testimonial } from '../types';
import { mediaUrl } from '../utils/media';

interface TapCardPreviewProps {
  profile: ParsedTapProfile;
  isStandalone?: boolean;
}

export default function TapCardPreview({ profile, isStandalone = false }: TapCardPreviewProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [hoursOpen, setHoursOpen] = useState<boolean>(false);
  const [currentDayStr, setCurrentDayStr] = useState<string>('');
  const [showHoursList, setShowHoursList] = useState<boolean>(false);
  
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const localOrigin = window.location.origin;
  const cardUrl = `${localOrigin}/${profile.slug}`;

  // Generate QR code dynamically when slug or profile changes
  useEffect(() => {
    if (profile.slug) {
      QRCode.toDataURL(cardUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a', // deep slate
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR Generation failed:', err));
    }
  }, [profile.slug, cardUrl]);

  // Determine current day of the week and if the office is currently open
  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const todayName = days[now.getDay()];
    setCurrentDayStr(todayName);

    // Dynamic office-hours checker
    const hoursKey = `office_hours_${todayName.toLowerCase()}` as keyof ParsedTapProfile;
    const todayHours = profile[hoursKey] as string | null;

    if (!todayHours || todayHours.toLowerCase() === 'closed') {
      setHoursOpen(false);
      return;
    }

    try {
      // Expected format: "09:00 AM - 08:00 PM"
      const parts = todayHours.split('-');
      if (parts.length === 2) {
        const parseTime = (timeStr: string) => {
          const clean = timeStr.trim().toUpperCase();
          const isPm = clean.includes('PM');
          const isAm = clean.includes('AM');
          let [hours, minutes] = clean.replace('AM', '').replace('PM', '').trim().split(':').map(Number);
          
          if (isPm && hours !== 12) hours += 12;
          if (isAm && hours === 12) hours = 0;
          
          const d = new Date();
          d.setHours(hours, minutes, 0, 0);
          return d;
        };

        const startTime = parseTime(parts[0]);
        const endTime = parseTime(parts[1]);

        setHoursOpen(now >= startTime && now <= endTime);
      }
    } catch (e) {
      console.warn("Could not parse office hours for opening status", e);
      setHoursOpen(true); // default to true if parsing error to prevent wrong indicators
    }
  }, [profile]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Helper to map string to beautiful Lucide icons for services
  const getServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-indigo-400" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-violet-400" />;
      default: return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto bg-slate-950 text-slate-100 flex flex-col min-h-screen relative overflow-hidden select-none ${isStandalone ? 'shadow-2xl ring-1 ring-slate-800 rounded-3xl' : ''}`} style={{ contentVisibility: 'auto' }}>
      
      {/* 1. Brand Cover Banner */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        {profile.cover_image ? (
          <img 
            src={mediaUrl(profile.cover_image)}
            alt="Cover" 
            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-500/20" />
          </div>
        )}
        {/* Soft elegant shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
      </div>

      {/* 2. Profile Overlap Area */}
      <div className="px-5 relative -mt-16 mb-4 flex items-end justify-between z-10">
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl bg-slate-950 p-1 ring-4 ring-slate-950/40 shadow-xl overflow-hidden">
            {profile.profile_image ? (
              <img 
                src={mediaUrl(profile.profile_image)}
                alt={profile.name} 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center rounded-xl font-display font-bold text-slate-400 text-2xl">
                {profile.name ? profile.name.charAt(0) : 'T'}
              </div>
            )}
          </div>
          {/* Real-time active status check badge */}
          <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-slate-950 flex items-center justify-center ${hoursOpen ? 'bg-emerald-500' : 'bg-amber-500'}`} title={hoursOpen ? "Open Now" : "Closed"}>
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </span>
        </div>

        {/* Floating Page Views Card */}
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 flex items-center gap-1.5 text-slate-300">
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono text-xs font-bold">{profile.views} views</span>
        </div>
      </div>

      {/* 3. Core Identity */}
      <div className="px-5 mb-5">
        <div className="flex items-center gap-1.5">
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">{profile.name}</h1>
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
        </div>
        {profile.title && (
          <p className="text-sm font-medium text-slate-300 mt-0.5">{profile.title}</p>
        )}
        {profile.pik && (
          <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-mono text-slate-400">
            <span className="w-1 h-1 bg-indigo-400 rounded-full" />
            PARTNER ID: {profile.pik}
          </div>
        )}
      </div>

      {/* 4. Contact Actions Quick Bar */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-850">
          {profile.phone_number && (
            <a 
              href={`tel:${profile.phone_number}`}
              className="flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Call Us</span>
            </a>
          )}
          {profile.whatsapp && (
            <a 
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">WhatsApp</span>
            </a>
          )}
          {profile.email && (
            <a 
              href={`mailto:${profile.email}`}
              className="flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-11 h-11 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Email</span>
            </a>
          )}
          {profile.office_address && (
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(profile.office_address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                <Navigation className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Navigate</span>
            </a>
          )}
        </div>
      </div>

      {/* 5. Social Grid */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar">
          {profile.facebook && (
            <a 
              href={profile.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 shrink-0 bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-slate-400 hover:text-blue-500 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Facebook className="w-4.5 h-4.5" />
            </a>
          )}
          {profile.instagram && (
            <a 
              href={profile.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 shrink-0 bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-slate-400 hover:text-pink-500 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
          )}
          {profile.linkedin && (
            <a 
              href={profile.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 shrink-0 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-400 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
          )}
          {profile.twitter && (
            <a 
              href={profile.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 shrink-0 bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-slate-400 hover:text-sky-400 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Twitter className="w-4.5 h-4.5" />
            </a>
          )}
          {profile.youtube && (
            <a 
              href={profile.youtube} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 shrink-0 bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Youtube className="w-4.5 h-4.5" />
            </a>
          )}
          {profile.website && (
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 shrink-0 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Globe className="w-4.5 h-4.5" />
            </a>
          )}
        </div>
      </div>

      {/* 6. Body Contents */}
      <div className="px-5 space-y-6 flex-grow pb-24">
        
        {/* About Card */}
        {profile.about_me && (
          <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl">
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">ABOUT US</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{profile.about_me}</p>
          </div>
        )}

        {/* Office Hours Dropdown Card */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setShowHoursList(!showHoursList)}
            className="w-full px-4.5 py-4 flex justify-between items-center text-left hover:bg-slate-850/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Clock className={`w-4 h-4 ${hoursOpen ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase block">OFFICE HOURS</span>
                <span className="text-xs text-slate-200 font-semibold mt-0.5">
                  {hoursOpen ? 'Open Now' : 'Closed'} • {currentDayStr ? profile[`office_hours_${currentDayStr.toLowerCase()}` as keyof ParsedTapProfile] as string : 'Contact for details'}
                </span>
              </div>
            </div>
            {showHoursList ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showHoursList && (
            <div className="border-t border-slate-850 bg-slate-950/45 px-4.5 py-3 space-y-2 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const isToday = day === currentDayStr;
                const hours = profile[`office_hours_${day.toLowerCase()}` as keyof ParsedTapProfile] as string | null;
                return (
                  <div 
                    key={day} 
                    className={`flex justify-between items-center py-1.5 px-2 rounded-lg ${
                      isToday ? 'bg-indigo-600/15 border border-indigo-500/25 font-bold text-slate-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{day}</span>
                    <span className="font-mono text-xs">{hours || 'Closed'}</span>
                  </div>
                );
              })}
              {profile.work_hours && (
                <p className="text-[10px] text-slate-500 font-mono mt-3 text-center border-t border-slate-850 pt-2">
                  * {profile.work_hours}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Services Showcase */}
        {profile.services && profile.services.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">OUR SERVICES</h2>
            <div className="space-y-3">
              {profile.services.map((svc, i) => (
                <div key={i} className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-start gap-3.5 hover:border-slate-800 transition-all">
                  <div className="p-2 bg-slate-850 rounded-xl border border-slate-750 shrink-0">
                    {getServiceIcon(svc.icon)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-display font-semibold text-slate-100 leading-tight">{svc.title}</h3>
                      {svc.price && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                          {svc.price}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{svc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Photo Gallery */}
        {profile.gallery && profile.gallery.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">GALLERY</h2>
            <div className="grid grid-cols-3 gap-2">
              {profile.gallery.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActivePhoto(img)}
                  className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-850 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <img 
                    src={mediaUrl(img)}
                    alt={`Gallery ${i}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Testimonials */}
        {profile.testimonials && profile.testimonials.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">TESTIMONIALS</h2>
            <div className="space-y-3">
              {profile.testimonials.map((test, i) => (
                <div key={i} className="bg-slate-900 border border-slate-850 p-4 rounded-2xl">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    {test.avatar ? (
                      <img 
                        src={mediaUrl(test.avatar)}
                        alt={test.name} 
                        className="w-8 h-8 rounded-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-display font-bold text-xs text-slate-400">
                        {test.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-display font-semibold text-slate-200">{test.name}</h4>
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3 h-3 ${idx < test.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Action Integrations (Booking, Airbnb, Reviews) */}
        <div className="space-y-2.5 pt-2">
          {profile.booking && (
            <a 
              href={profile.booking} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3 px-4.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl flex items-center justify-between font-semibold text-xs shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Book Appointment
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          {profile.airbnb && (
            <a 
              href={profile.airbnb} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3 px-4.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-between font-semibold text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" /> View Airbnb Listing
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          {profile.reviews && (
            <a 
              href={profile.reviews} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3 px-4.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-2xl flex items-center justify-between font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Write a Google Review
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* 8. QR Scan Card */}
        <div className="bg-slate-900/70 border border-slate-850 p-4.5 rounded-3xl flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase mb-1.5">SCAN ME IN REAL LIFE</h3>
          <p className="text-[10px] text-slate-500 mb-4 max-w-xs">Scan using any physical phone camera to instantly test this template profile live on mobile</p>
          
          <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200 w-44 h-44 flex items-center justify-center">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-full select-all" />
            ) : (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />
            )}
          </div>
          
          <div className="flex gap-2 w-full mt-4">
            <button
              onClick={handleCopyLink}
              className="flex-grow py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center text-[10px] text-slate-600 font-mono pb-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <AppWindow className="w-3.5 h-3.5 text-slate-600" />
            <span>PWA OFFLINE COMPATIBLE</span>
          </div>
          <div>POWERED BY QLA.DEV TAP</div>
        </div>

      </div>

      {/* 9. Full size Photo Lightbox Modal */}
      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all"
        >
          <div className="relative max-w-md max-h-[80vh] bg-slate-950 p-1 border border-slate-800 rounded-2xl overflow-hidden">
            <img src={mediaUrl(activePhoto)} alt="Zoomed" className="w-full h-auto object-contain max-h-[75vh]" referrerPolicy="no-referrer" />
            <div className="absolute top-2 right-2 px-2.5 py-1 bg-black/60 rounded-lg text-xs font-mono text-white">Tap anywhere to close</div>
          </div>
        </div>
      )}

    </div>
  );
}
