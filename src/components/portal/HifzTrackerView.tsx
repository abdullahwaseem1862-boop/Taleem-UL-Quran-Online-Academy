import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { HifzRecord, Student, HifzQuality } from '../../types';
import { 
  BookOpen, Plus, CheckCircle2, Star, Calendar, 
  User, Award, Search, Sparkles, Filter, ChevronRight 
} from 'lucide-react';

export const HifzTrackerView: React.FC = () => {
  const { t, currentUser, notify } = useApp();
  const [students, setStudents] = useState<Student[]>([]);
  const [hifzRecords, setHifzRecords] = useState<HifzRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Hifz Record Form
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    sabaq: {
      surah: 'سورۃ النحل',
      ayaFrom: 1,
      ayaTo: 20,
      juzNumber: 14,
      rating: 'Mumtaz' as HifzQuality
    },
    sabqi: {
      juzNumber: 14,
      pagesOrQuarter: 'نصف اول (پہلے ۸ صفحات)',
      rating: 'Mumtaz' as HifzQuality
    },
    manzil: {
      juzNumber: 6,
      quarterOrHalf: 'مکمل پارہ نمبر 6',
      rating: 'Jayyid' as HifzQuality
    },
    totalJuzMemorized: 14,
    currentJuz: 14,
    remarks: 'ماشاء اللہ تلفظ اور روانگی بہترین ہے'
  });

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getStudents(), api.getHifzRecords()])
      .then(([stds, records]) => {
        const hifzStds = stds.filter(s => s.department === 'Hifz' || s.status === 'Active');
        setStudents(hifzStds);
        setHifzRecords(records);
        if (hifzStds.length > 0 && !selectedStudentId) {
          // If student or parent, select their linked student
          if (currentUser?.linkedStudentId) {
            setSelectedStudentId(currentUser.linkedStudentId);
          } else {
            setSelectedStudentId(hifzStds[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveHifz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addHifzRecord({
        ...formData,
        studentId: formData.studentId || selectedStudentId
      });
      notify('روزانہ سبق، سبقی اور منزل کا ریکارڈ کامیابی سے محفوظ ہو گیا');
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      notify(err.message || 'ریکارڈ محفوظ کرنے میں خامی ہوئی', 'error');
    }
  };

  const activeStudent = students.find(s => s.id === selectedStudentId);
  const studentRecords = hifzRecords.filter(r => r.studentId === selectedStudentId);
  const latestRecord = studentRecords[0];

  const totalJuz = latestRecord ? latestRecord.totalJuzMemorized : 14;
  const progressPercent = Math.round((totalJuz / 30) * 100);

  const getQualityBadge = (quality: HifzQuality) => {
    switch (quality) {
      case 'Mumtaz':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">ممتاز (Excellent)</span>;
      case 'Jayyid Jiddan':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300">جید جداً (Very Good)</span>;
      case 'Jayyid':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">جید (Good)</span>;
      case 'Maqbool':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">مقبول (Acceptable)</span>;
      case 'Daif':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">ضعیف (Needs Work)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span>شعبہ حفظ القرآن - روزانہ جائزہ و پیش رفت</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            سبق (نیا سبق)، سبقی (حالیہ دہرائی)، اور منزل (دور) کا منظم ترین روزانہ جائزہ
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setFormData({
                ...formData,
                studentId: selectedStudentId
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>نیا سبق / جائزہ درج کریں</span>
          </button>
        )}
      </div>

      {/* Student Selector Ribbon (Hidden if Parent/Student with single child) */}
      {(!currentUser?.linkedStudentId || currentUser.role === 'admin' || currentUser.role === 'teacher') && (
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500">طالب علم منتخب کریں:</span>
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStudentId === s.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {s.name} ({s.rollNo})
            </button>
          ))}
        </div>
      )}

      {/* 30 Juz Memorization Visualizer Card */}
      {activeStudent && (
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-amber-500/20 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-amber-300 text-xs font-bold font-mono">طالب علم: {activeStudent.name} (رول: {activeStudent.rollNo})</div>
              <h3 className="text-2xl font-bold mt-1 text-white flex items-center gap-2">
                <span>{t.hifzProgressTitle}</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h3>
            </div>

            <div className="text-right sm:text-left bg-emerald-900/80 px-4 py-2 rounded-xl border border-emerald-800">
              <div className="text-xs text-emerald-200">حفظ مکمل پارے</div>
              <div className="text-2xl font-bold text-amber-400 font-mono">
                {totalJuz} / 30 <span className="text-xs text-white">({progressPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-emerald-950/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-emerald-800">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 30 Juz Interactive Grid */}
          <div>
            <div className="text-xs text-emerald-200 mb-2 font-bold">قرآنِ مجید کے ۳۰ پاروں کا تفصیلی جائزہ:</div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(juzNum => {
                const isCompleted = juzNum <= totalJuz;
                const isCurrent = juzNum === totalJuz + 1;
                return (
                  <div
                    key={juzNum}
                    className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                      isCompleted 
                        ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-xs' 
                        : isCurrent 
                        ? 'bg-emerald-700 text-white border-amber-400 ring-2 ring-amber-400/50 animate-pulse'
                        : 'bg-emerald-900/50 text-emerald-300/60 border-emerald-800/80'
                    }`}
                  >
                    <div className="text-[10px] opacity-75">پارہ</div>
                    <div className="text-sm font-mono">{juzNum}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Today's / Latest Assessment Details */}
      {latestRecord && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sabaq Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>سبق (نیا سبق)</span>
              </span>
              {getQualityBadge(latestRecord.sabaq.rating)}
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-stone-500">سورت مبارکہ: <strong className="text-stone-900">{latestRecord.sabaq.surah}</strong></div>
              <div className="text-stone-500">آیات کا دائرہ: <strong className="text-stone-900 font-mono">{latestRecord.sabaq.ayaFrom} تا {latestRecord.sabaq.ayaTo}</strong></div>
              <div className="text-stone-500">پارہ نمبر: <strong className="text-emerald-800 font-mono">{latestRecord.sabaq.juzNumber}</strong></div>
            </div>
          </div>

          {/* Sabqi Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Star className="w-4 h-4 text-teal-700" />
                <span>سبقی (حالیہ دہرائی)</span>
              </span>
              {getQualityBadge(latestRecord.sabqi.rating)}
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-stone-500">پارہ نمبر: <strong className="text-stone-900 font-mono">{latestRecord.sabqi.juzNumber}</strong></div>
              <div className="text-stone-500">حجم / صفحات: <strong className="text-stone-900">{latestRecord.sabqi.pagesOrQuarter}</strong></div>
            </div>
          </div>

          {/* Manzil Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>منزل (دور مکمل)</span>
              </span>
              {getQualityBadge(latestRecord.manzil.rating)}
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-stone-500">پارہ نمبر: <strong className="text-stone-900 font-mono">{latestRecord.manzil.juzNumber}</strong></div>
              <div className="text-stone-500">دہرائی کی مقدار: <strong className="text-stone-900">{latestRecord.manzil.quarterOrHalf}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Hifz History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-base text-stone-900">سابقہ جائزہ ریکارڈ</h3>
          <span className="text-xs text-stone-500 font-mono">کل ریکارڈز: {studentRecords.length}</span>
        </div>

        {studentRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">ابھی تک اس طالب علم کا کوئی جائزہ لاگ موجود نہیں ہے</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-stone-100/80 text-stone-700 text-xs font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">تاریخ</th>
                  <th className="py-3 px-4">سبق (نیا سبق)</th>
                  <th className="py-3 px-4">سبقی (حالیہ)</th>
                  <th className="py-3 px-4">منزل (دور)</th>
                  <th className="py-3 px-4">نگران استاذ</th>
                  <th className="py-3 px-4">استاذ کی رائے / ریمارکس</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {studentRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-emerald-50/30">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{rec.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{rec.sabaq.surah} ({rec.sabaq.ayaFrom} - {rec.sabaq.ayaTo})</div>
                      <div className="mt-0.5">{getQualityBadge(rec.sabaq.rating)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>پارہ {rec.sabqi.juzNumber} ({rec.sabqi.pagesOrQuarter})</div>
                      <div className="mt-0.5">{getQualityBadge(rec.sabqi.rating)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>پارہ {rec.manzil.juzNumber} ({rec.manzil.quarterOrHalf})</div>
                      <div className="mt-0.5">{getQualityBadge(rec.manzil.rating)}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">{rec.teacherName}</td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs">{rec.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Daily Hifz Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">روزانہ سبق، سبقی اور منزل کا اندراج</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHifz} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">طالب علم منتخب کریں *</label>
                  <select
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-700"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">تاریخ جائزہ *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Sabaq Block */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                <span className="font-bold text-emerald-950 text-xs block">۱. سبق (نیا سبق):</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="block text-stone-600 mb-0.5">سورت کا نام:</label>
                    <input
                      type="text"
                      value={formData.sabaq.surah}
                      onChange={e => setFormData({ ...formData, sabaq: { ...formData.sabaq, surah: e.target.value } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">آیت از:</label>
                    <input
                      type="number"
                      value={formData.sabaq.ayaFrom}
                      onChange={e => setFormData({ ...formData, sabaq: { ...formData.sabaq, ayaFrom: Number(e.target.value) } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">آیت تا:</label>
                    <input
                      type="number"
                      value={formData.sabaq.ayaTo}
                      onChange={e => setFormData({ ...formData, sabaq: { ...formData.sabaq, ayaTo: Number(e.target.value) } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">معیار / ریٹنگ:</label>
                    <select
                      value={formData.sabaq.rating}
                      onChange={e => setFormData({ ...formData, sabaq: { ...formData.sabaq, rating: e.target.value as HifzQuality } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md"
                    >
                      <option value="Mumtaz">ممتاز</option>
                      <option value="Jayyid Jiddan">جید جداً</option>
                      <option value="Jayyid">جید</option>
                      <option value="Maqbool">مقبول</option>
                      <option value="Daif">ضعیف</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sabqi Block */}
              <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3">
                <span className="font-bold text-teal-950 text-xs block">۲. سبقی (حالیہ دہرائی):</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-stone-600 mb-0.5">پارہ نمبر:</label>
                    <input
                      type="number"
                      value={formData.sabqi.juzNumber}
                      onChange={e => setFormData({ ...formData, sabqi: { ...formData.sabqi, juzNumber: Number(e.target.value) } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">صفحات / مقدار:</label>
                    <input
                      type="text"
                      value={formData.sabqi.pagesOrQuarter}
                      onChange={e => setFormData({ ...formData, sabqi: { ...formData.sabqi, pagesOrQuarter: e.target.value } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">معیار:</label>
                    <select
                      value={formData.sabqi.rating}
                      onChange={e => setFormData({ ...formData, sabqi: { ...formData.sabqi, rating: e.target.value as HifzQuality } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md"
                    >
                      <option value="Mumtaz">ممتاز</option>
                      <option value="Jayyid Jiddan">جید جداً</option>
                      <option value="Jayyid">جید</option>
                      <option value="Maqbool">مقبول</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Manzil Block */}
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                <span className="font-bold text-amber-950 text-xs block">۳. منزل (دور):</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-stone-600 mb-0.5">پارہ نمبر:</label>
                    <input
                      type="number"
                      value={formData.manzil.juzNumber}
                      onChange={e => setFormData({ ...formData, manzil: { ...formData.manzil, juzNumber: Number(e.target.value) } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">مقدار:</label>
                    <input
                      type="text"
                      value={formData.manzil.quarterOrHalf}
                      onChange={e => setFormData({ ...formData, manzil: { ...formData.manzil, quarterOrHalf: e.target.value } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-0.5">معیار:</label>
                    <select
                      value={formData.manzil.rating}
                      onChange={e => setFormData({ ...formData, manzil: { ...formData.manzil, rating: e.target.value as HifzQuality } })}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-md"
                    >
                      <option value="Mumtaz">ممتاز</option>
                      <option value="Jayyid Jiddan">جید جداً</option>
                      <option value="Jayyid">جید</option>
                      <option value="Maqbool">مقبول</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">کل مکمل شدہ پارے (0 تا 30)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.totalJuzMemorized}
                  onChange={e => setFormData({ ...formData, totalJuzMemorized: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">استاذ کے ریمارکس / ہدایات</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-bold"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm"
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
