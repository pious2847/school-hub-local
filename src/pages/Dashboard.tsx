import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { getStudents, getClasses, getGrades } from "@/lib/storage";
import { Users, BookOpen, Award, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Student, Class, Grade } from "@/lib/types";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    setStudents(getStudents());
    setClasses(getClasses());
    setGrades(getGrades());
  }, []);

  const calculateAverageGrade = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
    return Math.round(total / grades.length);
  };

  const uniqueTeachers = new Set(classes.map((c) => c.teacherName)).size;

  // Grade Distribution Data
  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    grades.forEach((grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      if (percentage >= 90) distribution.A++;
      else if (percentage >= 80) distribution.B++;
      else if (percentage >= 70) distribution.C++;
      else if (percentage >= 60) distribution.D++;
      else distribution.F++;
    });
    return [
      { name: "A (90-100%)", value: distribution.A, color: "hsl(var(--success))" },
      { name: "B (80-89%)", value: distribution.B, color: "hsl(var(--primary))" },
      { name: "C (70-79%)", value: distribution.C, color: "hsl(var(--warning))" },
      { name: "D (60-69%)", value: distribution.D, color: "hsl(var(--secondary))" },
      { name: "F (<60%)", value: distribution.F, color: "hsl(var(--destructive))" },
    ].filter((item) => item.value > 0);
  };

  // Students by Grade Level
  const getStudentsByGrade = () => {
    const gradeCount: Record<string, number> = {};
    students.forEach((student) => {
      gradeCount[student.grade] = (gradeCount[student.grade] || 0) + 1;
    });
    return Object.entries(gradeCount)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([grade, count]) => ({ grade: `Grade ${grade}`, students: count }));
  };

  // Performance by Subject
  const getPerformanceBySubject = () => {
    const subjectPerformance: Record<string, { total: number; count: number }> = {};
    grades.forEach((grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      if (!subjectPerformance[grade.subject]) {
        subjectPerformance[grade.subject] = { total: 0, count: 0 };
      }
      subjectPerformance[grade.subject].total += percentage;
      subjectPerformance[grade.subject].count++;
    });
    return Object.entries(subjectPerformance)
      .map(([subject, data]) => ({
        subject,
        average: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.average - a.average);
  };

  // Enrollment Trends (simulated monthly data)
  const getEnrollmentTrends = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      // Simulate enrollment growth over time
      const enrollmentCount = Math.max(
        0,
        students.length - (months.length - index - 1) * 3
      );
      return {
        month,
        students: enrollmentCount,
      };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's an overview of your school.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={<Users className="h-6 w-6" />}
          description="Enrolled students"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatCard
          title="Total Classes"
          value={classes.length}
          icon={<BookOpen className="h-6 w-6" />}
          description="Active classes"
        />
        <StatCard
          title="Teachers"
          value={uniqueTeachers}
          icon={<Users className="h-6 w-6" />}
          description="Teaching staff"
        />
        <StatCard
          title="Average Grade"
          value={`${calculateAverageGrade()}%`}
          icon={<Award className="h-6 w-6" />}
          description="Overall performance"
          trend={{ value: "+5%", isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grade Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Grade Distribution</h3>
          </div>
          {grades.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={getGradeDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getGradeDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No grade data available
            </div>
          )}
        </Card>

        {/* Enrollment Trends */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Enrollment Trends</h3>
          </div>
          {students.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getEnrollmentTrends()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No enrollment data available
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Students by Grade */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Students by Grade Level</h3>
          </div>
          {students.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getStudentsByGrade()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No student data available
            </div>
          )}
        </Card>

        {/* Performance by Subject */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Average Performance by Subject</h3>
          </div>
          {grades.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getPerformanceBySubject()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="subject" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="average" fill="hsl(var(--secondary))" radius={[0, 8, 8, 0]} name="Average %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No grade data available
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Students</h3>
          </div>
          <div className="space-y-4">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{`${student.firstName} ${student.lastName}`}</p>
                  <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                </span>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No students enrolled yet
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Active Classes</h3>
          </div>
          <div className="space-y-4">
            {classes.slice(0, 5).map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{classItem.name}</p>
                  <p className="text-sm text-muted-foreground">Teacher: {classItem.teacherName}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  Grade {classItem.grade}
                </span>
              </div>
            ))}
            {classes.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No classes created yet
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
