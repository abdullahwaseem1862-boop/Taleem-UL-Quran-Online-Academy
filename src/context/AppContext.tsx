import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, User, UserRole } from '../types';
import { translations, getTranslation } from '../translations';
import { api, getStoredToken } from '../api/client';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ur'];
  isRtl: boolean;
  currentUser: User | null;
  activeView: 'public' | 'portal';
  setActiveView: (view: 'public' | 'portal') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginUser: (username: string, password?: string) => Promise<void>;
  quickLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ur');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'public' | 'portal'>('public');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const isRtl = language === 'ur' || language === 'ar';
  const t = getTranslation(language);

  // Update HTML tag dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  // Load user session on boot
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api.getCurrentUser()
        .then(res => {
          if (res?.user) {
            setCurrentUser(res.user);
            setActiveView('portal');
          }
        })
        .catch(() => {
          // Token invalid or server reset
        });
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const loginUser = async (username: string, password?: string) => {
    const res = await api.login(username, password);
    setCurrentUser(res.user);
    setActiveView('portal');
    setIsLoginModalOpen(false);
    
    // Choose sensible default tab based on role
    if (res.user.role === 'teacher') setActiveTab('hifz');
    else if (res.user.role === 'accountant') setActiveTab('fees');
    else if (res.user.role === 'parent' || res.user.role === 'student') setActiveTab('dashboard');
    else setActiveTab('dashboard');

    notify(`خوش آمدید، ${res.user.name}`);
  };

  const quickLogin = async (role: UserRole) => {
    const roleUsernameMap: Record<UserRole, string> = {
      admin: 'admin',
      teacher: 'teacher',
      accountant: 'accountant',
      student: 'student',
      parent: 'parent'
    };
    await loginUser(roleUsernameMap[role]);
  };

  const logout = async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveView('public');
    notify('آپ بحفاظت لاگ آؤٹ ہو چکے ہیں');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRtl,
        currentUser,
        activeView,
        setActiveView,
        activeTab,
        setActiveTab,
        loginUser,
        quickLogin,
        logout,
        notification,
        notify,
        isLoginModalOpen,
        setIsLoginModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
