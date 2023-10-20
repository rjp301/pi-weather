import type { APIRoute } from "astro";
import { getWeatherSummary } from "@/lib/getWeatherSummary";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(import.meta.env.SG_API_KEY!);

export const POST: APIRoute = async ({ url, request, redirect, locals }) => {
  const formData = await request.formData();

  const test = formData.get("test") === "on";
  const dateString = String(formData.get("date"));

  console.log(test, dateString);

  const emails = await locals.pb
    .collection("emails")
    .getFullList({ filter: test ? "tester = true" : "" })
    .then((records) => records.map((record) => record.email as string))
    .catch((err) => {
      console.log("Could not get emails");
      console.error(err);
      throw new Response("Could not get emails", { status: 500 });
    });
  console.log(emails);

  const subject = `${locals.user.email_subject_prefix} - ${dateString}`;

  const html = await getWeatherSummary(locals.pb, locals.user.id, dateString)
    .then((summary) => encodeURI(JSON.stringify(summary)))
    .then((encodedSummary) =>
      fetch(`${url.origin}/weather/${dateString}/raw?data=${encodedSummary}`)
    )
    .then((res) => res.text())
    .catch((err) => {
      console.log("Could not get summary");
      console.error(err);
      throw new Response("Could not get summary", { status: 500 });
    });

  const msg: sgMail.MailDataRequired = {
    to: emails,
    from: locals.user.email,
    subject,
    html,
  };

  return sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return new Response("Email sent");
    })
    .catch((err) => {
      console.log("Could not send email");
      console.error(err);
      const responseBody = { title: err.message, description: err.stack };
      return new Response(JSON.stringify(responseBody), { status: 500 });
    });
};
