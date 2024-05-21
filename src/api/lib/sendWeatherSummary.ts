import { DateTime } from "luxon";
import PocketBase from "pocketbase";
import { getWeatherSummary } from "./getWeatherSummary";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(import.meta.env.SG_API_KEY!);

export interface SendWeatherSummaryProps {
  pb: PocketBase;
  user: PocketBase["authStore"]["model"];
  dateString: string;
  origin: string;
  test?: boolean;
}

export const sendWeatherSummary = async (props: SendWeatherSummaryProps) => {
  const { pb, user, test, dateString, origin } = props;

  if (!user) return new Response("No user", { status: 500 });

  const emails = await pb
    .collection("emails")
    .getFullList({ filter: `user = "${user.id}"` })
    .then((records) =>
      records
        .filter((record) => (test ? record.tester : true))
        .map((record) => record.email as string)
    )
    .catch((err) => {
      console.log("Could not get emails");
      console.error(err);
      throw new Response("Could not get emails", { status: 500 });
    });
  console.log(emails);

  const html = await getWeatherSummary(pb, user.id, dateString)
    .then((summary) => encodeURI(JSON.stringify(summary)))
    .then((encodedSummary) => {
      const url = `${origin}/weather/${dateString}/raw?data=${encodedSummary}`;
      return fetch(url);
    })
    .then((res) => res.text())
    .catch((err) => {
      console.log("Could not get summary");
      console.error(err);
      throw new Response("Could not get summary", { status: 500 });
    });

  const subject = `${user.email_subject_prefix} - ${dateString}`;

  const msg: sgMail.MailDataRequired = {
    to: emails,
    from: user.email,
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
