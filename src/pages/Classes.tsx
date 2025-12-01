import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getClasses, deleteClass } from "@/lib/storage";
import { Class } from "@/lib/types";
import { Card } from "@/components/ui/card";
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
import { ClassDialog } from "@/components/ClassDialog";
import { useToast } from "@/hooks/use-toast";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const loadClasses = () => {
    setClasses(getClasses());
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleDelete = () => {
    if (classToDelete) {
      deleteClass(classToDelete);
      loadClasses();
      toast({
        title: "Class deleted",
        description: "The class has been removed successfully.",
      });
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setDialogOpen(true);
  };

  const handleDialogClose = (refresh?: boolean) => {
    setDialogOpen(false);
    setEditingClass(null);
    if (refresh) {
      loadClasses();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Classes</h2>
          <p className="mt-1 text-muted-foreground">Manage your class schedules</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="p-6 transition-all hover:shadow-md">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{classItem.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Grade {classItem.grade} • {classItem.academicYear}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teacher:</span>
                  <span className="font-medium text-foreground">{classItem.teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium text-foreground">{classItem.capacity} students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-medium text-foreground">{classItem.schedule}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(classItem)}
                  className="flex-1 gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setClassToDelete(classItem.id);
                    setDeleteDialogOpen(true);
                  }}
                  className="flex-1 gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {classes.length === 0 && (
          <Card className="col-span-full p-12 text-center">
            <p className="text-muted-foreground">No classes created yet. Add your first class to get started.</p>
          </Card>
        )}
      </div>

      <ClassDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        classItem={editingClass}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class.
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
