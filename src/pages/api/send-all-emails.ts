import { getWeatherSummary } from "@/lib/getWeatherSummary";
import sendEmail from "@/lib/sendEmail";
import type { APIRoute } from "astro";
import { DateTime } from "luxon";

export const get: APIRoute = async ({ locals, url }) => {
  const test = url.searchParams.get("test");

  try {
    await locals.pb.admins.authWithPassword(
      import.meta.env.PB_AUTH_EMAIL,
      import.meta.env.PB_AUTH_PASS
    );
  } catch (err) {
    console.error("could not login as admin");
    console.error(err);
    return new Response("could not login as admin", { status: 500 });
  }

  const users = await locals.pb.collection("users").getFullList();
  let emailsSent = 0;

  for (let user of users) {
    const currentHour = DateTime.now().setZone(user.time_zone).hour;
    console.log(currentHour, user.username);
    if (currentHour !== user.email_time) continue;

    const dateString =
      DateTime.now().setZone(user.time_zone).minus({ days: 1 }).toISODate() ||
      "";
    const summary = await getWeatherSummary(locals.pb, user.id, dateString);
    const encodedSummary = encodeURI(JSON.stringify(summary));

    const html = await fetch(
      `${url.origin}/weather/${dateString}/raw?data=${encodedSummary}`
    ).then((res) => res.text());

    const emails = (
      await locals.pb
        .collection("emails")
        .getFullList({ filter: `user = "${user.id}"` })
    )
      .filter((record) => (test ? record.tester : true))
      .map((record) => record.email);

    const subject = `${user.email_subject_prefix} - ${dateString}`;

    try {
      await sendEmail(emails, subject, html, user.email);
      console.log(`Sent emails for ${user.username}`);
      emailsSent += 1;
    } catch {
      console.log(`Could not send emails for ${user.username}`);
    }
  }

  return new Response(`Emails sent for ${emailsSent} users`);
};
