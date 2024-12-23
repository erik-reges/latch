import {
  createSchema,
  createTableSchema,
  definePermissions,
  type ExpressionBuilder,
  ANYONE_CAN,
} from "@rocicorp/zero";

const userSchema = createTableSchema({
  tableName: "user",
  columns: {
    id: "string",
    name: "string",
    email: "string",
    emailVerified: "boolean",
    image: { type: "string", optional: true },
    createdAt: "number", // timestamp converted to number
    updatedAt: "number",
  },
  primaryKey: "id",
});

const vehicleSchema = createTableSchema({
  tableName: "vehicles",
  columns: {
    id: "string",
    name: "string",
    model: "string",
    maxSpeed: "number",
    maxWeight: "number",
    length: "number",
    manufacturer: "string",
    yearManufactured: "number",
    status: "string",
    lastMaintenanceDate: { type: "string", optional: true },
    nextMaintenanceDate: { type: "string", optional: true },
    createdAt: "number",
    updatedAt: "number",
  },
  primaryKey: "id",
});

export const schema = createSchema({
  version: 1,
  tables: {
    user: userSchema,
    vehicles: vehicleSchema,
  },
});

// Define permissions
export const permissions = definePermissions<{ sub: string }, typeof schema>(
  schema,
  () => ({
    user: {
      row: {
        select: [allowIfSelf],
        insert: [allowIfAuthenticated],
        delete: [allowIfSelf],
      },
    },
    vehicles: {
      row: {
        select: [allowIfAuthenticated],
        delete: [allowIfAuthenticated],

        update: {
          preMutation: [allowIfAuthenticated],
        },
        insert: [allowIfAuthenticated],
      },
    },
  }),
);

// Permission helpers
const allowIfSelf = (
  auth: { sub: string },
  { cmp }: ExpressionBuilder<typeof userSchema>,
) => cmp("id", "=", auth.sub);

const allowIfAuthenticated = (
  auth: { sub: string },
  { cmpLit }: ExpressionBuilder<any>,
) => cmpLit(auth.sub, "IS NOT", null);
