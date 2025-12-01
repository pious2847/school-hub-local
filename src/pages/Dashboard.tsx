import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { getStudents, getClasses, getGrades } from "@/lib/storage";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Student, Class, Grade } from "@/lib/types";

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
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
