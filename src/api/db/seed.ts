import { eq } from "drizzle-orm";
import { db } from ".";
import {
  stationsTable as stationsTable,
  userTable,
  type StationInsert,
} from "./schema";

const userId = await db
  .select()
  .from(userTable)
  .where(eq(userTable.username, "rjp301"))
  .then((rows) => rows[0].id);

if (!userId) {
  throw new Error("User not found");
}

const sampleStations: StationInsert[] = [
  {
    userId,
    name: "SAEG Crooked",
    wuKey: "IREGIO61",
    lat: 54.653556,
    lon: -122.752946,
  },
  {
    userId,
    name: "SAEG Parsnip",
    wuKey: "IREGIO82",
    lat: 54.76181,
    lon: -122.49811,
  },
  {
    userId,
    name: "SAEG Crocker",
    wuKey: "IREGIO125",
    lat: 54.895774,
    lon: -122.243683,
  },
  {
    userId,
    name: "SAEG Headwall",
    wuKey: "IREGIO134",
    lat: 55.08484,
    lon: -122.118852,
  },
];

async function seed() {
  await db.delete(stationsTable);
  await db.insert(stationsTable).values(sampleStations);
}

seed()
  .then(() => {
    console.log("Seeded DB");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
