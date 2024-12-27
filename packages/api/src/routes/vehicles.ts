import Elysia, { t } from "elysia";
import { vehicles, type Vehicle } from "@latch/db/drizzle/auth-schema";
import { createId } from "@paralleldrive/cuid2";
import { asc, desc, eq, gt, sql } from "drizzle-orm";
import { userMiddleware } from "@latch/api/lib/middleware";
import { dbPlugin } from "@latch/api/lib/db";
import type { PgInteger } from "drizzle-orm/pg-core";

export const vehicleSchema = t.Object({
  name: t.String(),
  model: t.String(),
  maxSpeed: t.Number(),
  maxWeight: t.String(),
  length: t.String(),
  manufacturer: t.String(),
  yearManufactured: t.Number(),
  status: t.Optional(
    t.Enum(
      {
        active: "active",
        maintenance: "maintenance",
        decommissioned: "decommissioned",
      },
      { default: "active" },
    ),
  ),
  lastMaintenanceDate: t.Union([t.Null(), t.String()]),
  nextMaintenanceDate: t.Union([t.Null(), t.String()]),
});

const updateVehicleSchema = t.Partial(vehicleSchema);
export const vehiclesRouter = new Elysia({
  prefix: "/vehicles",
})
  // .use(userMiddleware)
  .use(dbPlugin)
  .get("/count", async ({ db }) => {
    const count = await db
      .select({ count: sql`cast(count(*) as integer)` })
      .from(vehicles)
      .then((res) => res[0].count);

    return count;
  })
  .get(
    "/page",
    async ({ query, db }) => {
      const page = Number(query.cursor) || 0;
      const pageSize = 10;
      const offset = page * pageSize;
      const sortField = query.sortField
        ? (query.sortField as keyof Vehicle)
        : "yearManufactured";

      // Build the order by clause
      let orderByClause;
      if (sortField === "yearManufactured") {
        orderByClause = sql`${vehicles[sortField]}::int ${
          query.sortOrder === "desc" ? sql`DESC` : sql`ASC`
        }`;
      } else {
        orderByClause =
          query.sortOrder === "desc"
            ? desc(vehicles[sortField])
            : asc(vehicles[sortField]);
      }

      const res = await db
        .select()
        .from(vehicles)
        .offset(offset)
        .limit(pageSize)
        .orderBy(orderByClause);

      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(vehicles)
        .then((res) => res[0].count);

      const data = {
        data: res,
        nextCursor: offset + pageSize < totalCount ? page + 1 : undefined,
        hasMore: offset + pageSize < totalCount,
        totalCount,
      };

      return data;
    },
    {
      query: t.Object({
        cursor: t.Optional(t.String()),
        sortField: t.Optional(t.String()),
        sortOrder: t.Optional(t.String()),
      }),
    },
  )
  .get("", async ({ db }) => {
    return await db.select().from(vehicles).orderBy(asc(vehicles.id)).limit(10);
  })
  .get(
    "/:id",
    async ({ params: { id }, db }) => {
      return await db.select().from(vehicles).where(eq(vehicles.id, id));
    },
    { params: t.Object({ id: t.String() }) },
  )
  .post(
    "",
    async ({ body, db }) => {
      const vehicle = await db
        .insert(vehicles)
        .values({
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return vehicle[0];
    },
    { body: vehicleSchema },
  )
  .put(
    "/:id",
    async ({ params: { id }, body, db }) => {
      const vehicle = await db
        .update(vehicles)
        .set(body)
        .where(eq(vehicles.id, id))
        .returning();
      return vehicle[0];
    },
    {
      params: t.Object({ id: t.String() }),
      body: updateVehicleSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, db }) => {
      const vehicle = await db
        .delete(vehicles)
        .where(eq(vehicles.id, id))
        .returning();
      return vehicle[0];
    },
    { params: t.Object({ id: t.String() }) },
  );

// Add these arrays at the top of your file
const manufacturerNames = [
  "TrainCo",
  "SpeedRail Inc",
  "RockRail Solutions",
  "MetroTrain",
  "FrostRail",
  "HeatWave Transit",
  "OceanTrack",
  "GreenTrail Systems",
  "AlpineRail",
  "CityRail",
  "GlobalRail",
  "TechTrain",
  "InnoRail",
  "PrecisionRail",
  "MegaTrain Industries",
];

const modelPrefixes = [
  "High Speed",
  "Rapid",
  "Terrain",
  "City",
  "Polar",
  "Sand",
  "Sea",
  "Woodland",
  "Mountain",
  "Metro",
  "Ultra",
  "Advanced",
  "Smart",
  "Elite",
  "Premium",
];

const modelSuffixes = [
  "X",
  "Z",
  "Master",
  "Glider",
  "Express",
  "Cruiser",
  "Prime",
  "Shuttle",
  "Elite",
  "Speed",
  "Pro",
  "Plus",
  "Max",
  "Ultra",
  "Supreme",
];

const namePrefix = [
  "Express",
  "Bullet",
  "Mountain",
  "Urban",
  "Arctic",
  "Desert",
  "Coastal",
  "Forest",
  "High Altitude",
  "Metro",
  "Valley",
  "Summit",
  "Ocean",
  "Prairie",
  "Canyon",
];

const nameSuffix = [
  "Liner",
  "Crawler",
  "Commuter",
  "Explorer",
  "Voyager",
  "Runner",
  "Ranger",
  "Sprinter",
  "Cruiser",
  "Transit",
  "Express",
  "Glider",
  "Shuttle",
  "Rocket",
  "Arrow",
];

// Add this helper function
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomVehicle() {
  const status = getRandomElement([
    "active",
    "maintenance",
    "decommissioned",
  ] as const);
  const hasMaintenanceDates = status !== "decommissioned";
  const now = new Date();

  const lastMaintenanceDate = hasMaintenanceDates
    ? new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      ).toISOString()
    : undefined;

  const nextMaintenanceDate =
    status === "active"
      ? new Date(
          Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000,
        ).toISOString()
      : undefined;

  return {
    id: createId(),
    name: `${getRandomElement(namePrefix)} ${getRandomElement(nameSuffix)}`,
    model: `${getRandomElement(modelPrefixes)} ${getRandomElement(modelSuffixes)}`,
    maxSpeed: Math.floor(Math.random() * 300) + 100,
    maxWeight: (Math.floor(Math.random() * 1000) + 500).toString(),
    length: (Math.floor(Math.random() * 100) + 150).toString(),
    manufacturer: getRandomElement(manufacturerNames),
    yearManufactured: Math.floor(Math.random() * 6) + 2018,
    status,
    lastMaintenanceDate,
    nextMaintenanceDate,
    createdAt: now,
    updatedAt: now,
  };
}
