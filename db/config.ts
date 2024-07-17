import { column, defineDb, defineTable, NOW } from 'astro:db';

const id = column.text({ primaryKey: true });
const createdAt = column.text({ default: NOW });
const userId = column.text({ references: () => User.columns.id });
const siteId = column.text({ references: () => Site.columns.id });

const User = defineTable({
  columns: {
    id,
    email: column.text({ unique: true }),

    githubId: column.number({ unique: true, optional: true }),
    githubUsername: column.text({ unique: true, optional: true }),

    googleId: column.text({ unique: true, optional: true }),

    name: column.text(),
    avatarUrl: column.text({ optional: true }),
    createdAt,
  },
});

const UserSession = defineTable({
  columns: {
    id,
    userId,
    createdAt,
    expiresAt: column.number(),
  },
});

const Site = defineTable({
  columns: {
    id,
    userId,
    createdAt,
    name: column.text(),
    wuApiKey: column.text({default: "1234"}),
    timesOfInterest: column.json({default: {
      hours: [7, 13, 19],
      ranges: [
        { beg: 5, end: 17 },
        { beg: 17, end: 29 },
        { beg: 0, end: 24 },
      ],
    }}),
    timeZone: column.text({ default: 'America/Vancouver' }),
    emailTime: column.number({ default: 5 }),
  }
})

const Email = defineTable({
  columns: {
    id,
    siteId,
    email: column.text(),
    tester: column.boolean({ default: false }),
    createdAt,
  }
})

const Station = defineTable({
  columns: {
    id,
    siteId,
    name: column.text(),
    wuKey: column.text(),
    lat: column.number(),
    lon: column.number(),
    createdAt,  
  }
})

const Summary = defineTable({
  columns: {
    id,
    stationId: column.text(),
    date: column.text(),
    summary: column.json(),
    response: column.json(),
    createdAt,
  }
})



// https://astro.build/db/config
export default defineDb({
  tables: {User, UserSession, Email, Station, Site, Summary},
});
