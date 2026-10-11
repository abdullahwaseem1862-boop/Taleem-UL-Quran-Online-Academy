import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './server/storage';
import { User, Student, AdmissionApplication, FeeVoucher, HifzRecord, AttendanceRecord, ExamResult, Announcement } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Simple Session / Bearer Token Map
const activeSessions = new Map<string, User>();

// Pre-seed sessions for testing convenience
const users = storage.getDb().users;
users.forEach(u => {
  activeSessions.set(`token_${u.username}`, u);
});

// Auth Middleware Helper
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(); // Guest/Anonymous permitted for public routes
  }
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const user = activeSessions.get(token);
  if (user) {
    (req as any).user = user;
  }
  next();
}

app.use(authenticate);

// --- Auth Endpoints ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = storage.getDb();
  const user = db.users.find(u => u.username.toLowerCase() === (username || '').toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'صارف کا نام درست نہیں ہے (Invalid username)' });
  }

  // Demo password rule: accept password if matching pattern or standard demo passwords
  const valid = !password || password === `${user.username}123` || password === '123456' || password === 'admin123';
  if (!valid) {
    return res.status(401).json({ error: 'پاس ورڈ درست نہیں ہے (Incorrect password)' });
  }

  const token = `tok_${user.username}_${Date.now()}`;
  activeSessions.set(token, user);
  storage.logAction('Login', user.name, `User ${user.username} logged in with role ${user.role}`);

  res.json({ token, user });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// --- Public Admission Application ---
app.post('/api/admissions/apply', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.applicantName || !body.guardianName || !body.guardianPhone) {
    return res.status(400).json({ error: 'براہ کرم تمام لازمی فیلڈز مکمل کریں (Missing required fields)' });
  }

  const newApp: AdmissionApplication = {
    id: 'adm_' + Date.now(),
    applicantName: body.applicantName.trim(),
    guardianName: body.guardianName.trim(),
    guardianPhone: body.guardianPhone.trim(),
    guardianCnic: (body.guardianCnic || '').trim(),
    dob: body.dob || '2015-01-01',
    gender: body.gender || 'Male',
    address: (body.address || '').trim(),
    appliedDepartment: body.appliedDepartment || 'Hifz',
    previousSchoolOrMadrasa: (body.previousSchoolOrMadrasa || '').trim(),
    status: 'Pending',
    submissionDate: new Date().toISOString().split('T')[0],
    notes: body.notes || ''
  };

  const db = storage.getDb();
  db.admissions.unshift(newApp);
  storage.logAction('New Admission Application', newApp.applicantName, `Applied for ${newApp.appliedDepartment}`);
  storage.save();

  res.status(201).json({ 
    success: true, 
    message: 'درخواست کامیابی سے جمع ہو گئی ہے (Application submitted successfully)',
    application: newApp 
  });
});

// --- Dashboard Statistics ---
app.get('/api/stats', (req: Request, res: Response) => {
  const db = storage.getDb();
  const today = new Date().toISOString().split('T')[0];

  const totalStudents = db.students.length;
  const activeStudents = db.students.filter(s => s.status === 'Active').length;
  const totalTeachers = db.teachers.length;
  const activeClasses = db.classes.length;
  const pendingAdmissions = db.admissions.filter(a => a.status === 'Pending').length;
  const hifzCount = db.students.filter(s => s.department === 'Hifz').length;

  const todayAttendance = db.attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const attendanceRate = todayAttendance.length > 0 
    ? Math.round((presentCount / todayAttendance.length) * 100) 
    : 95;

  const totalFeesExpected = db.feeVouchers.reduce((acc, v) => acc + v.totalPayable, 0);
  const totalFeesCollected = db.feeVouchers.reduce((acc, v) => acc + v.paidAmount, 0);
  const pendingFees = totalFeesExpected - totalFeesCollected;

  res.json({
    totalStudents,
    activeStudents,
    totalTeachers,
    activeClasses,
    pendingAdmissions,
    hifzCount,
    attendanceRate,
    totalFeesExpected,
    totalFeesCollected,
    pendingFees,
    auditLogs: db.auditLogs.slice(0, 10)
  });
});

// --- Students Management ---
app.get('/api/students', (req: Request, res: Response) => {
  const db = storage.getDb();
  const user = (req as any).user;

  // Role filtering: Parent and student only view their linked record
  if (user && user.role === 'student' && user.linkedStudentId) {
    return res.json(db.students.filter(s => s.id === user.linkedStudentId));
  }
  if (user && user.role === 'parent' && user.linkedStudentId) {
    return res.json(db.students.filter(s => s.id === user.linkedStudentId));
  }

  res.json(db.students);
});

app.post('/api/students', (req: Request, res: Response) => {
  const db = storage.getDb();
  const body = req.body;
  if (!body.name || !body.guardianName) {
    return res.status(400).json({ error: 'طالب علم اور سرپرست کا نام لازمی ہے' });
  }

  const newStudent: Student = {
    id: 'std_' + Date.now(),
    regNo: body.regNo || `TQ-${new Date().getFullYear()}-${String(db.students.length + 1).padStart(3, '0')}`,
    rollNo: body.rollNo || `R-${100 + db.students.length + 1}`,
    name: body.name.trim(),
    guardianName: body.guardianName.trim(),
    guardianPhone: body.guardianPhone?.trim() || '',
    guardianRelation: body.guardianRelation || 'والد',
    cnic: body.cnic || '',
    dob: body.dob || '2014-01-01',
    gender: body.gender || 'Male',
    bloodGroup: body.bloodGroup || 'B+',
    address: body.address || '',
    department: body.department || 'Hifz',
    classId: body.classId || db.classes[0]?.id || '',
    admissionDate: body.admissionDate || new Date().toISOString().split('T')[0],
    monthlyFee: Number(body.monthlyFee) || 2000,
    scholarshipDiscount: Number(body.scholarshipDiscount) || 0,
    status: body.status || 'Active',
    notes: body.notes || ''
  };

  db.students.push(newStudent);
  storage.logAction('Add Student', (req as any).user?.name || 'Admin', `Added student ${newStudent.name} (${newStudent.rollNo})`);
  storage.save();

  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const db = storage.getDb();
  const { id } = req.params;
  const index = db.students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  db.students[index] = { ...db.students[index], ...req.body, id };
  storage.logAction('Update Student', (req as any).user?.name || 'Admin', `Updated details for ${db.students[index].name}`);
  storage.save();

  res.json(db.students[index]);
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const db = storage.getDb();
  const { id } = req.params;
  const student = db.students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  db.students = db.students.filter(s => s.id !== id);
  storage.logAction('Delete Student', (req as any).user?.name || 'Admin', `Removed student ${student.name} (${student.rollNo})`);
  storage.save();

  res.json({ success: true });
});

// --- Admissions Queue ---
app.get('/api/admissions', (req: Request, res: Response) => {
  res.json(storage.getDb().admissions);
});

app.put('/api/admissions/:id/status', (req: Request, res: Response) => {
  const db = storage.getDb();
  const { id } = req.params;
  const { status, classId, rollNo } = req.body;

  const appIndex = db.admissions.findIndex(a => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const appItem = db.admissions[appIndex];
  appItem.status = status;
  if (classId) appItem.assignedClassId = classId;
  if (rollNo) appItem.assignedRollNo = rollNo;

  // If approved, create official Student document automatically!
  if (status === 'Approved') {
    const studentExists = db.students.some(s => s.name === appItem.applicantName && s.guardianPhone === appItem.guardianPhone);
    if (!studentExists) {
      const generatedRoll = rollNo || `R-${100 + db.students.length + 1}`;
      const newStudent: Student = {
        id: 'std_' + Date.now(),
        regNo: `TQ-${new Date().getFullYear()}-${String(db.students.length + 1).padStart(3, '0')}`,
        rollNo: generatedRoll,
        name: appItem.applicantName,
        guardianName: appItem.guardianName,
        guardianPhone: appItem.guardianPhone,
        guardianRelation: 'والد',
        cnic: appItem.guardianCnic,
        dob: appItem.dob,
        gender: appItem.gender,
        bloodGroup: 'B+',
        address: appItem.address,
        department: appItem.appliedDepartment,
        classId: classId || db.classes[0]?.id || '',
        admissionDate: new Date().toISOString().split('T')[0],
        monthlyFee: 2000,
        scholarshipDiscount: 0,
        status: 'Active',
        notes: `Converted from online admission: ${appItem.notes || ''}`
      };
      db.students.push(newStudent);
      storage.logAction('Admission Approved', (req as any).user?.name || 'Admin', `Approved ${appItem.applicantName} into student body`);
    }
  }

  storage.save();
  res.json(appItem);
});

// --- Classes ---
app.get('/api/classes', (req: Request, res: Response) => {
  res.json(storage.getDb().classes);
});

app.post('/api/classes', (req: Request, res: Response) => {
  const db = storage.getDb();
  const body = req.body;
  const newClass = {
    id: 'cls_' + Date.now(),
    name: body.name,
    department: body.department || 'Hifz',
    teacherId: body.teacherId || '',
    teacherName: body.teacherName || '',
    room: body.room || 'کمرہ 101',
    capacity: Number(body.capacity) || 25,
    scheduleTime: body.scheduleTime || 'صبح 8:00 تا دوپہر 1:00'
  };
  db.classes.push(newClass);
  storage.save();
  res.status(201).json(newClass);
});

// --- Teachers ---
app.get('/api/teachers', (req: Request, res: Response) => {
  res.json(storage.getDb().teachers);
});

app.post('/api/teachers', (req: Request, res: Response) => {
  const db = storage.getDb();
  const body = req.body;
  const newTeacher = {
    id: 'tch_' + Date.now(),
    name: body.name,
    designation: body.designation || 'استاذ',
    qualification: body.qualification || 'فاضل درسِ نظامی',
    phone: body.phone || '',
    email: body.email || '',
    hireDate: body.hireDate || new Date().toISOString().split('T')[0],
    salary: Number(body.salary) || 35000,
    assignedClasses: body.assignedClasses || [],
    specializations: body.specializations || ['تجوید']
  };
  db.teachers.push(newTeacher);
  storage.save();
  res.status(201).json(newTeacher);
});

// --- Attendance ---
app.get('/api/attendance', (req: Request, res: Response) => {
  const { date, classId } = req.query;
  const db = storage.getDb();
  let records = db.attendance;

  if (date) {
    records = records.filter(r => r.date === date);
  }
  if (classId) {
    records = records.filter(r => r.classId === classId);
  }
  res.json(records);
});

app.post('/api/attendance/bulk', (req: Request, res: Response) => {
  const db = storage.getDb();
  const { date, records } = req.body; // records: { studentId, classId, status, remarks }[]

  if (!date || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid attendance payload' });
  }

  // Remove existing records for this date and these students to prevent duplicates
  const studentIds = new Set(records.map(r => r.studentId));
  db.attendance = db.attendance.filter(a => !(a.date === date && studentIds.has(a.studentId)));

  records.forEach((r: any) => {
    db.attendance.push({
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      date,
      studentId: r.studentId,
      classId: r.classId,
      status: r.status,
      remarks: r.remarks || ''
    });
  });

  storage.logAction('Attendance Saved', (req as any).user?.name || 'Teacher', `Recorded attendance for ${records.length} students on ${date}`);
  storage.save();
  res.json({ success: true, count: records.length });
});

// --- Fees Management ---
app.get('/api/fees', (req: Request, res: Response) => {
  const db = storage.getDb();
  const user = (req as any).user;

  // Student and parent can only see their own vouchers
  if (user && user.role === 'student' && user.linkedStudentId) {
    return res.json(db.feeVouchers.filter(v => v.studentId === user.linkedStudentId));
  }
  if (user && user.role === 'parent' && user.linkedStudentId) {
    return res.json(db.feeVouchers.filter(v => v.studentId === user.linkedStudentId));
  }

  res.json(db.feeVouchers);
});

app.post('/api/fees/generate-monthly', (req: Request, res: Response) => {
  const db = storage.getDb();
  const { month, dueDate } = req.body;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  let generated = 0;
  db.students.filter(s => s.status === 'Active').forEach(student => {
    const exists = db.feeVouchers.some(v => v.studentId === student.id && v.month === month);
    if (!exists) {
      const cls = db.classes.find(c => c.id === student.classId);
      const totalPayable = Math.max(0, student.monthlyFee - student.scholarshipDiscount);
      const newVch: FeeVoucher = {
        id: 'f_vch_' + Date.now() + '_' + student.id,
        voucherNumber: `VCH-${new Date().getFullYear()}-${1000 + db.feeVouchers.length + 1}`,
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        className: cls?.name || 'کلاس عمومي',
        month,
        dueDate: dueDate || '2026-10-15',
        tuitionFee: student.monthlyFee,
        admissionFee: 0,
        examFee: 0,
        hostelFee: 0,
        scholarshipDiscount: student.scholarshipDiscount,
        totalPayable,
        paidAmount: 0,
        balance: totalPayable,
        status: 'Unpaid'
      };
      db.feeVouchers.push(newVch);
      generated++;
    }
  });

  storage.logAction('Generate Fee Vouchers', (req as any).user?.name || 'Accountant', `Generated ${generated} vouchers for ${month}`);
  storage.save();

  res.json({ success: true, count: generated });
});

app.post('/api/fees/:id/pay', (req: Request, res: Response) => {
  const db = storage.getDb();
  const { id } = req.params;
  const { amount, paymentMethod, receiverName } = req.body;

  const vchIndex = db.feeVouchers.findIndex(v => v.id === id);
  if (vchIndex === -1) {
    return res.status(404).json({ error: 'Fee voucher not found' });
  }

  const vch = db.feeVouchers[vchIndex];
  const payAmt = Number(amount);
  const newPaid = vch.paidAmount + payAmt;
  const newBalance = Math.max(0, vch.totalPayable - newPaid);

  vch.paidAmount = newPaid;
  vch.balance = newBalance;
  vch.status = newBalance === 0 ? 'Paid' : 'Partial';
  vch.paymentDate = new Date().toISOString().split('T')[0];
  vch.paymentMethod = paymentMethod || 'Cash';
  vch.receiptNumber = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
  vch.receiverName = receiverName || (req as any).user?.name || 'حافظ طارق محمود';

  storage.logAction('Fee Payment Received', vch.receiverName || 'System', `Received PKR ${payAmt} for ${vch.studentName} (${vch.voucherNumber})`);
  storage.save();

  res.json(vch);
});

// --- Hifz-ul-Quran Tracker ---
app.get('/api/hifz', (req: Request, res: Response) => {
  const db = storage.getDb();
  const user = (req as any).user;

  if (user && user.role === 'student' && user.linkedStudentId) {
    return res.json(db.hifzRecords.filter(h => h.studentId === user.linkedStudentId));
  }
  if (user && user.role === 'parent' && user.linkedStudentId) {
    return res.json(db.hifzRecords.filter(h => h.studentId === user.linkedStudentId));
  }

  res.json(db.hifzRecords);
});

app.post('/api/hifz', (req: Request, res: Response) => {
  const db = storage.getDb();
  const body = req.body;

  const student = db.students.find(s => s.id === body.studentId);
  const newRecord: HifzRecord = {
    id: 'hifz_' + Date.now(),
    studentId: body.studentId,
    studentName: student?.name || body.studentName,
    rollNo: student?.rollNo || body.rollNo,
    date: body.date || new Date().toISOString().split('T')[0],
    teacherId: body.teacherId || 'tch_1',
    teacherName: body.teacherName || 'قاری محمد ابراہیم',
    sabaq: body.sabaq || { surah: 'سورۃ البقرۃ', ayaFrom: 1, ayaTo: 10, juzNumber: 1, rating: 'Mumtaz' },
    sabqi: body.sabqi || { juzNumber: 1, pagesOrQuarter: 'ربع اول', rating: 'Mumtaz' },
    manzil: body.manzil || { juzNumber: 1, quarterOrHalf: 'نصف پارہ', rating: 'Mumtaz' },
    totalJuzMemorized: Number(body.totalJuzMemorized) || 1,
    currentJuz: Number(body.currentJuz) || 1,
    remarks: body.remarks || ''
  };

  db.hifzRecords.unshift(newRecord);
  storage.logAction('Hifz Log Recorded', (req as any).user?.name || 'Teacher', `Hifz entry for ${newRecord.studentName}`);
  storage.save();

  res.status(201).json(newRecord);
});

// --- Examinations & Results ---
app.get('/api/exams', (req: Request, res: Response) => {
  res.json(storage.getDb().exams);
});

app.get('/api/exams/results', (req: Request, res: Response) => {
  const db = storage.getDb();
  const user = (req as any).user;

  if (user && user.role === 'student' && user.linkedStudentId) {
    return res.json(db.examResults.filter(r => r.studentId === user.linkedStudentId));
  }
  if (user && user.role === 'parent' && user.linkedStudentId) {
    return res.json(db.examResults.filter(r => r.studentId === user.linkedStudentId));
  }

  res.json(db.examResults);
});

app.post('/api/exams/results', (req: Request, res: Response) => {
  const db = storage.getDb();
  const body = req.body;

  const student = db.students.find(s => s.id === body.studentId);
  const exam = db.exams.find(e => e.id === body.examId);
  const cls = db.classes.find(c => c.id === body.classId);

  const subjects = body.subjects || [];
  const totalMarks = subjects.reduce((a: number, b: any) => a + (Number(b.totalMarks) || 0), 0);
  const obtainedMarks = subjects.reduce((a: number, b: any) => a + (Number(b.obtainedMarks) || 0), 0);
  const percentage = totalMarks > 0 ? parseFloat(((obtainedMarks / totalMarks) * 100).toFixed(1)) : 0;

  let grade: ExamResult['grade'] = 'Maqbool (C)';
  if (percentage >= 90) grade = 'Mumtaz (A+)';
  else if (percentage >= 80) grade = 'Jayyid Jiddan (A)';
  else if (percentage >= 65) grade = 'Jayyid (B)';
  else if (percentage >= 50) grade = 'Maqbool (C)';
  else grade = 'Rasib (Fail)';

  const newResult: ExamResult = {
    id: 'res_' + Date.now(),
    examId: body.examId,
    examTitle: exam?.title || body.examTitle,
    studentId: body.studentId,
    studentName: student?.name || body.studentName,
    rollNo: student?.rollNo || body.rollNo,
    classId: body.classId,
    className: cls?.name || body.className,
    subjects,
    totalMarks,
    obtainedMarks,
    percentage,
    grade,
    position: body.position || '',
    teacherRemarks: body.teacherRemarks || 'ماشاء اللہ کارکردگی قابل اطمینان ہے'
  };

  db.examResults.push(newResult);
  storage.logAction('Exam Result Recorded', (req as any).user?.name || 'Teacher', `Result saved for ${newResult.studentName} (${newResult.grade})`);
  storage.save();

  res.status(201).json(newResult);
});

// --- Announcements ---
app.get('/api/announcements', (req: Request, res: Response) => {
  res.json(storage.getDb().announcements);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const db = storage.getDb();
  const body = req.body;

  const newAnn: Announcement = {
    id: 'anc_' + Date.now(),
    titleUrdu: body.titleUrdu || '',
    titleEn: body.titleEn || '',
    titleAr: body.titleAr || '',
    contentUrdu: body.contentUrdu || '',
    contentEn: body.contentEn || '',
    contentAr: body.contentAr || '',
    date: new Date().toISOString().split('T')[0],
    category: body.category || 'General',
    targetRoles: body.targetRoles || ['student', 'parent', 'teacher']
  };

  db.announcements.unshift(newAnn);
  storage.logAction('Announcement Published', (req as any).user?.name || 'Admin', newAnn.titleUrdu);
  storage.save();

  res.status(201).json(newAnn);
});

// --- Backup & Restore & Reset ---
app.get('/api/backup/download', (req: Request, res: Response) => {
  const data = storage.getDb();
  res.setHeader('Content-Disposition', `attachment; filename=taleem_ul_quran_backup_${Date.now()}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data, null, 2));
});

app.post('/api/backup/restore', (req: Request, res: Response) => {
  const success = storage.restore(req.body);
  if (!success) {
    return res.status(400).json({ error: 'فائل کی ساخت درست نہیں ہے (Invalid backup file structure)' });
  }
  res.json({ success: true, message: 'ڈیٹا کامیابی سے بحال کر دیا گیا ہے' });
});

app.post('/api/backup/reset', (req: Request, res: Response) => {
  const data = storage.resetToDefault();
  res.json({ success: true, message: 'ڈیٹا فیکٹری حالت پر بحال ہو چکا ہے', data });
});

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(storage.getDb().settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const db = storage.getDb();
  db.settings = { ...db.settings, ...req.body };
  storage.logAction('Settings Updated', (req as any).user?.name || 'Admin', 'Updated campus contact & bank info');
  storage.save();
  res.json(db.settings);
});

// Production Vite Build or Dev Vite Middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Taleem Ul Quran Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
