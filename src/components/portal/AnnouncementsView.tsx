import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { Announcement } from '../../types';
import { Bell, Plus, Calendar, Tag, AlertCircle, X } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { currentUser, notify } = useApp();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    titleUrdu: '',
    titleEn: '',
    contentUrdu: '',
    category: 'General' as 'General' | 'Exam' | 'Holiday' | 'Urgent',
    targetRoles: ['student', 'parent', 'teacher']
  });

  const canEdit = currentUser?.role === 'admin';

  const loadData = () => {
    setLoading(true);
    api.getAnnouncements()
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAnnouncement(formData);
      notify('نیا اعلان / نوٹس کامیابی سے جاری کر دیا گیا');
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
            <Bell className="w-5 h-5 text-emerald-800" />
            <span>اعلانات، سرکلرز و نوٹس بورڈ</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            جامعہ کے عمومی اعلانات، امتحانی نوٹسز، تعطیلات اور اہم ہدایات
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>نیا اعلان جاری کریں</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm">اعلانات لوڈ ہو رہے ہیں...</div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">کوئی نیا اعلان موجود نہیں ہے</div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-emerald-950">{ann.titleUrdu}</h3>
                  {ann.titleEn && <div className="text-xs text-stone-500 font-sans">{ann.titleEn}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    ann.category === 'Exam' 
                      ? 'bg-purple-100 text-purple-800' 
                      : ann.category === 'Holiday' 
                      ? 'bg-blue-100 text-blue-800' 
                      : ann.category === 'Urgent' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ann.date}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed">
                {ann.contentUrdu}
              </p>
              {ann.contentEn && (
                <p className="text-xs text-stone-500 font-sans leading-relaxed border-t border-stone-100 pt-2">
                  {ann.contentEn}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">نیا نوٹس جاری کریں</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان (اردو) *</label>
                <input
                  type="text"
                  required
                  value={formData.titleUrdu}
                  onChange={e => setFormData({ ...formData, titleUrdu: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان (انگریزی - اختیاری)</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">قسم نوٹس</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="General">عمومی نوٹس (General)</option>
                  <option value="Exam">امتحانی اعلان (Exam)</option>
                  <option value="Holiday">تعطیلات (Holiday)</option>
                  <option value="Urgent">فوری / ہنگامی (Urgent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تفصیلات اعلان *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.contentUrdu}
                  onChange={e => setFormData({ ...formData, contentUrdu: e.target.value })}
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
                  شائع کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
