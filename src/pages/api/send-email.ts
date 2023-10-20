import type { APIRoute } from "astro";
import sendEmail from "@/lib/sendEmail";
import { getWeatherSummary } from "@/lib/getWeatherSummary";

export const POST: APIRoute = async ({ url, request, redirect, locals }) => {
  const formData = await request.formData();

  const test = formData.get("test") === "on";
  const dateString = String(formData.get("date"));

  console.log(test, dateString);

  try {
    const summary = await getWeatherSummary(
      locals.pb,
      locals.user.id,
      dateString
    );
    const encodedSummary = encodeURI(JSON.stringify(summary));

    const html = await fetch(
      `${url.origin}/weather/${dateString}/raw?data=${encodedSummary}`
    ).then((res) => res.text());
    const subject = `${locals.user.email_subject_prefix} - ${dateString}`;
    const emails = (
      await locals.pb
        .collection("emails")
        .getFullList({ filter: test ? "tester = true" : "" })
    ).map((record) => record.email);
    console.log(emails);

    await sendEmail(emails, subject, html, locals.user.email);
    return new Response("Email sent");
  } catch {
    console.log("Could not send email");
    return new Response("Could not send email", { status: 500 });
  }
};
