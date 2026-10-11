import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { FeeVoucher, FeeStatus } from '../../types';
import { 
  Calculator, Plus, Printer, CheckCircle2, AlertCircle, 
  Search, Filter, DollarSign, X, Check, Calendar, User, FileText 
} from 'lucide-react';

export const FeesView: React.FC = () => {
  const { t, currentUser, notify } = useApp();
  const [vouchers, setVouchers] = useState<FeeVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [selectedVoucherForPayment, setSelectedVoucherForPayment] = useState<FeeVoucher | null>(null);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<FeeVoucher | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Payment Form
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Bank' | 'EasyPaisa/JazzCash'>('Cash');
  const [receiverName, setReceiverName] = useState<string>(currentUser?.name || 'حافظ طارق محمود');

  // Batch Generation Form
  const [genMonth, setGenMonth] = useState('نومبر 2026');
  const [genDueDate, setGenDueDate] = useState('2026-11-15');

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'accountant';

  const loadFees = () => {
    setLoading(true);
    api.getFees()
      .then(setVouchers)
      .catch(err => notify(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucherForPayment) return;
    try {
      const updated = await api.payFee(
        selectedVoucherForPayment.id,
        payAmount,
        payMethod,
        receiverName
      );
      notify(`فیس کی وصولی درج کر لی گئی! رسید نمبر: ${updated.receiptNumber}`);
      setSelectedVoucherForPayment(null);
      loadFees();
    } catch (err: any) {
      notify(err.message || 'ادائیگی درج کرنے میں خامی ہوئی', 'error');
    }
  };

  const handleGenerateMonthly = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.generateMonthlyFees(genMonth, genDueDate);
      notify(`ماہ ${genMonth} کے لیے ${res.count} فیس چالان کامیابی سے تیار ہو گئے!`);
      setIsGenerateModalOpen(false);
      loadFees();
    } catch (err: any) {
      notify(err.message || 'چالان تیار کرنے میں خامی ہوئی', 'error');
    }
  };

  const filteredVouchers = vouchers.filter(v => {
    const matchesSearch = 
      v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPayableAll = vouchers.reduce((a, b) => a + b.totalPayable, 0);
  const totalPaidAll = vouchers.reduce((a, b) => a + b.paidAmount, 0);
  const totalBalanceAll = totalPayableAll - totalPaidAll;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-800" />
            <span>فیس مینجمنٹ، چالان و وصولی</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            طلبہ کے ماہانہ فیس واؤچرز، وظائف و رعایت، بقایا جات اور پرنٹ ایبل رسیدات
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>ماہانہ چالان جاری کریں (Batch Generate)</span>
          </button>
        )}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-bold">کل واجب الادا رقم</div>
          <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
            PKR {totalPayableAll.toLocaleString()}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-xs">
          <div className="text-xs text-green-700 font-bold">وصول شدہ رقم (Collected)</div>
          <div className="text-2xl font-bold text-green-900 font-mono mt-1">
            PKR {totalPaidAll.toLocaleString()}
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-xs">
          <div className="text-xs text-amber-700 font-bold">بقایا جات (Outstanding)</div>
          <div className="text-2xl font-bold text-amber-900 font-mono mt-1">
            PKR {totalBalanceAll.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="طالب علم کا نام، رول نمبر یا چالان نمبر تلاش کریں..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-bold">حالت:</span>
          {(['All', 'Paid', 'Unpaid', 'Partial'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === st 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {st === 'All' ? 'تمام' : st === 'Paid' ? 'ادا شدہ' : st === 'Unpaid' ? 'غیر ادا شدہ' : 'جزوی ادا'}
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-sm">فیس ریکارڈ لوڈ ہو رہا ہے...</div>
        ) : filteredVouchers.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">کوئی فیس چالان موجود نہیں ملا</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-stone-100/80 text-stone-700 text-xs font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">چالان نمبر</th>
                  <th className="py-3.5 px-4">طالب علم</th>
                  <th className="py-3.5 px-4">مہینہ</th>
                  <th className="py-3.5 px-4">کل فیس</th>
                  <th className="py-3.5 px-4">وظیفہ/رعایت</th>
                  <th className="py-3.5 px-4">واجب الادا</th>
                  <th className="py-3.5 px-4">ادا شدہ</th>
                  <th className="py-3.5 px-4">بقایا</th>
                  <th className="py-3.5 px-4">حالت</th>
                  <th className="py-3.5 px-4 text-center">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVouchers.map(vch => (
                  <tr key={vch.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-950 text-xs">{vch.voucherNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{vch.studentName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">رول: {vch.rollNo} | {vch.className}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 text-xs font-bold">{vch.month}</td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">PKR {vch.tuitionFee + vch.admissionFee + vch.examFee + vch.hostelFee}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-700 text-xs">{vch.scholarshipDiscount > 0 ? `PKR ${vch.scholarshipDiscount}` : '-'}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">PKR {vch.totalPayable}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-green-700">PKR {vch.paidAmount}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">PKR {vch.balance}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        vch.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : vch.status === 'Partial' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vch.status === 'Paid' ? 'ادا شدہ' : vch.status === 'Partial' ? 'جزوی' : 'غیر ادا'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {canManage && vch.balance > 0 && (
                          <button
                            onClick={() => {
                              setSelectedVoucherForPayment(vch);
                              setPayAmount(vch.balance);
                            }}
                            className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            وصولی
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedVoucherForPrint(vch)}
                          title="رسید / چالان پرنٹ کریں"
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collect Fee Payment Modal */}
      {selectedVoucherForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">فیس وصولی درج کریں</h3>
                <span className="text-xs text-amber-300 font-mono">{selectedVoucherForPayment.voucherNumber}</span>
              </div>
              <button 
                onClick={() => setSelectedVoucherForPayment(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="p-6 space-y-4 text-sm">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div>طالب علم: <strong className="text-stone-900">{selectedVoucherForPayment.studentName}</strong> (رول: {selectedVoucherForPayment.rollNo})</div>
                <div>مہینہ: <strong className="text-stone-900">{selectedVoucherForPayment.month}</strong></div>
                <div>کل واجب الادا: <strong className="text-stone-900 font-mono">PKR {selectedVoucherForPayment.totalPayable}</strong></div>
                <div>موجودہ بقایا: <strong className="text-red-700 font-bold font-mono">PKR {selectedVoucherForPayment.balance}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">وصول شدہ رقم (PKR) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedVoucherForPayment.balance}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">طریقہ ادائیگی *</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Cash">نقد (Cash in Hand)</option>
                  <option value="Bank">بینک ٹرانسفر (Meezan Bank Online)</option>
                  <option value="EasyPaisa/JazzCash">ایزی پیسہ / جاز کیش (Mobile Wallet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">وصول کنندہ کا نام</label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setSelectedVoucherForPayment(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-bold hover:bg-stone-50"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm"
                >
                  ادائیگی درج کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Monthly Vouchers Generator Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">تمام فعال طلبہ کے ماہانہ چالان جاری کریں</h3>
              <button 
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateMonthly} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">مہینہ و سال *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: نومبر 2026"
                  value={genMonth}
                  onChange={e => setGenMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">آخری تاریخ ادائیگی (Due Date) *</label>
                <input
                  type="date"
                  required
                  value={genDueDate}
                  onChange={e => setGenDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                یہ کارروائی تمام فعال رجسٹرڈ طلبہ کے لیے ان کی طے شدہ ماہانہ فیس اور اسکالرشپ کی بنیاد پر چالان خودکار طور پر تیار کر دے گی۔
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-bold"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm"
                >
                  چالان جاری کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Fee Challan / Receipt Modal */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-stone-300 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 no-print">
              <div className="font-bold text-base text-stone-800 flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-800" />
                <span>پرنٹ ایبل فیس چالان / رسید (تین نقول: جامعہ، طالب علم، اور بینک کاپی)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>پرنٹ کریں (Print Challan)</span>
                </button>
                <button
                  onClick={() => setSelectedVoucherForPrint(null)}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Card Container with 3-Section Challan */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border border-stone-300 p-4 bg-stone-50/50 rounded-xl print-card">
              {['کاپی برائے جامعہ (Madrasa Copy)', 'کاپی برائے طالب علم (Student Copy)', 'کاپی برائے اکاؤنٹس (Accounts Copy)'].map((copyTitle, idx) => (
                <div key={idx} className="border border-stone-300 p-3 bg-white rounded-lg space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="text-center border-b border-stone-200 pb-2">
                      <div className="font-quran text-amber-700 text-sm">﷽</div>
                      <div className="font-bold text-stone-900 text-sm">جامعہ تعلیم القرآن کیمپس</div>
                      <div className="text-[10px] text-stone-500">لاہور، پاکستان</div>
                      <div className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] mt-1 border border-emerald-200">
                        {copyTitle}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1 py-2 border-b border-stone-100 text-[11px]">
                      <div className="flex justify-between font-mono">
                        <span className="text-stone-500">چالان نمبر:</span>
                        <strong className="text-stone-900">{selectedVoucherForPrint.voucherNumber}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">طالب علم:</span>
                        <strong className="text-stone-900">{selectedVoucherForPrint.studentName}</strong>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-stone-500">رول نمبر:</span>
                        <strong className="text-stone-900">{selectedVoucherForPrint.rollNo}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">کلاس:</span>
                        <span className="text-stone-800">{selectedVoucherForPrint.className}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">مہینہ:</span>
                        <strong className="text-emerald-800">{selectedVoucherForPrint.month}</strong>
                      </div>
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-stone-500">آخری تاریخ:</span>
                        <span className="text-red-700">{selectedVoucherForPrint.dueDate}</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1 py-2 text-[11px]">
                      <div className="flex justify-between">
                        <span>ماہانہ ٹیوشن فیس:</span>
                        <span className="font-mono">PKR {selectedVoucherForPrint.tuitionFee}</span>
                      </div>
                      {selectedVoucherForPrint.admissionFee > 0 && (
                        <div className="flex justify-between">
                          <span>داخلہ فیس:</span>
                          <span className="font-mono">PKR {selectedVoucherForPrint.admissionFee}</span>
                        </div>
                      )}
                      {selectedVoucherForPrint.scholarshipDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>رعایت / وظیفہ:</span>
                          <span className="font-mono">- PKR {selectedVoucherForPrint.scholarshipDiscount}</span>
                        </div>
                      )}
                      <div className="border-t border-stone-200 pt-1 flex justify-between font-bold text-stone-900">
                        <span>کل واجب الادا:</span>
                        <span className="font-mono text-emerald-950">PKR {selectedVoucherForPrint.totalPayable}</span>
                      </div>
                      <div className="flex justify-between text-green-700 font-bold">
                        <span>ادا شدہ رقم:</span>
                        <span className="font-mono">PKR {selectedVoucherForPrint.paidAmount}</span>
                      </div>
                      <div className="flex justify-between text-amber-800 font-bold">
                        <span>بقایا رقم:</span>
                        <span className="font-mono">PKR {selectedVoucherForPrint.balance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stamp & Signatures */}
                  <div className="border-t border-stone-200 pt-3 text-[10px] space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="border-b border-stone-400 w-20 mb-0.5"></div>
                        <span className="text-stone-500">دستخط وصول کنندہ</span>
                      </div>
                      <div className="text-left">
                        <div className="border-b border-stone-400 w-20 mb-0.5"></div>
                        <span className="text-stone-500">مہر کیمپس</span>
                      </div>
                    </div>
                    <div className="text-center text-[9px] text-stone-400 font-mono">
                      مقررہ تاریخ کے بعد 100 روپے یومیہ جرمانہ لاگو ہو سکتا ہے
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
