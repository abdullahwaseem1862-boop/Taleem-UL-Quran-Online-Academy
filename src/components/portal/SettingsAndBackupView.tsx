import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { 
  Settings, Download, Upload, RefreshCw, ShieldAlert, 
  CheckCircle2, Save, Building, Phone, Mail, MapPin, Database 
} from 'lucide-react';

export const SettingsAndBackupView: React.FC = () => {
  const { currentUser, notify } = useApp();
  const [settings, setSettings] = useState<any>({
    campusName: 'Taleem Ul Quran Campus',
    campusNameUrdu: 'جامعہ تعلیم القرآن کیمپس',
    phone: '0300-1234567',
    email: 'info@taleemulquran.edu',
    address: 'Main Boulevard, Madina Town, Lahore, Pakistan',
    bankName: 'Meezan Islamic Bank',
    accountTitle: 'Taleem Ul Quran Trust',
    accountNumber: '0201-01048892019'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canEdit = currentUser?.role === 'admin';

  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      notify('ترتیبات کامیابی سے محفوظ ہو گئیں');
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    window.location.href = '/api/backup/download';
    notify('ڈیٹا بیک اپ فائل ڈاؤن لوڈ ہونا شروع ہو گئی ہے');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await api.restoreBackup(json);
        notify('ڈیٹا کامیابی سے بحال ہو گیا! سسٹم تازہ دم ہو رہا ہے...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err: any) {
        notify('بیک اپ فائل خراب ہے یا فارمیٹ غلط ہے', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = async () => {
    if (!window.confirm('کیا آپ واقعی تمام ڈیٹا فیکٹری سیڈنگ پر واپس لانا چاہتے ہیں؟ حالیہ تمام ترامیم ختم ہو جائیں گی۔')) {
      return;
    }
    try {
      await api.resetBackup();
      notify('ڈیٹا کامیابی سے بحال ہو گیا!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-800" />
            <span>ترتیبات، ڈیٹا سیکیورٹی و بیک اپ مینجمنٹ</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            جامعہ کی تفصیلات، بینک اکاؤنٹس، ڈیٹا بیک اپ ڈاؤن لوڈ اور بحالی کا محفوظ انتظام
          </p>
        </div>
      </div>

      {/* Database Backup & Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">ڈیٹا بیک اپ ڈاؤن لوڈ کریں</h3>
              <p className="text-xs text-stone-500">ایک کلک پر تمام طلبہ، حاضری، فیس اور نتائج کا آف لائن محفوظ بیک اپ</p>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
            بیک اپ فائل میں تمام طلبہ، فیس چالان، حفظ کا روزانہ ریکارڈ اور اساتذہ کی تفصیلات محفوظ ہوتی ہیں۔ اسے باقاعدگی سے ڈاؤن لوڈ کر کے اپنے کمپیوٹر یا یو ایس بی ڈرائیو میں محفوظ رکھیں۔
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>مکمل ڈیٹا بیک اپ ڈاؤن لوڈ کریں (JSON Backup)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">ڈیٹا بحال (Restore) کریں</h3>
              <p className="text-xs text-stone-500">سابقہ محفوظ شدہ بیک اپ فائل منتخب کر کے ریکارڈ بحال کریں</p>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
            اگر کمپیوٹر یا سرور تبدیل کرنا ہو، تو اپنی بیک اپ فائل کو یہاں اپ لوڈ کریں تا کہ تمام سابقہ ریکارڈ لمحوں میں واپس آ جائے۔
          </div>

          <label className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-amber-300" />
            <span>بیک اپ فائل منتخب کریں اور بحال کریں</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Campus Info & Bank Account Settings */}
      {canEdit && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-800" />
              <span>جامعہ کی بنیادی معلومات و بینک اکاؤنٹ کی ترتیبات</span>
            </h3>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{saving ? 'محفوظ ہو رہا ہے...' : 'ترتیبات محفوظ کریں'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">کیمپس کا نام (اردو)</label>
              <input
                type="text"
                value={settings.campusNameUrdu}
                onChange={e => setSettings({ ...settings, campusNameUrdu: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">کیمپس کا نام (انگریزی)</label>
              <input
                type="text"
                value={settings.campusName}
                onChange={e => setSettings({ ...settings, campusName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">فون نمبرز / رابطہ</label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ای میل ایڈریس</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">بینک کا نام (Bank Name)</label>
              <input
                type="text"
                value={settings.bankName}
                onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">اکاؤنٹ ٹائٹل (Account Title)</label>
              <input
                type="text"
                value={settings.accountTitle}
                onChange={e => setSettings({ ...settings, accountTitle: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">اکاؤنٹ نمبر (Account Number)</label>
              <input
                type="text"
                value={settings.accountNumber}
                onChange={e => setSettings({ ...settings, accountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">کیمپس کا پتہ</label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </form>
      )}

      {/* Factory Reset Section */}
      {canEdit && (
        <div className="bg-red-50/70 p-6 rounded-2xl border border-red-200 space-y-3">
          <div className="flex items-center gap-2 text-red-900 font-bold text-base">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>فیکٹری ری سیٹ (Reset to Demo Seed State)</span>
          </div>
          <p className="text-xs text-red-700 leading-relaxed">
            یہ آپشن سسٹم کے ڈیٹا کو بنیادی نمونہ ڈیٹا پر دوبارہ لا کھڑا کرتا ہے۔ اگر آپ نے کوئی ٹیسٹنگ کے دوران غلط اندراجات کیے ہوں تو یہ بٹن دبا کر اصل ڈیمو ڈیٹا پر واپس آ سکتے ہیں۔
          </p>
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            ڈیٹا فیکٹری ری سیٹ کریں
          </button>
        </div>
      )}
    </div>
  );
};
