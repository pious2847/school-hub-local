import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getGrades, deleteGrade, getStudents, getClasses } from "@/lib/storage";
import { Grade } from "@/lib/types";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GradeDialog } from "@/components/GradeDialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const students = getStudents();
  const classes = getClasses();

  const loadGrades = () => {
    setGrades(getGrades());
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const handleDelete = () => {
    if (gradeToDelete) {
      deleteGrade(gradeToDelete);
      loadGrades();
      toast({
        title: "Grade deleted",
        description: "The grade has been removed successfully.",
      });
      setDeleteDialogOpen(false);
      setGradeToDelete(null);
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setDialogOpen(true);
  };

  const handleDialogClose = (refresh?: boolean) => {
    setDialogOpen(false);
    setEditingGrade(null);
    if (refresh) {
      loadGrades();
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
  };

  const getClassName = (classId: string) => {
    const classItem = classes.find((c) => c.id === classId);
    return classItem ? classItem.name : "Unknown";
  };

  const getGradePercentage = (score: number, maxScore: number) => {
    return Math.round((score / maxScore) * 100);
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-success">A</Badge>;
    if (percentage >= 80) return <Badge className="bg-primary">B</Badge>;
    if (percentage >= 70) return <Badge className="bg-warning">C</Badge>;
    if (percentage >= 60) return <Badge variant="secondary">D</Badge>;
    return <Badge variant="destructive">F</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Grades</h2>
          <p className="mt-1 text-muted-foreground">Track student performance</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Grade
        </Button>
      </div>

      <Card className="p-6">
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => {
                const percentage = getGradePercentage(grade.score, grade.maxScore);
                return (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{getStudentName(grade.studentId)}</TableCell>
                    <TableCell>{getClassName(grade.classId)}</TableCell>
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell>
                      {grade.score}/{grade.maxScore}
                    </TableCell>
                    <TableCell>{percentage}%</TableCell>
                    <TableCell>{getGradeBadge(percentage)}</TableCell>
                    <TableCell>{grade.term}</TableCell>
                    <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(grade)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGradeToDelete(grade.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {grades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No grades recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <GradeDialog open={dialogOpen} onClose={handleDialogClose} grade={editingGrade} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the grade record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
