import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { Student, Department, StudentStatus } from '../../types';
import { 
  Users, Search, Plus, Filter, Edit, Trash2, Eye, 
  Phone, MapPin, User, CheckCircle2, X, Download, ShieldCheck 
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { t, currentUser, notify } = useApp();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  
  // Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'والد',
    cnic: '',
    dob: '2014-01-01',
    gender: 'Male' as 'Male' | 'Female',
    bloodGroup: 'B+',
    address: '',
    department: 'Hifz' as Department,
    classId: 'cls_hifz_1',
    rollNo: '',
    monthlyFee: 2500,
    scholarshipDiscount: 0,
    status: 'Active' as StudentStatus,
    notes: ''
  });

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'accountant';

  const loadStudents = () => {
    setLoading(true);
    api.getStudents()
      .then(setStudents)
      .catch(err => notify(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent.id, formData);
        notify('طالب علم کی معلومات کامیابی سے تبدیل ہو گئیں');
      } else {
        await api.createStudent(formData);
        notify('نیا طالب علم کامیابی سے درج ہو گیا');
      }
      setIsAddModalOpen(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err: any) {
      notify(err.message || 'خامی پیش آ گئی', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`کیا آپ واقعی طالب علم "${name}" کا ریکارڈ خارج کرنا چاہتے ہیں؟`)) {
      return;
    }
    try {
      await api.deleteStudent(id);
      notify('طالب علم کا ریکارڈ حذف ہو گیا');
      loadStudents();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const openEdit = (std: Student) => {
    setEditingStudent(std);
    setFormData({
      name: std.name,
      guardianName: std.guardianName,
      guardianPhone: std.guardianPhone,
      guardianRelation: std.guardianRelation,
      cnic: std.cnic,
      dob: std.dob,
      gender: std.gender,
      bloodGroup: std.bloodGroup,
      address: std.address,
      department: std.department,
      classId: std.classId,
      rollNo: std.rollNo,
      monthlyFee: std.monthlyFee,
      scholarshipDiscount: std.scholarshipDiscount,
      status: std.status,
      notes: std.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>طلبہ کا ریکارڈ و ڈائریکٹری</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            جامعہ تعلیم القرآن کیمپس کے تمام رجسٹرڈ طلبہ، پروفائلز اور سرپرستوں کا تفصیلی ریکارڈ
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setEditingStudent(null);
              setFormData({
                name: '',
                guardianName: '',
                guardianPhone: '',
                guardianRelation: 'والد',
                cnic: '',
                dob: '2014-01-01',
                gender: 'Male',
                bloodGroup: 'B+',
                address: '',
                department: 'Hifz',
                classId: 'cls_hifz_1',
                rollNo: '',
                monthlyFee: 2500,
                scholarshipDiscount: 0,
                status: 'Active',
                notes: ''
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>نیا طالب علم شامل کریں</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="نام، رول نمبر، رجسٹریشن نمبر یا والد کے نام سے تلاش کریں..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-bold">شعبہ:</span>
          {(['All', 'Hifz', 'Nazra', 'Tajweed', 'Dars-e-Nizami'] as const).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                selectedDept === d 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {d === 'All' ? 'تمام شعبہ جات' : d === 'Hifz' ? 'حفظ' : d === 'Nazra' ? 'ناظرہ' : d === 'Tajweed' ? 'تجوید' : 'درس نظامی'}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm">طلبہ کا ریکارڈ لوڈ ہو رہا ہے...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">کوئی طالب علم موجود نہیں ملا</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-stone-100/80 text-stone-700 text-xs font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">رول نمبر</th>
                  <th className="py-3.5 px-4">طالب علم کا نام</th>
                  <th className="py-3.5 px-4">شعبہ</th>
                  <th className="py-3.5 px-4">والد / سرپرست</th>
                  <th className="py-3.5 px-4">رابطہ نمبر</th>
                  <th className="py-3.5 px-4">ماہانہ فیس</th>
                  <th className="py-3.5 px-4">حالت</th>
                  <th className="py-3.5 px-4 text-center">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStudents.map(std => (
                  <tr key={std.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">{std.rollNo}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{std.name}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{std.regNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {std.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">{std.guardianName} ({std.guardianRelation})</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-stone-600" dir="ltr">{std.guardianPhone}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      PKR {std.monthlyFee - std.scholarshipDiscount}
                      {std.scholarshipDiscount > 0 && (
                        <span className="text-[10px] text-emerald-600 block">رعایت: {std.scholarshipDiscount}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        std.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {std.status === 'Active' ? 'فعال' : std.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedStudent(std)}
                          title="پروفائل دیکھیں"
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => openEdit(std)}
                              title="ترمیم"
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(std.id, std.name)}
                              title="حذف"
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                <span className="text-xs text-amber-300 font-mono">رول نمبر: {selectedStudent.rollNo} | {selectedStudent.regNo}</span>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block">شعبہ تعلیم:</span>
                  <strong className="text-stone-900 text-sm">{selectedStudent.department}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">تاریخ داخلہ:</span>
                  <strong className="text-stone-900">{selectedStudent.admissionDate}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">جنس و بلڈ گروپ:</span>
                  <strong className="text-stone-900">{selectedStudent.gender} ({selectedStudent.bloodGroup})</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">تاریخ پیدائش:</span>
                  <strong className="text-stone-900 font-mono">{selectedStudent.dob}</strong>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">والد / سرپرست:</span>
                  <span className="font-bold text-stone-800">{selectedStudent.guardianName} ({selectedStudent.guardianRelation})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">رابطہ نمبر:</span>
                  <span className="font-mono text-stone-800" dir="ltr">{selectedStudent.guardianPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">شناختی کارڈ (CNIC):</span>
                  <span className="font-mono text-stone-800">{selectedStudent.cnic || 'دستیاب نہیں'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">رہائشی پتہ:</span>
                  <span className="text-stone-800 text-right">{selectedStudent.address}</span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3 flex justify-between bg-emerald-50/50 p-3 rounded-lg text-xs">
                <div>
                  <span className="text-stone-500 block">ماہانہ فیس:</span>
                  <strong className="text-stone-900 font-mono">PKR {selectedStudent.monthlyFee}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">رعایت / وظیفہ:</span>
                  <strong className="text-emerald-700 font-mono">PKR {selectedStudent.scholarshipDiscount}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">خالص فیس:</span>
                  <strong className="text-stone-900 font-mono font-bold">PKR {selectedStudent.monthlyFee - selectedStudent.scholarshipDiscount}</strong>
                </div>
              </div>

              {selectedStudent.notes && (
                <div className="text-xs bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-bold block mb-0.5">اساتذہ کے نوٹس:</span>
                  {selectedStudent.notes}
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-100 text-left border-t border-stone-200">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                بند کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingStudent ? 'طالب علم کی معلومات میں ترمیم' : 'نیا طالب علم داخل کریں'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">طالب علم کا نام *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رول نمبر</label>
                  <input
                    type="text"
                    placeholder="خودکار یا مخصوص رول نمبر"
                    value={formData.rollNo}
                    onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">والد / سرپرست کا نام *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">سرپرست کا رابطہ نمبر *</label>
                  <input
                    type="tel"
                    required
                    value={formData.guardianPhone}
                    onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">شعبہ *</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Hifz">شعبہ حفظ القرآن</option>
                    <option value="Nazra">شعبہ ناظرہ و تجوید</option>
                    <option value="Tajweed">شعبہ تجوید و قراءات</option>
                    <option value="Dars-e-Nizami">شعبہ درسِ نظامی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">تاریخ پیدائش</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ماہانہ فیس (PKR)</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رعایت / وظیفہ (PKR)</label>
                  <input
                    type="number"
                    value={formData.scholarshipDiscount}
                    onChange={e => setFormData({ ...formData, scholarshipDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رہائشی پتہ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-bold hover:bg-stone-50"
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
