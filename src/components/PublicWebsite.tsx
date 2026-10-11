import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { 
  BookOpen, Sparkles, CheckCircle2, Award, Clock, 
  MapPin, Phone, Mail, Building, Users, Calendar, 
  ArrowLeft, ArrowRight, ShieldCheck, HeartHandshake, Check, AlertCircle 
} from 'lucide-react';
import { Department } from '../types';

export const PublicWebsite: React.FC = () => {
  const { t, isRtl, setIsLoginModalOpen, notify } = useApp();

  // Admission form state
  const [formData, setFormData] = useState({
    applicantName: '',
    guardianName: '',
    guardianPhone: '',
    guardianCnic: '',
    dob: '2015-01-01',
    gender: 'Male' as 'Male' | 'Female',
    address: '',
    appliedDepartment: 'Hifz' as Department,
    previousSchoolOrMadrasa: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.applyAdmission(formData);
      setSubmittedApp(res.application);
      notify(t.admissionSuccess, 'success');
      // Reset form
      setFormData({
        applicantName: '',
        guardianName: '',
        guardianPhone: '',
        guardianCnic: '',
        dob: '2015-01-01',
        gender: 'Male',
        address: '',
        appliedDepartment: 'Hifz',
        previousSchoolOrMadrasa: '',
        notes: ''
      });
    } catch (err: any) {
      notify(err.message || 'درخواست جمع کرنے میں خامی ہوئی', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const departments = [
    {
      id: 'hifz',
      titleUrdu: 'شعبہ تحفیظ القرآن الکریم',
      titleEn: 'Department of Quran Memorization (Hifz)',
      descUrdu: 'ماہر قراء کرام کی زیر نگرانی مخارج و تجوید کے ساتھ حفظ قرآن، روزانہ سبق، سبقی اور منزل کا کڑا نظام۔',
      durationUrdu: 'مدت: ۲ تا ۳ سال',
      features: ['روزانہ تین وقتی جائزہ (سبق، سبقی، منزل)', 'تجویدی مخارج کی تصحیح', 'ماہانہ ٹیسٹ و سالانہ اسناد']
    },
    {
      id: 'nazra',
      titleUrdu: 'شعبہ ناظرہ و بنیادی دینیات',
      titleEn: 'Nazra & Foundational Islamic Education',
      descUrdu: 'نورانی قاعدہ، روانگی سے تلاوت، مسنون دعائیں، نماز کی عملی مشق اور اخلاقی تربیت۔',
      durationUrdu: 'مدت: ۱ سال',
      features: ['صحیح تلفظ و ادائے کلمات', 'طہارت و نماز کی عملی تربیت', 'چھ کلمے اور چالیس مسنون دعائیں']
    },
    {
      id: 'tajweed',
      titleUrdu: 'شعبہ تجوید و قراءات سبعہ',
      titleEn: 'Department of Tajweed & Qira’at',
      descUrdu: 'روایت حفص عن عاصم اور قراءات سبعہ کے مطابق تجویدی قواعد اور حسنِ صوت کی خصوصی مشق۔',
      durationUrdu: 'مدت: ۱ تا ۲ سال',
      features: ['مقدمۃ الجزریہ اور تحفۃ الاطفال کا درس', 'لحن جلی اور خفی سے پرہیز', 'ملکی و بین الاقوامی مسابقات کی تیاری']
    },
    {
      id: 'nizami',
      titleUrdu: 'شعبہ درسِ نظامی (عالم کورس)',
      titleEn: 'Dars-e-Nizami (Alim Course)',
      descUrdu: 'وفاق المدارس کے منظور شدہ نصاب کے مطابق صرف و نحو، فقہ، اصول فقہ، حدیث اور عربی ادب کی تدریس۔',
      durationUrdu: 'مدت: ۸ سالہ سند العالمیہ',
      features: ['عربی زبان و ادب پر مکمل عبور', 'کتب حدیث و تفسیر کا گہرا مطالعہ', 'افتاء و فقہی بصیرت']
    }
  ];

  const facilities = [
    { title: 'جامع مسجد و وسیع ہال', desc: 'باجماعت پنجگانہ نماز اور پُرسکون تلاوت کے لیے کشادہ ہال' },
    { title: 'دار الاقامہ (ہاسٹل)', desc: 'بیرون شہر کے طلبہ کے لیے آرام دہ رہائش اور حفظ کا پُرسکون ماحول' },
    { title: 'مطبخ و طعام خانہ', desc: 'طلبہ کے لیے حفظان صحت کے اصولوں پر تیار کردہ معیاری کھانا' },
    { title: 'کتب خانہ و دار المطالعہ', desc: 'ہزاروں نادر اسلامی کتب، تفاسیر اور شروحات حدیث کا ذخیرہ' },
    { title: 'بنیادی طبی امداد (ڈسپنسری)', desc: 'طلبہ کی صحت کی مسلسل نگہبانی اور ادویات کی فراہمی' },
    { title: 'سیکیورٹی و نگہداشت', desc: 'سی سی ٹی وی کیمروں اور تربیت یافتہ عملے کی ہمہ وقتی حفاظت' }
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative bg-emerald-950 text-white overflow-hidden py-16 sm:py-24 border-b border-amber-500/20">
        {/* Decorative Gold & Emerald Background Gradients */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-islamic-pattern" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Bismillah Calligraphy */}
          <div className="inline-block px-6 py-2 rounded-full bg-emerald-900/80 border border-amber-400/30 text-amber-300 font-quran text-xl sm:text-2xl shadow-lg">
            {t.bismillah}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {t.campusName}
          </h1>

          <p className="text-lg sm:text-2xl text-amber-300 font-nastaliq max-w-3xl mx-auto font-medium">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </p>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            قرآنِ مجید کی صحیح تلاوت، حفظ، تجوید اور علومِ اسلامیہ کی ترویج کا عظیم الشان اسلامی مرکز۔ جدید تعلیمی نظم و نسق اور مستند اساتذہ کرام کے زیر سایہ دینی و اخلاقی تربیت کا گہوارہ۔
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#admissions"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>آن لائن داخلہ فارم پر کریں</span>
            </a>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-3.5 bg-emerald-900/90 hover:bg-emerald-800 text-white font-semibold rounded-xl border border-emerald-700 shadow-md transition-colors text-sm sm:text-base flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>انتظامی پورٹل میں لاگ ان کریں</span>
            </button>
          </div>

          {/* Highlights KPI ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
            <div className="bg-emerald-900/60 border border-emerald-800/80 p-4 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">۳۵۰+</div>
              <div className="text-xs text-emerald-200 mt-1">زیرِ تعلیم طلبہ کرام</div>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-800/80 p-4 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">۱۸+</div>
              <div className="text-xs text-emerald-200 mt-1">مستند اساتذہ و قراء</div>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-800/80 p-4 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">۱۲۰+</div>
              <div className="text-xs text-emerald-200 mt-1">حفاظ کرام کی فراغت</div>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-800/80 p-4 rounded-xl backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">۱۰۰٪</div>
              <div className="text-xs text-emerald-200 mt-1">مفت کفالتِ مستحقین</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>جامعہ تعلیم القرآن کا تعارف و اہداف</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              قرآنی تعلیمات کی روشنی میں کردار سازی اور روحانی تربیت
            </h2>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              جامعہ تعلیم القرآن کیمپس ایک مثالی دینی ادارہ ہے جس کا مقصد نونہالانِ امت کو قرآنِ کریم کے حفظ اور اس کے فہم کے ساتھ سنوارنا ہے۔ ہم روایتی دینی اخلاص کے ساتھ ساتھ جدید نظم و نسق، ڈیجیٹل مانیٹرنگ اور طلبہ کی انفرادی دیکھ بھال پر یقین رکھتے ہیں۔
            </p>
            <div className="space-y-3">
              {[
                'تجوید و قراءت کے مستند ائمہ سے تصدیق شدہ اساتذہ',
                'طلبہ کی روزانہ کارکردگی، سبق اور منزل کا کمپیوٹرائزڈ ریکارڈ',
                'والدین کے لیے خصوصی پورٹل تا کہ وہ گھر بیٹھے اپنے بچے کی پیش رفت دیکھ سکیں',
                'اخلاقی و عملی تربیت اور سنتِ نبوی صلی اللہ علیہ وسلم پر استقامت'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-stone-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-emerald-900 text-white p-8 space-y-6 relative">
              <div className="border-b border-emerald-800 pb-4">
                <span className="text-amber-400 font-quran text-lg">ارشادِ نبوی صلی اللہ علیہ وسلم</span>
                <p className="text-lg font-quran mt-2 leading-loose text-amber-200">
                  «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
                </p>
                <p className="text-xs text-emerald-200 mt-1">
                  (تم میں سے بہترین وہ ہے جس نے قرآن سیکھا اور دوسروں کو سکھایا۔ صحیح البخاری)
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-800/80 text-amber-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">اوقاتِ کار:</div>
                    <div>صبح 07:00 بجے تا دوپہر 01:30 بجے (شعبہ روزانہ)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-800/80 text-amber-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">مقام:</div>
                    <div>مین بلیوارڈ، مدینہ ٹاؤن، لاہور، پاکستان</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-800/80 text-amber-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">رابطہ برائے معلومات:</div>
                    <div>0300-1234567 / 042-35889900</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="courses" className="py-16 bg-stone-100/70 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>شعبہ جات و تعلیمی نصاب</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              جامعہ کے بنیادی شعبہ جات اور کورسز
            </h2>
            <p className="text-sm text-stone-600">
              ہر شعبے کے لیے تجربہ کار اساتذہ اور جامع نصاب وضع کیا گیا ہے
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map(dept => (
              <div 
                key={dept.id}
                className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 hover:border-emerald-700/40 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950">{dept.titleUrdu}</h3>
                    <div className="text-xs text-stone-500 font-sans mt-0.5">{dept.titleEn}</div>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
                    {dept.durationUrdu}
                  </span>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed">
                  {dept.descUrdu}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  {dept.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">کیمپس کی بنیادی سہولیات</h2>
          <p className="text-sm text-stone-600">طلبہ کی سہولت اور تعلیمی یکسوئی کے لیے معیاری انتظام</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((fac, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-emerald-600 transition-colors space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </div>
              <h4 className="font-bold text-base text-stone-800">{fac.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Online Admissions Form Section */}
      <section id="admissions" className="py-16 bg-gradient-to-b from-emerald-950 to-emerald-900 text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-bold border border-amber-400/20">
              تعلیمی سال 1448ھ / 2026ء برائے نئے داخلہ جات
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              آن لائن داخلہ درخواست فارم
            </h2>
            <p className="text-sm text-emerald-200 max-w-lg mx-auto">
              براہ کرم طالب علم اور سرپرست کی تمام تر معلومات درست اور مکمل درج فرمائیں
            </p>
          </div>

          {submittedApp ? (
            <div className="bg-white text-stone-900 rounded-2xl p-8 shadow-xl text-center space-y-4 border-2 border-emerald-600">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950">درخواست کامیابی سے موصول ہو گئی!</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                طالب علم <strong className="text-emerald-900">{submittedApp.applicantName}</strong> کی درخواست داخلہ برائے <strong className="text-amber-800">{submittedApp.appliedDepartment}</strong> ہمارے پاس درج ہو چکی ہے۔
              </p>

              <div className="inline-block p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono">
                درخواست ٹریکنگ نمبر: <strong className="text-emerald-700 text-base">{submittedApp.id}</strong>
              </div>

              <div>
                <button
                  onClick={() => setSubmittedApp(null)}
                  className="px-6 py-2.5 bg-emerald-800 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  ایک اور درخواست جمع کریں
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdmissionSubmit} className="bg-white text-stone-900 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    طالب علم کا نام (Student Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد احمد"
                    value={formData.applicantName}
                    onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    والد / سرپرست کا نام (Father / Guardian) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد الرشید"
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    سرپرست کا موبائل نمبر (Mobile Number) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={formData.guardianPhone}
                    onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    قومی شناختی کارڈ نمبر (Guardian CNIC)
                  </label>
                  <input
                    type="text"
                    placeholder="35201-1234567-1"
                    value={formData.guardianCnic}
                    onChange={e => setFormData({ ...formData, guardianCnic: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    تاریخ پیدائش (Date of Birth)
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    مطلوبہ شعبہ (Desired Department) *
                  </label>
                  <select
                    value={formData.appliedDepartment}
                    onChange={e => setFormData({ ...formData, appliedDepartment: e.target.value as Department })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm bg-white"
                  >
                    <option value="Hifz">شعبہ حفظ القرآن الکریم</option>
                    <option value="Nazra">شعبہ ناظرہ و بنیادی دینیات</option>
                    <option value="Tajweed">شعبہ تجوید و قراءات</option>
                    <option value="Dars-e-Nizami">شعبہ درسِ نظامی (عالم کورس)</option>
                    <option value="Tarjuma">شعبہ ترجمہ و تفسیر</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  سابقہ اسکول یا مدرسہ (Previous School/Madrasa)
                </label>
                <input
                  type="text"
                  placeholder="سابقہ تعلیمی ادارہ اور تعلیمی قابلیت"
                  value={formData.previousSchoolOrMadrasa}
                  onChange={e => setFormData({ ...formData, previousSchoolOrMadrasa: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  مکمل رہائشی پتہ (Permanent Address)
                </label>
                <textarea
                  rows={2}
                  placeholder="گھر کا پتہ، محلہ، شہر"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {submitting ? (
                  <span>درخواست جمع ہو رہی ہے...</span>
                ) : (
                  <>
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{t.submitAdmission}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact & Banking Info Section */}
      <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-700" />
              <span>جامعہ سے براہ راست رابطہ</span>
            </h3>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">پتہ کیمپس:</div>
                  <div>مین بلیوارڈ، مدینہ ٹاؤن، لاہور، پاکستان</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">فون نمبرز:</div>
                  <div dir="ltr" className="text-left font-sans">+92 42 35889900 / 0300-1234567</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">ای میل:</div>
                  <div className="font-sans">info@taleemulquran.edu.pk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              <span>بینک اکاؤنٹ برائے فیس و معاونت</span>
            </h3>

            <p className="text-xs text-emerald-200 leading-relaxed">
              آن لائن فیس اور صدقات و عطیات کی ادائیگی کے لیے سرکاری بینک اکاؤنٹ کی تفصیلات درج ذیل ہیں:
            </p>

            <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-300 font-sans">بینک کا نام:</span>
                <span className="text-white font-bold font-sans">میزان اسلامک بینک (Meezan Bank)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300 font-sans">اکاؤنٹ کا عنوان:</span>
                <span className="text-amber-300 font-bold font-sans">Taleem Ul Quran Trust</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300 font-sans">اکاؤنٹ نمبر:</span>
                <span className="text-white font-bold font-mono">0201-01048892019</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300 font-sans">آئی بین (IBAN):</span>
                <span className="text-amber-200 font-bold font-mono text-[11px]">PK89MEZN00020101048892019</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-900 py-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-right">
            <div className="font-bold text-white text-sm">{t.campusName}</div>
            <div className="text-emerald-300 mt-0.5">{t.campusSub}</div>
          </div>

          <div className="font-quran text-amber-400 text-sm">
            وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ
          </div>

          <div className="text-stone-400">
            © {new Date().getFullYear()} Taleem Ul Quran Campus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
