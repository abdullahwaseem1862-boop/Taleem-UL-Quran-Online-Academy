import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { Teacher } from '../../types';
import { GraduationCap, Plus, Phone, Mail, Award, DollarSign, Calendar, X } from 'lucide-react';

export const TeachersView: React.FC = () => {
  const { currentUser, notify } = useApp();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    designation: 'استاذ شعبہ حفظ',
    qualification: 'شہادۃ العالمیہ، قاری سبعہ و عشرہ',
    phone: '',
    email: '',
    salary: 40000,
    specializations: ['تجوید و حفظ']
  });

  const canEdit = currentUser?.role === 'admin';

  const loadData = () => {
    setLoading(true);
    api.getTeachers()
      .then(setTeachers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTeacher(formData);
      notify('استاذ محترم کا ریکارڈ کامیابی سے شامل ہو گیا');
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
            <GraduationCap className="w-5 h-5 text-emerald-800" />
            <span>اساتذہ کرام و عملہ کی ڈائریکٹری</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            جامعہ کے اساتذہ، تدریسی شعبہ جات، اسناد، رابطے اور مشاہرہ
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>نئے استاد کا اندراج کریں</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.map(tch => (
          <div key={tch.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-700/50 transition-all space-y-4">
            <div>
              <h3 className="font-bold text-base text-emerald-950">{tch.name}</h3>
              <div className="text-xs text-amber-700 font-bold mt-0.5">{tch.designation}</div>
            </div>

            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>تعلیمی قابلیت: <strong className="text-stone-900">{tch.qualification}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span dir="ltr" className="font-mono text-stone-800">{tch.phone}</span>
              </div>
              {tch.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-sans text-stone-700">{tch.email}</span>
                </div>
              )}
            </div>

            {canEdit && (
              <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 flex justify-between text-xs">
                <span className="text-stone-600">ماہانہ مشاہرہ (تنخواہ):</span>
                <strong className="text-emerald-900 font-mono font-bold">PKR {tch.salary.toLocaleString()}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">نئے استاد کا اندراج</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">استاذ محترم کا نام *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قاری احمد بلال"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عہدہ / شعبہ *</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تعلیمی اسناد و قابلیت</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">موبائل نمبر *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">مشاہرہ (PKR)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
                  />
                </div>
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
