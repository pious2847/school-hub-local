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
import { addClass, updateClass } from "@/lib/storage";
import { Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ClassDialogProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  classItem?: Class | null;
}

export const ClassDialog = ({ open, onClose, classItem }: ClassDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Class>>({
    name: "",
    teacherName: "",
    grade: "",
    academicYear: new Date().getFullYear().toString(),
    capacity: 30,
    schedule: "",
  });

  useEffect(() => {
    if (classItem) {
      setFormData(classItem);
    } else {
      setFormData({
        name: "",
        teacherName: "",
        grade: "",
        academicYear: new Date().getFullYear().toString(),
        capacity: 30,
        schedule: "",
      });
    }
  }, [classItem, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (classItem) {
      updateClass(classItem.id, formData as Class);
      toast({
        title: "Class updated",
        description: "The class information has been updated successfully.",
      });
    } else {
      const newClass: Class = {
        ...formData,
        id: crypto.randomUUID(),
      } as Class;
      addClass(newClass);
      toast({
        title: "Class added",
        description: "New class has been added successfully.",
      });
    }
    
    onClose(true);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{classItem ? "Edit Class" : "Add New Class"}</DialogTitle>
          <DialogDescription>
            {classItem ? "Update class information" : "Enter the details for the new class"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherName">Teacher Name *</Label>
              <Input
                id="teacherName"
                placeholder="e.g., Dr. John Smith"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => setFormData({ ...formData, grade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year *</Label>
              <Input
                id="academicYear"
                placeholder="e.g., 2024-2025"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule *</Label>
              <Input
                id="schedule"
                placeholder="e.g., Mon/Wed/Fri 9:00-10:30"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit">{classItem ? "Update" : "Add"} Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
