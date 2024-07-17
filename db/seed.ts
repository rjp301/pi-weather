import { generateId } from '@/api/helpers/generate-id';
import { db, Site, Station, User } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
  const { id: userId } = await db
    .insert(User)
    .values({
      id: generateId(),
      email: "rileypaul96@gmail.com",
      githubId: 71047303,
      githubUsername: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning()
		.then((rows) => rows[0]);
	
	const {id: siteId} = await db.insert(Site).values([{
		id: generateId(),
		userId,
		name: "SAEG - Coastal Gaslink",
	}]).returning().then((rows) => rows[0]);
	
	const stations = await db.insert(Station).values([{
		id: generateId(),
    siteId,
    name: "SAEG Crooked",
    wuKey: "IREGIO61",
    lat: 54.653556,
    lon: -122.752946,
  },
  {
		id: generateId(),
    siteId,
    name: "SAEG Parsnip",
    wuKey: "IREGIO82",
    lat: 54.76181,
    lon: -122.49811,
  },
  {
		id: generateId(),
    siteId,
    name: "SAEG Crocker",
    wuKey: "IREGIO125",
    lat: 54.895774,
    lon: -122.243683,
  },
  {
		id: generateId(),
    siteId,
    name: "SAEG Headwall",
    wuKey: "IREGIO134",
    lat: 55.08484,
    lon: -122.118852,
  },])
}
