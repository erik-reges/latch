import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { format } from "date-fns";
import {
  vehicleSchema,
  type VehicleFormValues,
} from "@/components/vehicle-table/vehicle-schema";

interface UseVehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (data: VehicleFormValues) => Promise<void>;
}

export function useVehicleForm({
  defaultValues,
  onSubmit,
}: UseVehicleFormProps) {
  const form = useForm<VehicleFormValues>({
    resolver: typeboxResolver(vehicleSchema),
    defaultValues: {
      status: "active",
      maxSpeed: 0,
      yearManufactured: new Date().getFullYear(),
      lastMaintenanceDate: null,
      nextMaintenanceDate: null,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: VehicleFormValues) => {
    const formattedData = {
      ...data,
      lastMaintenanceDate: data.lastMaintenanceDate
        ? format(new Date(data.lastMaintenanceDate), "yyyy-MM-dd")
        : null,
      nextMaintenanceDate: data.nextMaintenanceDate
        ? format(new Date(data.nextMaintenanceDate), "yyyy-MM-dd")
        : null,
    };
    await onSubmit(formattedData);
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
