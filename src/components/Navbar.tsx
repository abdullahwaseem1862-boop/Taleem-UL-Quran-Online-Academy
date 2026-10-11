import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Globe, UserCheck, ShieldCheck, LogIn, Menu, X, Phone, Mail } from 'lucide-react';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    currentUser, 
    activeView, 
    setActiveView, 
    setIsLoginModalOpen,
    setActiveTab
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: t.navHome, id: 'home' },
    { label: t.navAbout, id: 'about' },
    { label: t.navCourses, id: 'courses' },
    { label: t.navAdmissions, id: 'admissions' },
    { label: t.navContact, id: 'contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveView('public');
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-900/10 shadow-xs">
      {/* Top Bar with Islamic ornament, Contact and Language selector */}
      <div className="bg-emerald-950 text-emerald-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 font-quran text-amber-300 text-sm tracking-wide">
            <span>﷽</span>
            <span className="hidden sm:inline text-emerald-300 text-xs font-sans">| {t.campusSub}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-emerald-200">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-amber-400" /> 0300-1234567</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber-400" /> info@taleemulquran.edu</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-800">
              <Globe className="w-3 h-3 text-amber-400" />
              {(['ur', 'en', 'ar'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                    language === lang 
                      ? 'bg-amber-500 text-emerald-950 font-bold' 
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  {lang === 'ur' ? 'اردو' : lang === 'en' ? 'English' : 'العربية'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div 
            onClick={() => { setActiveView('public'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-amber-400 shadow-md border border-amber-500/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-emerald-950 tracking-tight flex items-center gap-1.5">
                {t.campusName}
              </h1>
              <p className="text-xs text-amber-700 font-medium">
                {t.motto}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setActiveView('portal'); setActiveTab('dashboard'); }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer border border-emerald-700"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.navDashboard}</span>
                </button>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-emerald-900 leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-amber-700 uppercase tracking-wider">{currentUser.role}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer border border-amber-500/30"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>{t.navLogin}</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-emerald-800 rounded-lg hover:bg-emerald-50"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-right px-3 py-2 text-sm font-medium text-stone-800 hover:bg-emerald-50 rounded-md"
            >
              {link.label}
            </button>
          ))}
          {!currentUser && (
            <button
              onClick={() => { setMobileMenuOpen(false); setIsLoginModalOpen(true); }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-lg text-sm font-semibold"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>{t.navLogin}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
