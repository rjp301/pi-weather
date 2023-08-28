import { getWeatherSummary } from "@/lib/getWeatherSummary";
import type { APIRoute } from "astro";
import { DateTime } from "luxon";

export const get: APIRoute = async ({ locals, url }) => {
  try {
    await locals.pb.admins.authWithPassword(
      import.meta.env.PB_AUTH_EMAIL,
      import.meta.env.PB_AUTH_PASS
    );
  } catch (err) {
    console.error("could not login as admin");
    console.error(err);
  }

  const users = await locals.pb.collection("users").getFullList();
  const dateString = DateTime.now().minus({ days: 1 }).toISODate();

  for (let user of users) {
    console.log(user.username);
    const summary = await getWeatherSummary(locals.pb, user.id, "2023-08-26");
    const encodedSummary = encodeURI(JSON.stringify(summary));

    const html = await fetch(
      `${url.origin}/weather/${dateString}/raw?data=${encodedSummary}`
    ).then((res) => res.text());

    const emails = (
      await locals.pb
        .collection("emails")
        .getFullList({ filter: `user = "${user.id}"` })
    ).map((record) => record.email);

    console.log(emails);
  }

  return new Response(JSON.stringify(users));
};
