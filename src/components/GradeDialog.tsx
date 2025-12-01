import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addGrade, updateGrade, getStudents, getClasses } from "@/lib/storage";
import { Grade } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface GradeDialogProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  grade?: Grade | null;
}

export const GradeDialog = ({ open, onClose, grade }: GradeDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Grade>>({
    studentId: "",
    classId: "",
    subject: "",
    score: 0,
    maxScore: 100,
    date: new Date().toISOString().split("T")[0],
    term: "",
  });

  const students = getStudents();
  const classes = getClasses();

  useEffect(() => {
    if (grade) {
      setFormData(grade);
    } else {
      setFormData({
        studentId: "",
        classId: "",
        subject: "",
        score: 0,
        maxScore: 100,
        date: new Date().toISOString().split("T")[0],
        term: "",
      });
    }
  }, [grade, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (grade) {
      updateGrade(grade.id, formData as Grade);
      toast({
        title: "Grade updated",
        description: "The grade has been updated successfully.",
      });
    } else {
      const newGrade: Grade = {
        ...formData,
        id: crypto.randomUUID(),
      } as Grade;
      addGrade(newGrade);
      toast({
        title: "Grade added",
        description: "New grade has been added successfully.",
      });
    }
    
    onClose(true);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{grade ? "Edit Grade" : "Add New Grade"}</DialogTitle>
          <DialogDescription>
            {grade ? "Update grade information" : "Enter the details for the new grade"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student *</Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) => setFormData({ ...formData, studentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Class *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData({ ...formData, classId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="score">Score *</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Max Score *</Label>
                <Input
                  id="maxScore"
                  type="number"
                  min="1"
                  value={formData.maxScore}
                  onChange={(e) => setFormData({ ...formData, maxScore: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term *</Label>
              <Select
                value={formData.term}
                onValueChange={(value) => setFormData({ ...formData, term: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1">Quarter 1</SelectItem>
                  <SelectItem value="Q2">Quarter 2</SelectItem>
                  <SelectItem value="Q3">Quarter 3</SelectItem>
                  <SelectItem value="Q4">Quarter 4</SelectItem>
                  <SelectItem value="Midterm">Midterm</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit">{grade ? "Update" : "Add"} Grade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
