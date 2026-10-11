import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  X, Shield, GraduationCap, Calculator, UserCheck, 
  Users, KeyRound, ArrowRight, CheckCircle2, Lock 
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginUser, quickLogin, t } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(username, password);
    } catch (err: any) {
      setError(err.message || 'لاگ ان کی معلومات درست نہیں ہیں');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await quickLogin(role);
    } catch (err: any) {
      setError(err.message || 'لاگ ان نہیں ہو سکا');
    } finally {
      setLoading(false);
    }
  };

  const quickRoles: { role: UserRole; titleUrdu: string; titleEn: string; desc: string; icon: any; color: string }[] = [
    {
      role: 'admin',
      titleUrdu: 'ناظم اعلیٰ / ایڈمنسٹریٹر',
      titleEn: 'Administrator',
      desc: 'مکمل نظام، طلبہ و اساتذہ، فیس، رپورٹس، ڈیٹا بیک اپ',
      icon: Shield,
      color: 'border-emerald-700 bg-emerald-50 text-emerald-900'
    },
    {
      role: 'teacher',
      titleUrdu: 'استاذ محترم (شعبہ حفظ)',
      titleEn: 'Teacher / Ustad',
      desc: 'روزانہ سبق، سبقی، منزل کا جائزہ، روزانہ حاضری، امتحانی نمبرات',
      icon: GraduationCap,
      color: 'border-teal-700 bg-teal-50 text-teal-900'
    },
    {
      role: 'accountant',
      titleUrdu: 'ناظم مالیات / اکاؤنٹنٹ',
      titleEn: 'Accountant',
      desc: 'فیس چالان اجراء، وصولی، پرنٹ ایبل رسیدیں، بقایا جات',
      icon: Calculator,
      color: 'border-amber-700 bg-amber-50 text-amber-900'
    },
    {
      role: 'parent',
      titleUrdu: 'سرپرست / والدین',
      titleEn: 'Parent / Guardian',
      desc: 'بچے کی حفظ کی پیش رفت، حاضری، فیس چالان، رزلٹ کارڈ',
      icon: Users,
      color: 'border-blue-700 bg-blue-50 text-blue-900'
    },
    {
      role: 'student',
      titleUrdu: 'طالب علم',
      titleEn: 'Student',
      desc: 'ذاتی ریکارڈ، ڈیلی حفظ لاگ، امتحانی نتائج، اوقات کار',
      icon: UserCheck,
      color: 'border-indigo-700 bg-indigo-50 text-indigo-900'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-emerald-900/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Islamic Pattern Accent */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 left-4 sm:left-auto sm:right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <span className="font-quran text-amber-300 text-lg block mb-1">﷽</span>
            <h2 className="text-2xl font-bold tracking-tight">پورٹل لاگ ان و انتخابی کردار</h2>
            <p className="text-xs text-emerald-200 mt-1 max-w-md mx-auto">
              جامعہ تعلیم القرآن کیمپس کے مختلف انتظامی و تعلیمی شعبہ جات میں رسائی حاصل کریں
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Quick 1-Click Role Switcher */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>ایک کلک پر تجرباتی کردار منتخب کریں (1-Click Quick Demo)</span>
              </h3>
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                کوئی پاس ورڈ درکار نہیں
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickRoles.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    disabled={loading}
                    onClick={() => handleQuick(item.role)}
                    className={`flex items-start gap-3 p-3 text-right rounded-xl border-2 transition-all hover:shadow-md cursor-pointer disabled:opacity-50 ${item.color}`}
                  >
                    <div className="p-2 rounded-lg bg-white/80 shadow-xs mt-0.5">
                      <Icon className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-stone-900">{item.titleUrdu}</div>
                      <div className="text-[11px] opacity-75 font-sans">{item.titleEn}</div>
                      <div className="text-[11px] text-stone-600 mt-1 leading-snug">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-stone-500 font-medium">یا باقاعدہ صارف نام و پاس ورڈ درج کریں</span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">صارف نام (Username)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin / teacher / accountant / student / parent"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">پاس ورڈ (Password)</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="مثال: admin123 یا کوئی بھی مطلوبہ پاس ورڈ"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-sm font-sans"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                ڈیمو اکاؤنٹس کا معیاری پاس ورڈ: <code className="bg-stone-100 px-1 py-0.5 rounded text-emerald-800 font-mono">admin123</code> یا اپنے یوزرنیم کے ساتھ <code className="bg-stone-100 px-1 py-0.5 rounded text-emerald-800 font-mono">123</code> لگائیں۔
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>لاگ ان ہو رہا ہے...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>پورٹل میں داخل ہوں</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
