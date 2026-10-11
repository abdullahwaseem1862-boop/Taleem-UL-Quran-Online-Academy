import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { 
  Users, UserCheck, GraduationCap, Calculator, Award, 
  CalendarCheck, BookOpen, Clock, AlertTriangle, CheckCircle, 
  ArrowUpRight, FileText, Bell 
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentUser, t, setActiveTab } = useApp();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(res => setStats(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const role = currentUser?.role || 'admin';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 shadow-md border border-amber-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-amber-300 font-quran text-lg mb-1">﷽</div>
            <h2 className="text-xl sm:text-2xl font-bold">
              السلام علیکم ورحمۃ اللہ، {currentUser?.name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              جامعہ تعلیم القرآن کیمپس - انتظامی پورٹل ({t[`role${role.charAt(0).toUpperCase() + role.slice(1)}` as keyof typeof t] || role})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-950/80 border border-emerald-700 text-amber-300 px-3 py-1.5 rounded-lg font-mono">
              {new Date().toLocaleDateString('ur-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div 
          onClick={() => (role === 'admin' || role === 'accountant') && setActiveTab('students')}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">{t.totalStudents}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {stats?.totalStudents || 0}
          </div>
          <div className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-medium">
            <span>فعال طلبہ: {stats?.activeStudents || 0}</span>
          </div>
        </div>

        {/* Hifz Students */}
        <div 
          onClick={() => setActiveTab('hifz')}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">{t.hifzStudents}</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {stats?.hifzCount || 0}
          </div>
          <div className="text-xs text-teal-700 flex items-center gap-1 mt-1 font-medium">
            <span>شعبہ حفظ و تجوید</span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">{t.dailyAttendanceRate}</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {stats?.attendanceRate || 95}%
          </div>
          <div className="text-xs text-blue-700 flex items-center gap-1 mt-1 font-medium">
            <span>آج کی حاضری کیفیت</span>
          </div>
        </div>

        {/* Pending Fee or Admissions */}
        {role === 'accountant' || role === 'admin' ? (
          <div 
            onClick={() => setActiveTab('fees')}
            className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500">{t.monthlyFeeCollection}</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Calculator className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 mt-2">
              PKR {stats?.totalFeesCollected?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-amber-700 flex items-center gap-1 mt-1 font-medium">
              <span>بقایا: PKR {stats?.pendingFees?.toLocaleString() || '0'}</span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setActiveTab('announcements')}
            className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500">اعلانات و نوٹس</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 mt-2">
              2
            </div>
            <div className="text-xs text-amber-700 flex items-center gap-1 mt-1 font-medium">
              <span>تازہ ترین نوٹس بورڈ</span>
            </div>
          </div>
        )}
      </div>

      {/* Role-Specific Shortcuts & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Operational Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-stone-900 flex items-center justify-between">
            <span>اہم انتظامی و تعلیمی فوری اقدامات</span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
              فوری رسائی
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(role === 'admin' || role === 'teacher') && (
              <button
                onClick={() => setActiveTab('hifz')}
                className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-right cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900">شعبہ حفظ - روزانہ جائزہ</div>
                  <div className="text-xs text-stone-500 mt-0.5">سبق، سبقی اور منزل کا اندراج کریں</div>
                </div>
              </button>
            )}

            {(role === 'admin' || role === 'teacher') && (
              <button
                onClick={() => setActiveTab('attendance')}
                className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-right cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-teal-100 text-teal-800">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900">روزانہ طلبہ کی حاضری</div>
                  <div className="text-xs text-stone-500 mt-0.5">ایک کلک پر تمام حاضر یا انفرادی غیر حاضر</div>
                </div>
              </button>
            )}

            {(role === 'admin' || role === 'accountant') && (
              <button
                onClick={() => setActiveTab('fees')}
                className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-right cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900">فیس چالان و رسیدات</div>
                  <div className="text-xs text-stone-500 mt-0.5">فیس وصولی اور پرنٹ ایبل رسیدیں</div>
                </div>
              </button>
            )}

            {(role === 'admin') && (
              <button
                onClick={() => setActiveTab('admissions')}
                className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-right cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-purple-100 text-purple-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900">داخلہ درخواستوں کی جانچ</div>
                  <div className="text-xs text-stone-500 mt-0.5">نئے امیدواروں کی منظوری و رول نمبر</div>
                </div>
              </button>
            )}

            {(role === 'admin' || role === 'teacher' || role === 'student' || role === 'parent') && (
              <button
                onClick={() => setActiveTab('exams')}
                className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-right cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-800">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900">امتحانی نتائج و رپورٹ کارڈ</div>
                  <div className="text-xs text-stone-500 mt-0.5">کارکردگی سرٹیفکیٹ و رزلٹ شیٹ</div>
                </div>
              </button>
            )}

            <button
              onClick={() => setActiveTab('guide')}
              className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-right cursor-pointer"
            >
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-stone-900">مکمل اردو رہنما گائیڈ</div>
                <div className="text-xs text-stone-500 mt-0.5">پورٹل چلانے اور بیک اپ کی ہدایات</div>
              </div>
            </button>
          </div>
        </div>

        {/* Audit Log / Activity */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-stone-900 flex items-center justify-between">
            <span>حالیہ کارروائیاں (Audit Logs)</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </h3>

          <div className="space-y-3 pt-1">
            {stats?.auditLogs && stats.auditLogs.length > 0 ? (
              stats.auditLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">{log.action}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-stone-600 text-[11px]">{log.details}</div>
                  <div className="text-[10px] text-amber-700 font-medium">بذریعہ: {log.user}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-stone-500 text-center py-4">کوئی لاگ موجود نہیں</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
