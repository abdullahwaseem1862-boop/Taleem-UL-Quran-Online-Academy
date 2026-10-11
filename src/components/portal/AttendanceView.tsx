import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { Student, MadrasaClass, AttendanceRecord, AttendanceStatus } from '../../types';
import { 
  CalendarCheck, Calendar, CheckCircle, XCircle, Clock, 
  AlertCircle, Save, Check, Filter, Users 
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { t, currentUser, notify } = useApp();
  const [classes, setClasses] = useState<MadrasaClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  useEffect(() => {
    Promise.all([api.getClasses(), api.getStudents()])
      .then(([cls, stds]) => {
        setClasses(cls);
        setStudents(stds);
        if (cls.length > 0) setSelectedClassId(cls[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fetch attendance records when class or date changes
  useEffect(() => {
    if (!selectedClassId || !date) return;
    api.getAttendance(date, selectedClassId)
      .then(records => {
        const classStudents = students.filter(s => s.classId === selectedClassId && s.status === 'Active');
        const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};

        classStudents.forEach(s => {
          const rec = records.find(r => r.studentId === s.id);
          map[s.id] = {
            status: rec ? rec.status : 'Present',
            remarks: rec?.remarks || ''
          };
        });

        setAttendanceMap(map);
      })
      .catch(console.error);
  }, [selectedClassId, date, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (!canEdit) return;
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    if (!canEdit) return;
    const updated = { ...attendanceMap };
    Object.keys(updated).forEach(id => {
      updated[id] = { ...updated[id], status };
    });
    setAttendanceMap(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const recordsToSave = Object.entries(attendanceMap).map(([studentId, item]) => ({
        studentId,
        classId: selectedClassId,
        status: item.status,
        remarks: item.remarks
      }));

      await api.saveBulkAttendance(date, recordsToSave);
      notify('حاضری کامیابی سے محفوظ کر لی گئی ہے!');
    } catch (err: any) {
      notify(err.message || 'حاضری محفوظ کرنے میں خامی ہوئی', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentClassStudents = students.filter(s => s.classId === selectedClassId && s.status === 'Active');

  // Stats calculation
  const totalCount = currentClassStudents.length;
  const presentCount = Object.values(attendanceMap).filter(a => a.status === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter(a => a.status === 'Absent').length;
  const leaveCount = Object.values(attendanceMap).filter(a => a.status === 'Leave').length;
  const lateCount = Object.values(attendanceMap).filter(a => a.status === 'Late').length;
  const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-800" />
            <span>روزانہ حاضری و غیر حاضری رجسٹر</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            کلاس اور تاریخ منتخب کر کے طلبہ کی حاضری درج کریں اور محفوظ فرمائیں
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            disabled={saving || currentClassStudents.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? 'محفوظ ہو رہا ہے...' : 'حاضری محفوظ کریں'}</span>
          </button>
        )}
      </div>

      {/* Class and Date Selector Controls */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">تاریخ منتخب کریں:</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">حلقہ / کلاس:</label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-700"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.department})</option>
              ))}
            </select>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-bold">فوری انتخاب:</span>
            <button
              onClick={() => markAll('Present')}
              className="px-3 py-1.5 bg-green-50 text-green-800 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors cursor-pointer"
            >
              سب حاضر
            </button>
            <button
              onClick={() => markAll('Absent')}
              className="px-3 py-1.5 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
            >
              سب غیر حاضر
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500">کل طلبہ</div>
          <div className="text-xl font-bold text-stone-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-xl border border-green-200 shadow-xs">
          <div className="text-xs text-green-700 font-bold">حاضر (Present)</div>
          <div className="text-xl font-bold text-green-900 mt-1">{presentCount}</div>
        </div>
        <div className="bg-red-50 p-3 rounded-xl border border-red-200 shadow-xs">
          <div className="text-xs text-red-700 font-bold">غیر حاضر (Absent)</div>
          <div className="text-xl font-bold text-red-900 mt-1">{absentCount}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-xs">
          <div className="text-xs text-blue-700 font-bold">رخصت (Leave)</div>
          <div className="text-xl font-bold text-blue-900 mt-1">{leaveCount}</div>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-xs">
          <div className="text-xs text-amber-700 font-bold">حاضری شرح</div>
          <div className="text-xl font-bold text-amber-900 mt-1">{rate}%</div>
        </div>
      </div>

      {/* Students Attendance Register */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm">حاضری ریکارڈ لوڈ ہو رہا ہے...</div>
        ) : currentClassStudents.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">اس کلاس میں کوئی فعال طالب علم موجود نہیں</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-stone-100/80 text-stone-700 text-xs font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">رول نمبر</th>
                  <th className="py-3.5 px-4">طالب علم کا نام</th>
                  <th className="py-3.5 px-4">سرپرست کا نام</th>
                  <th className="py-3.5 px-4 text-center">حاضری کیفیت (Status)</th>
                  <th className="py-3.5 px-4">وجہ / ریمارکس</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {currentClassStudents.map(std => {
                  const record = attendanceMap[std.id] || { status: 'Present', remarks: '' };
                  return (
                    <tr key={std.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-900">{std.rollNo}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">{std.name}</td>
                      <td className="py-3 px-4 text-stone-600 text-xs">{std.guardianName}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {(['Present', 'Absent', 'Leave', 'Late'] as AttendanceStatus[]).map(st => (
                            <button
                              key={st}
                              disabled={!canEdit}
                              onClick={() => handleStatusChange(std.id, st)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                record.status === st
                                  ? st === 'Present'
                                    ? 'bg-emerald-800 text-white shadow-xs'
                                    : st === 'Absent'
                                    ? 'bg-red-700 text-white shadow-xs'
                                    : st === 'Leave'
                                    ? 'bg-blue-700 text-white shadow-xs'
                                    : 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              {st === 'Present' ? 'حاضر' : st === 'Absent' ? 'غیر حاضر' : st === 'Leave' ? 'رخصت' : 'تاخیر'}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          disabled={!canEdit}
                          placeholder="اگر کوئی وجہ ہو تو لکھیں..."
                          value={record.remarks}
                          onChange={e => {
                            const val = e.target.value;
                            setAttendanceMap(prev => ({
                              ...prev,
                              [std.id]: {
                                ...prev[std.id],
                                remarks: val
                              }
                            }));
                          }}
                          className="w-full px-2.5 py-1 text-xs border border-stone-200 rounded-md focus:ring-1 focus:ring-emerald-700 bg-stone-50"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
