import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { Exam, ExamResult, Student, MadrasaClass } from '../../types';
import { 
  Award, Plus, Printer, CheckCircle2, Star, 
  FileText, Search, X, Calendar, BookOpen 
} from 'lucide-react';

export const ExaminationsView: React.FC = () => {
  const { t, currentUser, notify } = useApp();
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<MadrasaClass[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedResultForPrint, setSelectedResultForPrint] = useState<ExamResult | null>(null);
  const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);

  // New Result Form
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [position, setPosition] = useState('پہلی پوزیشن (1st)');
  const [teacherRemarks, setTeacherRemarks] = useState('ماشاء اللہ بہترین محنت اور اعلیٰ اخلاق');
  const [subjects, setSubjects] = useState([
    { subjectName: 'حفظ قرآن و حسنِ تلاوت', totalMarks: 100, obtainedMarks: 95 },
    { subjectName: 'تجوید و مخارج الحروف', totalMarks: 50, obtainedMarks: 48 },
    { subjectName: 'بنیادی دینیات و مسنون دعائیں', totalMarks: 50, obtainedMarks: 46 }
  ]);

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getExams(),
      api.getExamResults(),
      api.getStudents(),
      api.getClasses()
    ])
      .then(([exs, res, stds, cls]) => {
        setExams(exs);
        setResults(res);
        setStudents(stds);
        setClasses(cls);
        if (exs.length > 0) setSelectedExamId(exs[0].id);
        if (stds.length > 0) setSelectedStudentId(stds[0].id);
        if (cls.length > 0) setSelectedClassId(cls[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubjectChange = (index: number, field: string, val: any) => {
    const updated = [...subjects];
    (updated[index] as any)[field] = val;
    setSubjects(updated);
  };

  const addSubjectRow = () => {
    setSubjects([...subjects, { subjectName: '', totalMarks: 100, obtainedMarks: 80 }]);
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveExamResult({
        examId: selectedExamId,
        studentId: selectedStudentId,
        classId: selectedClassId,
        subjects,
        position,
        teacherRemarks
      });
      notify('امتحانی نتیجہ اور رپورٹ کارڈ کامیابی سے محفوظ ہو گیا');
      setIsAddResultModalOpen(false);
      loadData();
    } catch (err: any) {
      notify(err.message || 'نتیجہ محفوظ کرنے میں خامی ہوئی', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-800" />
            <span>امتحانات و تعلیمی رپورٹ کارڈز (Results & Report Cards)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            ششماہی، سالانہ اور ماہانہ امتحانات کے نمبرات، پوزیشنز اور پرنٹ ایبل کارکردگی سرٹیفکیٹس
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddResultModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>نیا امتحانی نتیجہ درج کریں</span>
          </button>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm">نتائج لوڈ ہو رہے ہیں...</div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">کوئی امتحانی نتیجہ موجود نہیں ہے</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-stone-100/80 text-stone-700 text-xs font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">امتحان کا عنوان</th>
                  <th className="py-3.5 px-4">طالب علم</th>
                  <th className="py-3.5 px-4">کلاس</th>
                  <th className="py-3.5 px-4">کل نمبرات</th>
                  <th className="py-3.5 px-4">حاصل کردہ</th>
                  <th className="py-3.5 px-4">فیصد شرح</th>
                  <th className="py-3.5 px-4">گریڈ / درجہ</th>
                  <th className="py-3.5 px-4">پوزیشن</th>
                  <th className="py-3.5 px-4 text-center">رپورٹ کارڈ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {results.map(res => (
                  <tr key={res.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-emerald-950 text-xs">{res.examTitle}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{res.studentName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">رول: {res.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-700">{res.className}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-600">{res.totalMarks}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{res.obtainedMarks}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{res.percentage}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {res.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-emerald-900">{res.position || '-'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedResultForPrint(res)}
                        className="px-3 py-1 bg-stone-100 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>رپورٹ کارڈ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Report Card Modal */}
      {selectedResultForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border-2 border-emerald-800 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 no-print">
              <span className="font-bold text-sm text-stone-800">طالب علم کا آفیشل رپورٹ کارڈ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>پرنٹ کریں (Print Report Card)</span>
                </button>
                <button
                  onClick={() => setSelectedResultForPrint(null)}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Certificate Container */}
            <div className="p-6 border-4 border-double border-amber-600/60 rounded-xl bg-amber-50/15 space-y-5 print-card mt-3">
              {/* Certificate Header */}
              <div className="text-center space-y-1">
                <div className="font-quran text-amber-700 text-base">﷽</div>
                <h3 className="text-2xl font-bold text-emerald-950 font-nastaliq">جامعہ تعلیم القرآن کیمپس</h3>
                <div className="text-xs text-stone-600">ادارہ علوم اسلامیہ و شعبہ تحفیظ القرآن الکریم - لاہور</div>
                <div className="inline-block mt-2 px-4 py-1 rounded-full bg-emerald-900 text-amber-300 font-bold text-xs">
                  کارکردگی رپورٹ کارڈ / تعلیمی سند ({selectedResultForPrint.examTitle})
                </div>
              </div>

              {/* Student Details Banner */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-stone-200">
                <div>طالب علم کا نام: <strong className="text-stone-900 text-sm">{selectedResultForPrint.studentName}</strong></div>
                <div>رول نمبر: <strong className="text-stone-900 font-mono">{selectedResultForPrint.rollNo}</strong></div>
                <div>کلاس / حلقہ: <strong className="text-stone-900">{selectedResultForPrint.className}</strong></div>
                <div>پوزیشن: <strong className="text-emerald-800">{selectedResultForPrint.position || 'کامیاب'}</strong></div>
              </div>

              {/* Subjects Marks Table */}
              <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-right text-xs">
                  <thead className="bg-emerald-950 text-white">
                    <tr>
                      <th className="p-2.5">شمار</th>
                      <th className="p-2.5">مضمون / کتاب</th>
                      <th className="p-2.5">کل نمبر</th>
                      <th className="p-2.5">حاصل کردہ</th>
                      <th className="p-2.5 text-center">کیفیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {selectedResultForPrint.subjects.map((sub, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono">{idx + 1}</td>
                        <td className="p-2 font-bold text-stone-800">{sub.subjectName}</td>
                        <td className="p-2 font-mono">{sub.totalMarks}</td>
                        <td className="p-2 font-mono font-bold text-emerald-950">{sub.obtainedMarks}</td>
                        <td className="p-2 text-center text-[10px] text-green-700 font-bold">
                          {Math.round((sub.obtainedMarks / sub.totalMarks) * 100)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-stone-100 font-bold text-stone-900">
                      <td colSpan={2} className="p-2.5">میزان (Total Marks):</td>
                      <td className="p-2.5 font-mono">{selectedResultForPrint.totalMarks}</td>
                      <td className="p-2.5 font-mono text-emerald-900">{selectedResultForPrint.obtainedMarks}</td>
                      <td className="p-2.5 text-center font-mono">{selectedResultForPrint.percentage}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary & Grade */}
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                <div>
                  <span className="text-stone-600 block">مجموعی درجہ (Grade):</span>
                  <strong className="text-emerald-900 text-sm">{selectedResultForPrint.grade}</strong>
                </div>
                <div>
                  <span className="text-stone-600 block">کامیابی شرح:</span>
                  <strong className="text-stone-900 text-sm font-mono">{selectedResultForPrint.percentage}%</strong>
                </div>
                <div>
                  <span className="text-stone-600 block">کیفیت:</span>
                  <strong className="text-green-800 text-sm">پاس / کامیاب</strong>
                </div>
              </div>

              {/* Remarks */}
              <div className="text-xs bg-white p-3 rounded-lg border border-stone-200 text-stone-700">
                <span className="font-bold text-stone-900 block mb-0.5">استاذ محترم کے ریمارکس و تاثرات:</span>
                {selectedResultForPrint.teacherRemarks || 'ماشاء اللہ کارکردگی قابل تحسین ہے'}
              </div>

              {/* Signature Lines */}
              <div className="flex justify-between items-end pt-8 text-[11px] text-stone-600">
                <div className="text-center">
                  <div className="border-b border-stone-400 w-28 mb-1"></div>
                  <span>دستخط استادِ محترم</span>
                </div>
                <div className="text-center">
                  <div className="border-2 border-emerald-800 rounded-full w-14 h-14 flex items-center justify-center text-[9px] text-emerald-900 font-bold mx-auto mb-1">
                    مہر جامعہ
                  </div>
                  <span>تصدیق جامعہ</span>
                </div>
                <div className="text-center">
                  <div className="border-b border-stone-400 w-28 mb-1"></div>
                  <span>دستخط ناظمِ تعلیمات</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Result Modal */}
      {isAddResultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">امتحانی نتیجہ و نمبرات کا اندراج</h3>
              <button 
                onClick={() => setIsAddResultModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">امتحان *</label>
                  <select
                    value={selectedExamId}
                    onChange={e => setSelectedExamId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                  >
                    {exams.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">طالب علم *</label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">کلاس *</label>
                  <select
                    value={selectedClassId}
                    onChange={e => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subjects Table Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700">مضامین اور حاصل کردہ نمبرات:</label>
                  <button
                    type="button"
                    onClick={addSubjectRow}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    + نیا مضمون شامل کریں
                  </button>
                </div>

                <div className="space-y-2">
                  {subjects.map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="مضمون کا نام"
                        value={sub.subjectName}
                        onChange={e => handleSubjectChange(idx, 'subjectName', e.target.value)}
                        className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        placeholder="کل نمبر"
                        value={sub.totalMarks}
                        onChange={e => handleSubjectChange(idx, 'totalMarks', Number(e.target.value))}
                        className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-mono"
                      />
                      <input
                        type="number"
                        placeholder="حاصل کردہ"
                        value={sub.obtainedMarks}
                        onChange={e => handleSubjectChange(idx, 'obtainedMarks', Number(e.target.value))}
                        className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">پوزیشن</label>
                  <input
                    type="text"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">استاذ کی رائے / دعائیہ کلمات</label>
                  <input
                    type="text"
                    value={teacherRemarks}
                    onChange={e => setTeacherRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddResultModalOpen(false)}
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
