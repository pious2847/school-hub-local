import { Student, Class, Grade } from "./types";

const STORAGE_KEYS = {
  STUDENTS: "school_students",
  CLASSES: "school_classes",
  GRADES: "school_grades",
};

// Generic storage functions
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Students
export const getStudents = (): Student[] => getFromStorage<Student>(STORAGE_KEYS.STUDENTS);

export const saveStudents = (students: Student[]): void => {
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
};

export const addStudent = (student: Student): void => {
  const students = getStudents();
  students.push(student);
  saveStudents(students);
};

export const updateStudent = (id: string, updatedStudent: Student): void => {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index !== -1) {
    students[index] = updatedStudent;
    saveStudents(students);
  }
};

export const deleteStudent = (id: string): void => {
  const students = getStudents();
  const filtered = students.filter((s) => s.id !== id);
  saveStudents(filtered);
};

// Classes
export const getClasses = (): Class[] => getFromStorage<Class>(STORAGE_KEYS.CLASSES);

export const saveClasses = (classes: Class[]): void => {
  saveToStorage(STORAGE_KEYS.CLASSES, classes);
};

export const addClass = (classData: Class): void => {
  const classes = getClasses();
  classes.push(classData);
  saveClasses(classes);
};

export const updateClass = (id: string, updatedClass: Class): void => {
  const classes = getClasses();
  const index = classes.findIndex((c) => c.id === id);
  if (index !== -1) {
    classes[index] = updatedClass;
    saveClasses(classes);
  }
};

export const deleteClass = (id: string): void => {
  const classes = getClasses();
  const filtered = classes.filter((c) => c.id !== id);
  saveClasses(filtered);
};

// Grades
export const getGrades = (): Grade[] => getFromStorage<Grade>(STORAGE_KEYS.GRADES);

export const saveGrades = (grades: Grade[]): void => {
  saveToStorage(STORAGE_KEYS.GRADES, grades);
};

export const addGrade = (grade: Grade): void => {
  const grades = getGrades();
  grades.push(grade);
  saveGrades(grades);
};

export const updateGrade = (id: string, updatedGrade: Grade): void => {
  const grades = getGrades();
  const index = grades.findIndex((g) => g.id === id);
  if (index !== -1) {
    grades[index] = updatedGrade;
    saveGrades(grades);
  }
};

export const deleteGrade = (id: string): void => {
  const grades = getGrades();
  const filtered = grades.filter((g) => g.id !== id);
  saveGrades(filtered);
};
