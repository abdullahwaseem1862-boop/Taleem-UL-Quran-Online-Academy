import React from 'react';
import { 
  BookOpen, CheckCircle2, ShieldCheck, Users, 
  Calculator, CalendarCheck, Award, Download, Globe, HelpCircle 
} from 'lucide-react';

export const UrduGuideView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-6 rounded-2xl shadow-md border border-amber-500/20">
        <div className="font-quran text-amber-300 text-lg mb-1">﷽</div>
        <h2 className="text-2xl font-bold">
          جامعہ تعلیم القرآن کیمپس - مکمل رہنمائے استعمال و ہدایات
        </h2>
        <p className="text-xs text-emerald-200 mt-1">
          بغیر کسی کوڈنگ تجربے کے، اپنے مدرسہ مینجمنٹ سسٹم کو چلانے، ٹیسٹ کرنے اور محفوظ رکھنے کی آسان مرحلہ وار گائیڈ
        </p>
      </div>

      {/* Step 1: Testing Roles */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            ۱
          </div>
          <h3 className="font-bold text-base text-stone-900">
            مختلف انتظامی و تعلیمی کرداروں کو ٹیسٹ کرنے کا طریقہ
          </h3>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          سسٹم میں ۵ بنیادی رولز (کردار) ترتیب دیے گئے ہیں۔ آپ لاگ آؤٹ کر کے یا اوپر موجود لاگ ان بٹن پر کلک کر کے کسی بھی کردار کو محض <strong>ایک کلک</strong> پر فوری ٹیسٹ کر سکتے ہیں:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <strong className="text-emerald-950 block font-bold">۱. ناظم اعلیٰ (Administrator):</strong>
            <div className="text-stone-600">صارف نام: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">admin</code> | پاس ورڈ: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">admin123</code></div>
            <div className="text-stone-500">اختیارات: تمام شعبہ جات، طلبہ و اساتذہ، کلاسز، فیس، بیک اپ اور سیٹنگز پر مکمل کنٹرول۔</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <strong className="text-teal-950 block font-bold">۲. استاذ محترم (Teacher):</strong>
            <div className="text-stone-600">صارف نام: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">teacher</code> | پاس ورڈ: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">teacher123</code></div>
            <div className="text-stone-500">اختیارات: روزانہ سبق، سبقی، منزل کا جائزہ، روزانہ حاضری، امتحانی نمبرات کا اندراج۔</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <strong className="text-amber-950 block font-bold">۳. ناظم مالیات / محاسب (Accountant):</strong>
            <div className="text-stone-600">صارف نام: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">accountant</code> | پاس ورڈ: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">account123</code></div>
            <div className="text-stone-500">اختیارات: فیس واؤچرز، وصولی، بقایا جات، اور پرنٹ ایبل رسیدات۔</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <strong className="text-blue-950 block font-bold">۴. سرپرست / والدین (Parent):</strong>
            <div className="text-stone-600">صارف نام: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">parent</code> | پاس ورڈ: <code className="bg-stone-200 px-1 py-0.5 rounded text-emerald-900">parent123</code></div>
            <div className="text-stone-500">اختیارات: صرف اپنے زیر کفالت بچے کی حاضری، حفظ کی پیش رفت اور فیس واؤچر دیکھنا۔</div>
          </div>
        </div>
      </div>

      {/* Step 2: Hifz Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            ۲
          </div>
          <h3 className="font-bold text-base text-stone-900">
            شعبہ حفظ القرآن - روزانہ جائزہ ریکارڈ کرنے کا طریقہ
          </h3>
        </div>

        <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
          <p>
            ۱. بائیں جانب مینو سے <strong>«شعبہ حفظ و جائزہ قرآنی»</strong> پر کلک کریں۔
          </p>
          <p>
            ۲. مطلوبہ طالب علم کا انتخاب کریں۔ اس کے بعد اوپر موجود <strong>«نیا سبق / جائزہ درج کریں»</strong> بٹن دبائیں۔
          </p>
          <p>
            ۳. پاپ اپ ونڈو میں:
          </p>
          <ul className="list-disc list-inside pr-4 space-y-1 text-stone-600">
            <li><strong>سبق (نیا سبق):</strong> سورت کا نام، آیات کا دائرہ (مثلاً ۱ تا ۲۰) اور معیار (ممتاز، جید وغیرہ) درج کریں۔</li>
            <li><strong>سبقی (حالیہ دہرائی):</strong> پارہ نمبر، صفحات کی تعداد اور معیار منتخب کریں۔</li>
            <li><strong>منزل (دور):</strong> روزانہ جس پارے کی منزل سنی گئی ہے وہ اور معیار منتخب کریں۔</li>
          </ul>
          <p>
            ۴. <strong>«محفوظ کریں»</strong> کا بٹن دبائیں۔ سسٹم خودکار طور پر بچے کے ۳۰ پاروں کے پروگریس بار اور تاریخ کے ریکارڈ کو اپ ڈیٹ کر دے گا۔
          </p>
        </div>
      </div>

      {/* Step 3: Attendance */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            ۳
          </div>
          <h3 className="font-bold text-base text-stone-900">
            روزانہ حاضری لگانے کا طریقہ
          </h3>
        </div>

        <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
          <p>
            ۱. مینو سے <strong>«حاضری و غیر حاضری»</strong> ٹیب کھولیں۔
          </p>
          <p>
            ۲. متعلقہ کلاس اور تاریخ منتخب کریں۔
          </p>
          <p>
            ۳. سب سے آسان طریقہ: اوپر موجود <strong>«سب حاضر»</strong> کا بٹن دبائیں جس سے تمام طلبہ ایک سیکنڈ میں حاضر ہو جائیں گے۔ پھر جو طالب علم غیر حاضر یا رخصت پر ہو، اس کے نام کے آگے موجود «غیر حاضر» یا «رخصت» پر کلک کر دیں۔
          </p>
          <p>
            ۴. آخر میں اوپر سبز رنگ کا <strong>«حاضری محفوظ کریں»</strong> بٹن دبانا نہ بھولیں۔
          </p>
        </div>
      </div>

      {/* Step 4: Fees & Printing Receipts */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            ۴
          </div>
          <h3 className="font-bold text-base text-stone-900">
            فیس چالان جاری کرنے اور آفیشل رسید پرنٹ کرنے کا طریقہ
          </h3>
        </div>

        <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
          <p>
            ۱. مینو سے <strong>«فیس و مالیاتی نظام»</strong> کھولیں۔
          </p>
          <p>
            ۲. اگر نیا مہینہ شروع ہو تو <strong>«ماہانہ چالان جاری کریں»</strong> بٹن دبا کر تاریخ درج کریں۔ تمام فعال طلبہ کے فیس چالان ایک سیکنڈ میں خودکار بن جائیں گے۔
          </p>
          <p>
            ۳. فیس وصول کرتے وقت طالب علم کے آگے <strong>«وصولی»</strong> پر کلک کریں، رقم اور طریقہ (نقد یا بینک) منتخب کر کے محفوظ کریں۔
          </p>
          <p>
            ۴. پرنٹ آئیکون (<Printer className="w-3.5 h-3.5 inline text-emerald-800" />) پر کلک کر کے آپ <strong>جامعہ کاپی، طالب علم کاپی، اور بینک کاپی</strong> پر مشتمل باوقار اسلامی فیس چالان اپنے پرنٹر سے پرنٹ کر سکتے ہیں۔
          </p>
        </div>
      </div>

      {/* Step 5: Data Backup */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            ۵
          </div>
          <h3 className="font-bold text-base text-stone-900">
            ڈیٹا کا محفوظ بیک اپ اور بحالی (Backup & Restore)
          </h3>
        </div>

        <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
          <p>
            ۱. مینو سے <strong>«ترتیبات و بیک اپ»</strong> پر جائیں۔
          </p>
          <p>
            ۲. ہفتہ وار یا ماہانہ بنیاد پر <strong>«مکمل ڈیٹا بیک اپ ڈاؤن لوڈ کریں»</strong> بٹن پر کلک کریں۔ آپ کے کمپیوٹر پر ایک مکمل محفوظ فائل ڈاؤن لوڈ ہو جائے گی۔
          </p>
          <p>
            ۳. اگر کبھی کمپیوٹر تبدیل ہو یا ڈیٹا دوبارہ لانا ہو، تو اسی صفحے پر <strong>«بیک اپ فائل منتخب کریں اور بحال کریں»</strong> کے ذریعے سابقہ بیک اپ منتخب کریں؛ سارا ریکارڈ بحال ہو جائے گا۔
          </p>
        </div>
      </div>
    </div>
  );
};

function Printer(props: any) {
  return <Award {...props} />;
}
