import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { AdmissionApplication, MadrasaClass } from '../../types';
import { 
  FileText, CheckCircle2, XCircle, Clock, Check, 
  X, Phone, MapPin, Calendar, BookOpen, AlertCircle 
} from 'lucide-react';

export const AdmissionsView: React.FC = () => {
  const { t, currentUser, notify } = useApp();
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [classes, setClasses] = useState<MadrasaClass[]>([]);
  const [loading, setLoading] = useState(true);

  // Approve Modal
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [assignedClassId, setAssignedClassId] = useState('');
  const [assignedRollNo, setAssignedRollNo] = useState('');

  const canManage = currentUser?.role === 'admin';

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getAdmissions(), api.getClasses()])
      .then(([adms, cls]) => {
        setAdmissions(adms);
        setClasses(cls);
        if (cls.length > 0) setAssignedClassId(cls[0].id);
      })
      .catch(err => notify(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async () => {
    if (!selectedApp) return;
    try {
      await api.updateAdmissionStatus(
        selectedApp.id, 
        'Approved', 
        assignedClassId, 
        assignedRollNo || `R-${Math.floor(100 + Math.random() * 899)}`
      );
      notify(`درخواست منظور ہو گئی اور ${selectedApp.applicantName} کو طلبہ میں شامل کر دیا گیا`);
      setSelectedApp(null);
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (!window.confirm(`کیا آپ واقعی ${name} کی درخواست مسترد کرنا چاہتے ہیں؟`)) return;
    try {
      await api.updateAdmissionStatus(id, 'Rejected');
      notify('درخواست مسترد کر دی گئی');
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
            <FileText className="w-5 h-5 text-emerald-800" />
            <span>آن لائن داخلہ درخواستوں کی جانچ و منظوری</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            ویب سائٹ سے موصول ہونے والی نئے طلبہ کی درخواستیں، انٹرویو اسٹیٹس اور کلاس میں شمولیت
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold">
            زیر التوا: {admissions.filter(a => a.status === 'Pending').length}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-800 border border-green-200 font-bold">
            منظور شدہ: {admissions.filter(a => a.status === 'Approved').length}
          </span>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm">درخواستیں لوڈ ہو رہی ہیں...</div>
        ) : admissions.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">کوئی داخلہ درخواست موجود نہیں</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-stone-100/80 text-stone-700 text-xs font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">امیدوار کا نام</th>
                  <th className="py-3.5 px-4">مطلوبہ شعبہ</th>
                  <th className="py-3.5 px-4">والد / سرپرست</th>
                  <th className="py-3.5 px-4">رابطہ نمبر</th>
                  <th className="py-3.5 px-4">تاریخ درخواست</th>
                  <th className="py-3.5 px-4">حالت</th>
                  <th className="py-3.5 px-4 text-center">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {admissions.map(app => (
                  <tr key={app.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{app.applicantName}</div>
                      <div className="text-[11px] text-stone-500">تاریخ پیدائش: {app.dob}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {app.appliedDepartment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-800">{app.guardianName}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-stone-600" dir="ltr">{app.guardianPhone}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-stone-500">{app.submissionDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        app.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : app.status === 'Rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : app.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{app.status === 'Approved' ? 'منظور' : app.status === 'Rejected' ? 'مسترد' : 'زیر التوا'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {canManage && app.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setAssignedRollNo(`R-${Math.floor(100 + Math.random() * 899)}`);
                            }}
                            className="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            منظور کریں
                          </button>
                          <button
                            onClick={() => handleReject(app.id, app.applicantName)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                          >
                            مسترد
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">مکمل شدہ</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">داخلہ منظوری و کلاس تفویض</h3>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div>طالب علم: <strong className="text-stone-900">{selectedApp.applicantName}</strong></div>
                <div>والد کا نام: <strong className="text-stone-900">{selectedApp.guardianName}</strong></div>
                <div>مطلوبہ شعبہ: <strong className="text-emerald-800">{selectedApp.appliedDepartment}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">کلاس منتخب کریں *</label>
                <select
                  value={assignedClassId}
                  onChange={e => setAssignedClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 text-sm bg-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تفویض کردہ رول نمبر *</label>
                <input
                  type="text"
                  required
                  value={assignedRollNo}
                  onChange={e => setAssignedRollNo(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 text-sm font-mono"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-xs">
                منظوری کے بعد یہ طالب علم خود بخود کیمپس کے فعال طلبہ کے رجسٹر میں درج ہو جائے گا۔
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  منسوخ
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-6 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm cursor-pointer"
                >
                  منظور کریں اور درج کریں
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
