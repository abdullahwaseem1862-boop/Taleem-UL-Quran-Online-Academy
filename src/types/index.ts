export type Language = 'ur' | 'en' | 'ar';

export type UserRole = 'admin' | 'teacher' | 'accountant' | 'student' | 'parent';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  linkedStudentId?: string;
  linkedTeacherId?: string;
  avatar?: string;
}

export type Department = 'Hifz' | 'Nazra' | 'Tajweed' | 'Dars-e-Nizami' | 'Tarjuma';

export type StudentStatus = 'Active' | 'On Leave' | 'Graduated' | 'Struck Off';

export interface Student {
  id: string;
  regNo: string;
  rollNo: string;
  name: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  cnic: string;
  dob: string;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  address: string;
  department: Department;
  classId: string;
  admissionDate: string;
  monthlyFee: number;
  scholarshipDiscount: number;
  status: StudentStatus;
  avatarUrl?: string;
  notes?: string;
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  guardianName: string;
  guardianPhone: string;
  guardianCnic: string;
  dob: string;
  gender: 'Male' | 'Female';
  address: string;
  appliedDepartment: Department;
  previousSchoolOrMadrasa: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
  notes?: string;
  assignedClassId?: string;
  assignedRollNo?: string;
}

export interface MadrasaClass {
  id: string;
  name: string;
  department: Department;
  teacherId: string;
  teacherName?: string;
  room: string;
  capacity: number;
  scheduleTime: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  phone: string;
  email: string;
  hireDate: string;
  salary: number;
  assignedClasses: string[];
  specializations: string[];
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Late';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  classId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface TeacherAttendance {
  id: string;
  date: string;
  teacherId: string;
  status: AttendanceStatus;
  timeIn?: string;
}

export type FeeStatus = 'Paid' | 'Unpaid' | 'Partial';

export interface FeeVoucher {
  id: string;
  voucherNumber: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  className: string;
  month: string; // e.g. "October 2026"
  dueDate: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  hostelFee: number;
  scholarshipDiscount: number;
  totalPayable: number;
  paidAmount: number;
  balance: number;
  status: FeeStatus;
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'Bank' | 'EasyPaisa/JazzCash';
  receiptNumber?: string;
  receiverName?: string;
}

export interface Exam {
  id: string;
  title: string;
  term: 'First Term' | 'Mid Term' | 'Final Term' | 'Monthly Test';
  year: string;
  startDate: string;
  endDate: string;
  classes: string[];
}

export interface SubjectMarks {
  subjectName: string;
  totalMarks: number;
  obtainedMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle?: string;
  studentId: string;
  studentName?: string;
  rollNo?: string;
  classId: string;
  className?: string;
  subjects: SubjectMarks[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: 'Mumtaz (A+)' | 'Jayyid Jiddan (A)' | 'Jayyid (B)' | 'Maqbool (C)' | 'Rasib (Fail)';
  position?: string;
  teacherRemarks?: string;
}

export type HifzQuality = 'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Maqbool' | 'Daif';

export interface HifzRecord {
  id: string;
  studentId: string;
  studentName?: string;
  rollNo?: string;
  date: string;
  teacherId: string;
  teacherName?: string;
  sabaq: {
    surah: string;
    ayaFrom: number;
    ayaTo: number;
    juzNumber: number;
    rating: HifzQuality;
  };
  sabqi: {
    juzNumber: number;
    pagesOrQuarter: string;
    rating: HifzQuality;
  };
  manzil: {
    juzNumber: number;
    quarterOrHalf: string;
    rating: HifzQuality;
  };
  totalJuzMemorized: number; // 1 to 30
  currentJuz: number;
  remarks?: string;
}

export interface Announcement {
  id: string;
  titleUrdu: string;
  titleEn: string;
  titleAr: string;
  contentUrdu: string;
  contentEn: string;
  contentAr: string;
  date: string;
  category: 'General' | 'Exam' | 'Holiday' | 'Urgent';
  targetRoles: string[];
}
