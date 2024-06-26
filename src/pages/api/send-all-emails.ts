// import type { APIRoute } from "astro";
// import { DateTime } from "luxon";
// import { sendWeatherSummary } from "@/api/lib/sendWeatherSummary";

// export const POST: APIRoute = async ({ locals, url }) => {
//   const test = url.searchParams.get("test");

//   await locals.pb.admins
//     .authWithPassword(
//       import.meta.env.PB_AUTH_EMAIL,
//       import.meta.env.PB_AUTH_PASS
//     )
//     .catch((err) => {
//       console.error("could not login as admin");
//       console.error(err);
//       return new Response("Could not login as admin", { status: 500 });
//     });

//   const users = await locals.pb.collection("users").getFullList();
//   let emailsSent = 0;

//   for (let user of users) {
//     const currentHour = DateTime.now().setZone(user.time_zone).hour;
//     console.log(currentHour, user.email_time, user.username);
//     if (currentHour !== user.email_time) continue;

//     const dateString =
//       DateTime.now().setZone(user.time_zone).minus({ days: 1 }).toISODate() ||
//       "";

//     await sendWeatherSummary({
//       pb: locals.pb,
//       test: test === "true",
//       origin: url.origin,
//       dateString,
//       user,
//     });
//   }

//   return new Response(`Emails sent for ${emailsSent} users`);
// };
