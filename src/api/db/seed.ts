import { db } from ".";
import {
  stations as stationsTable,
  type StationInsert,
} from "./schema";

const sampleStations: StationInsert[] = [
  {
    name: "SAEG Crooked",
    wuKey: "IREGIO61",
    lat: 54.653556,
    lon: -122.752946,
  },
  {
    name: "SAEG Parsnip",
    wuKey: "IREGIO82",
    lat: 54.76181,
    lon: -122.49811,
  },
  {
    name: "SAEG Crocker",
    wuKey: "IREGIO125",
    lat: 54.895774,
    lon: -122.243683,
  },
  {
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
