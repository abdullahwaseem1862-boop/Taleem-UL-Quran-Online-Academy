import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { MadrasaClass, Teacher, Department } from '../../types';
import { BookOpen, Plus, Users, Clock, MapPin, X } from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { currentUser, notify } = useApp();
  const [classes, setClasses] = useState<MadrasaClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    department: 'Hifz' as Department,
    teacherId: '',
    teacherName: '',
    room: 'کمرہ 101',
    capacity: 25,
    scheduleTime: 'صبح 7:00 تا شام 4:30'
  });

  const canEdit = currentUser?.role === 'admin';

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getClasses(), api.getTeachers()])
      .then(([cls, tchs]) => {
        setClasses(cls);
        setTeachers(tchs);
        if (tchs.length > 0) {
          setFormData(prev => ({
            ...prev,
            teacherId: tchs[0].id,
            teacherName: tchs[0].name
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedTch = teachers.find(t => t.id === formData.teacherId);
      await api.createClass({
        ...formData,
        teacherName: selectedTch?.name || formData.teacherName
      });
      notify('نئی کلاس / حلقہ کامیابی سے شامل ہو گیا');
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span>کلاسز، حلقہ جات و اوقاتِ تدریس</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            جامعہ کی تعلیمی کلاسز، کمرہ جات، نگران اساتذہ اور اوقات کار کی فہرست
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>نئی کلاس شامل کریں</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-700/50 transition-all space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-emerald-950">{cls.name}</h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold mt-1 inline-block">
                  {cls.department}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>نگران استاذ: <strong className="text-stone-900">{cls.teacherName || 'مقرر نہیں'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>کمرہ / ہال: <strong className="text-stone-900">{cls.room}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>اوقاتِ کار: <strong className="text-stone-900">{cls.scheduleTime}</strong></span>
              </div>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex justify-between text-xs">
              <span className="text-stone-500">گنجائش طلبہ:</span>
              <strong className="text-stone-800 font-mono">{cls.capacity} طلبہ</strong>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">نئی کلاس / حلقہ درج کریں</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">کلاس کا نام *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حلقہ حفظ ج (C)"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">شعبہ *</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="Hifz">شعبہ حفظ</option>
                  <option value="Nazra">شعبہ ناظرہ</option>
                  <option value="Tajweed">شعبہ تجوید</option>
                  <option value="Dars-e-Nizami">شعبہ درسِ نظامی</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نگران استاد *</label>
                <select
                  value={formData.teacherId}
                  onChange={e => {
                    const tId = e.target.value;
                    const tch = teachers.find(t => t.id === tId);
                    setFormData({ ...formData, teacherId: tId, teacherName: tch?.name || '' });
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">کمرہ / ہال</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">گنجائش طلبہ</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اوقات کار</label>
                <input
                  type="text"
                  value={formData.scheduleTime}
                  onChange={e => setFormData({ ...formData, scheduleTime: e.target.value })}
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
