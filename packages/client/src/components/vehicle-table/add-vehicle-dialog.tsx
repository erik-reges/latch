"use client";

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

export function AddVehicleDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = async (data: VehicleFormValues) => {
    const { data: createdVehicle, error } = await api.vehicles.post({
      ...data,
    });

    if (!error) {
      setOpen(false);
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["vehicles-all"] }),
      queryClient.invalidateQueries({ queryKey: ["vehicles-paginated"] }),
      queryClient.invalidateQueries({ queryKey: ["vehicles-count"] }),
    ]);

    queryClient.setQueryData(["table-state"], { pageIndex: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
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
