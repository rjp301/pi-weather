// Example: A cheatsheet of many common Zod datatypes
import { z, defineCollection } from "astro:content";

const emails = defineCollection({
  type: "data",
  schema: z.array(z.string()),
});

const stations = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    id: z.string(),
    lat: z.number(),
    lon: z.number(),
    exclude: z.boolean().optional(),
  }),
});

const timesOfInterest = defineCollection({
  type: "data",
  schema: z.object({
    hours: z.array(z.number()),
    ranges: z.array(z.object({ beg: z.number(), end: z.number() })),
  }),
});

export const collections = { emails, stations, timesOfInterest };
