import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VehicleForm } from "@/components/vehicle-table/vehicle-form";
import { api } from "@/main";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { VehicleFormValues } from "./vehicle-schema";

export function AddVehicleDialog({ queryKey }: { queryKey: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = async (data: VehicleFormValues) => {
    const { error } = await api.vehicles.post({ ...data });

    if (!error) {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs h-8 px-3 sm:px-3">
          <PlusIcon className="mr-1 " />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new vehicle to the fleet.
          </DialogDescription>
        </DialogHeader>
        <VehicleForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
