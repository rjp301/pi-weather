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

export const collections = { emails, stations };
