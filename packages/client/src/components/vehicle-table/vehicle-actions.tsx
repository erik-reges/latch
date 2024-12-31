import { Settings, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleForm } from "./vehicle-form";
import { api } from "@/main";
import { useQueryClient } from "@tanstack/react-query";
import { type VehicleFormValues } from "./vehicle-schema";
import type { Vehicle } from "@latch/db/drizzle/auth-schema";

interface VehicleActionsProps {
  vehicle: Vehicle;
  queryKey: string;
}

export function VehicleActions({ vehicle, queryKey }: VehicleActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const { error } = await api.vehicles({ id: vehicle.id }).delete();

    if (!error) {
      setShowDeleteDialog(false);
      setDropdownOpen(false);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  };

  const handleEdit = async (data: VehicleFormValues) => {
    const { error } = await api.vehicles({ id: vehicle.id }).patch({
      ...data,
    });

    if (!error) {
      setShowEditDialog(false);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  };

  const handleDialogChange = (open: boolean) => {
    setShowEditDialog(open);
    setDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="p-0 " variant="ghost" size="icon">
            <Settings className="h-2 w-2" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setShowEditDialog(true);
              setDropdownOpen(false);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setShowDeleteDialog(true);
              setDropdownOpen(false);
            }}
            className="text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vehicle {vehicle.name} from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Make changes to the vehicle details below.
            </DialogDescription>
          </DialogHeader>
          <VehicleForm onSubmit={handleEdit} defaultValues={vehicle} />
        </DialogContent>
      </Dialog>
    </>
  );
}
