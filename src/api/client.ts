import { 
  User, Student, AdmissionApplication, MadrasaClass, Teacher, 
  AttendanceRecord, FeeVoucher, Exam, ExamResult, HifzRecord, 
  Announcement 
} from '../types';

const TOKEN_KEY = 'taleem_ul_quran_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeStoredToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: async (username: string, password?: string) => {
    const data = await request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setStoredToken(data.token);
    return data;
  },

  getCurrentUser: async () => {
    return request<{ user: User }>('/api/auth/me');
  },

  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  // Stats
  getStats: () => request<any>('/api/stats'),

  // Admissions
  applyAdmission: (formData: Partial<AdmissionApplication>) =>
    request<{ success: boolean; message: string; application: AdmissionApplication }>('/api/admissions/apply', {
      method: 'POST',
      body: JSON.stringify(formData)
    }),

  getAdmissions: () => request<AdmissionApplication[]>('/api/admissions'),

  updateAdmissionStatus: (id: string, status: 'Approved' | 'Rejected', classId?: string, rollNo?: string) =>
    request<AdmissionApplication>(`/api/admissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, classId, rollNo })
    }),

  // Students
  getStudents: () => request<Student[]>('/api/students'),
  createStudent: (student: Partial<Student>) =>
    request<Student>('/api/students', {
      method: 'POST',
      body: JSON.stringify(student)
    }),
  updateStudent: (id: string, updates: Partial<Student>) =>
    request<Student>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
  deleteStudent: (id: string) =>
    request<{ success: boolean }>(`/api/students/${id}`, {
      method: 'DELETE'
    }),

  // Classes & Teachers
  getClasses: () => request<MadrasaClass[]>('/api/classes'),
  createClass: (cls: Partial<MadrasaClass>) =>
    request<MadrasaClass>('/api/classes', {
      method: 'POST',
      body: JSON.stringify(cls)
    }),
  getTeachers: () => request<Teacher[]>('/api/teachers'),
  createTeacher: (tch: Partial<Teacher>) =>
    request<Teacher>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(tch)
    }),

  // Attendance
  getAttendance: (date?: string, classId?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (classId) params.append('classId', classId);
    return request<AttendanceRecord[]>(`/api/attendance?${params.toString()}`);
  },
  saveBulkAttendance: (date: string, records: { studentId: string; classId: string; status: string; remarks?: string }[]) =>
    request<{ success: boolean; count: number }>('/api/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify({ date, records })
    }),

  // Fees
  getFees: () => request<FeeVoucher[]>('/api/fees'),
  generateMonthlyFees: (month: string, dueDate: string) =>
    request<{ success: boolean; count: number }>('/api/fees/generate-monthly', {
      method: 'POST',
      body: JSON.stringify({ month, dueDate })
    }),
  payFee: (id: string, amount: number, paymentMethod: string, receiverName?: string) =>
    request<FeeVoucher>(`/api/fees/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod, receiverName })
    }),

  // Hifz Tracker
  getHifzRecords: () => request<HifzRecord[]>('/api/hifz'),
  addHifzRecord: (record: Partial<HifzRecord>) =>
    request<HifzRecord>('/api/hifz', {
      method: 'POST',
      body: JSON.stringify(record)
    }),

  // Exams
  getExams: () => request<Exam[]>('/api/exams'),
  getExamResults: () => request<ExamResult[]>('/api/exams/results'),
  saveExamResult: (result: Partial<ExamResult>) =>
    request<ExamResult>('/api/exams/results', {
      method: 'POST',
      body: JSON.stringify(result)
    }),

  // Announcements
  getAnnouncements: () => request<Announcement[]>('/api/announcements'),
  createAnnouncement: (ann: Partial<Announcement>) =>
    request<Announcement>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(ann)
    }),

  // Settings & Backup
  getSettings: () => request<any>('/api/settings'),
  updateSettings: (settings: any) =>
    request<any>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),
  restoreBackup: (data: any) =>
    request<{ success: boolean; message: string }>('/api/backup/restore', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  resetBackup: () =>
    request<{ success: boolean; message: string }>('/api/backup/reset', {
      method: 'POST'
    })
};
