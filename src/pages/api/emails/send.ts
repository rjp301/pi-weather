import type { APIRoute } from "astro";
import sendEmail from "@/lib/sendEmail";
import { getWeatherSummary } from "@/lib/getWeatherSummary";

export const post: APIRoute = async ({ url, request, redirect, locals }) => {
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
    const subject = `CGL S34 Weather Summary - ${dateString}`;
    const emails = (
      await locals.pb
        .collection("emails")
        .getFullList({ filter: test ? "tester = true" : "" })
    ).map((record) => record.email);
    console.log(emails)

    await sendEmail(emails, subject, html);
    return redirect(`/emails/sent?test=${test}`);
  } catch {
    console.log("Could not send email");
    return redirect(`/emails/fail?test=${test}`);
  }
};
