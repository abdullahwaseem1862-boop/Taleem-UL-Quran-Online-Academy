import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Users, FileText, BookOpen, GraduationCap, 
  CalendarCheck, Calculator, Award, Bell, Settings, HelpCircle, 
  LogOut, Globe, Menu, X, ArrowRight, ShieldCheck, ChevronDown, ExternalLink 
} from 'lucide-react';
import { Language } from '../types';
import { DashboardView } from './portal/DashboardView';
import { StudentsView } from './portal/StudentsView';
import { AdmissionsView } from './portal/AdmissionsView';
import { ClassesView } from './portal/ClassesView';
import { TeachersView } from './portal/TeachersView';
import { AttendanceView } from './portal/AttendanceView';
import { FeesView } from './portal/FeesView';
import { HifzTrackerView } from './portal/HifzTrackerView';
import { ExaminationsView } from './portal/ExaminationsView';
import { AnnouncementsView } from './portal/AnnouncementsView';
import { SettingsAndBackupView } from './portal/SettingsAndBackupView';
import { UrduGuideView } from './portal/UrduGuideView';

export const PortalLayout: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    activeTab, 
    setActiveTab, 
    setActiveView, 
    language, 
    setLanguage, 
    t 
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const role = currentUser?.role || 'admin';

  // Navigation items filtered by role
  const allMenuItems = [
    { id: 'dashboard', label: t.menuDashboard, icon: LayoutDashboard, roles: ['admin', 'teacher', 'accountant', 'student', 'parent'] },
    { id: 'hifz', label: t.menuHifzTracker, icon: BookOpen, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'attendance', label: t.menuAttendance, icon: CalendarCheck, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'fees', label: t.menuFees, icon: Calculator, roles: ['admin', 'accountant', 'student', 'parent'] },
    { id: 'exams', label: t.menuExaminations, icon: Award, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'students', label: t.menuStudents, icon: Users, roles: ['admin', 'accountant'] },
    { id: 'admissions', label: t.menuAdmissions, icon: FileText, roles: ['admin'] },
    { id: 'classes', label: t.menuClasses, icon: BookOpen, roles: ['admin', 'teacher'] },
    { id: 'teachers', label: t.menuTeachers, icon: GraduationCap, roles: ['admin'] },
    { id: 'announcements', label: t.menuAnnouncements, icon: Bell, roles: ['admin', 'teacher', 'accountant', 'student', 'parent'] },
    { id: 'settings', label: t.menuSettings, icon: Settings, roles: ['admin'] },
    { id: 'guide', label: t.menuHelpGuide, icon: HelpCircle, roles: ['admin', 'teacher', 'accountant', 'student', 'parent'] }
  ];

  const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(role));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'admissions':
        return <AdmissionsView />;
      case 'classes':
        return <ClassesView />;
      case 'teachers':
        return <TeachersView />;
      case 'attendance':
        return <AttendanceView />;
      case 'fees':
        return <FeesView />;
      case 'hifz':
        return <HifzTrackerView />;
      case 'exams':
        return <ExaminationsView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'settings':
        return <SettingsAndBackupView />;
      case 'guide':
        return <UrduGuideView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col">
      {/* Top Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => setActiveView('public')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400 font-bold border border-amber-400/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-sm tracking-tight text-white leading-tight">
                  {t.campusName}
                </div>
                <div className="text-[10px] text-emerald-300">انتظامی پورٹل</div>
              </div>
            </div>
          </div>

          {/* Right items: View Website, Language, User profile, Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('public')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs border border-emerald-800 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>پبلک ویب سائٹ دیکھیں</span>
            </button>

            {/* Language toggle */}
            <div className="flex items-center gap-1 bg-emerald-900 px-2 py-1 rounded-lg border border-emerald-800 text-xs">
              {(['ur', 'en', 'ar'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-1.5 py-0.5 rounded ${language === l ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-emerald-300'}`}
                >
                  {l === 'ur' ? 'اردو' : l === 'en' ? 'EN' : 'عربی'}
                </button>
              ))}
            </div>

            {/* Current user & Logout */}
            <div className="flex items-center gap-2 border-r border-emerald-800 pr-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{currentUser?.name}</div>
                <div className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold">
                  {role}
                </div>
              </div>

              <button
                onClick={logout}
                title="لاگ آؤٹ کریں"
                className="p-2 rounded-lg bg-emerald-900/80 hover:bg-red-900/60 text-emerald-200 hover:text-red-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs sticky top-24 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
              مینو و ماڈیولز
            </div>

            {visibleMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-emerald-50/60 hover:text-emerald-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative w-72 bg-white h-full p-4 overflow-y-auto space-y-2 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-bold text-sm text-stone-900">پورٹل مینو</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-stone-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {visibleMenuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
