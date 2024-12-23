import { Type } from "@sinclair/typebox";

export type VehicleStatus = "active" | "maintenance" | "decommissioned";

export const vehicleSchema = Type.Object({
  name: Type.String({
    minLength: 1,
    description: "Vehicle name",
  }),
  model: Type.String({
    minLength: 1,
    description: "Vehicle model number/name",
  }),
  maxSpeed: Type.Number({
    minimum: 0,
    description: "Maximum speed in km/h",
  }),
  maxWeight: Type.String({
    description: "Maximum weight capacity in kg",
  }),
  length: Type.String({
    description: "Vehicle length in meters",
  }),
  manufacturer: Type.String({
    minLength: 1,
    description: "Vehicle manufacturer name",
  }),
  yearManufactured: Type.Number({
    minimum: 1900,
    maximum: new Date().getFullYear(),
    description: "Year the vehicle was manufactured",
  }),
  status: Type.Enum(
    {
      active: "active",
      maintenance: "maintenance",
      decommissioned: "decommissioned",
    } as const,
    {
      default: "active",
      description: "Current operational status",
    },
  ),
  lastMaintenanceDate: Type.Union([
    Type.String({
      description: "Date of last maintenance check",
    }),
    Type.Null(),
  ]),
  nextMaintenanceDate: Type.Union([
    Type.String({
      description: "Scheduled date for next maintenance",
    }),
    Type.Null(),
  ]),
});

export type VehicleFormValues = typeof vehicleSchema.static;

export interface VehicleRecord extends VehicleFormValues {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
