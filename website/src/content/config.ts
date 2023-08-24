// Example: A cheatsheet of many common Zod datatypes
import { z, defineCollection } from "astro:content";

defineCollection({
  type: "data",
  schema: z.array(z.string()),
});
