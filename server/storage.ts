import fs from 'fs';
import path from 'path';
import { 
  User, Student, AdmissionApplication, MadrasaClass, Teacher, 
  AttendanceRecord, TeacherAttendance, FeeVoucher, Exam, ExamResult, 
  HifzRecord, Announcement 
} from '../src/types';
import { 
  initialUsers, initialStudents, initialAdmissions, initialClasses, 
  initialTeachers, initialAttendance, initialTeacherAttendance, 
  initialFeeVouchers, initialExams, initialExamResults, initialHifzRecords, 
  initialAnnouncements 
} from './seedData';

export interface DatabaseSchema {
  users: User[];
  students: Student[];
  admissions: AdmissionApplication[];
  classes: MadrasaClass[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  teacherAttendance: TeacherAttendance[];
  feeVouchers: FeeVoucher[];
  exams: Exam[];
  examResults: ExamResult[];
  hifzRecords: HifzRecord[];
  announcements: Announcement[];
  auditLogs: { id: string; timestamp: string; action: string; user: string; details: string }[];
  settings: {
    campusName: string;
    campusNameUrdu: string;
    phone: string;
    email: string;
    address: string;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    backupLastExported?: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

class StorageManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.getDefaultData();
    this.init();
  }

  private getDefaultData(): DatabaseSchema {
    return {
      users: [...initialUsers],
      students: [...initialStudents],
      admissions: [...initialAdmissions],
      classes: [...initialClasses],
      teachers: [...initialTeachers],
      attendance: [...initialAttendance],
      teacherAttendance: [...initialTeacherAttendance],
      feeVouchers: [...initialFeeVouchers],
      exams: [...initialExams],
      examResults: [...initialExamResults],
      hifzRecords: [...initialHifzRecords],
      announcements: [...initialAnnouncements],
      auditLogs: [
        {
          id: 'log_1',
          timestamp: new Date().toISOString(),
          action: 'System Boot',
          user: 'System',
          details: 'Taleem Ul Quran Campus database initialized successfully'
        }
      ],
      settings: {
        campusName: 'Taleem Ul Quran Campus',
        campusNameUrdu: 'جامعہ تعلیم القرآن کیمپس',
        phone: '+92 42 35889900 / 0300-1234567',
        email: 'info@taleemulquran.edu.pk',
        address: 'Main Boulevard, Madina Town, Lahore, Pakistan',
        bankName: 'Meezan Islamic Bank',
        accountTitle: 'Taleem Ul Quran Trust',
        accountNumber: '0201-01048892019'
      }
    };
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.saveSync();
      }
    } catch (err) {
      console.error('Error initializing storage:', err);
      this.data = this.getDefaultData();
    }
  }

  private saveSync() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getDb(): DatabaseSchema {
    return this.data;
  }

  public save() {
    this.saveSync();
  }

  public logAction(action: string, user: string, details: string) {
    this.data.auditLogs.unshift({
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      action,
      user,
      details
    });
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.save();
  }

  public restore(importedData: DatabaseSchema): boolean {
    if (!importedData.students || !importedData.users) {
      return false;
    }
    this.data = importedData;
    this.logAction('Database Restored', 'Administrator', 'Database replaced from backup file');
    this.save();
    return true;
  }

  public resetToDefault(): DatabaseSchema {
    this.data = this.getDefaultData();
    this.logAction('Database Reset', 'Administrator', 'Database restored to initial seed state');
    this.save();
    return this.data;
  }
}

export const storage = new StorageManager();
