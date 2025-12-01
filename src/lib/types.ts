export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  grade: string;
  classId: string;
  enrollmentDate: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
}

export interface Class {
  id: string;
  name: string;
  teacherName: string;
  grade: string;
  academicYear: string;
  capacity: number;
  schedule: string;
}

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  term: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  averageGrade: number;
}
