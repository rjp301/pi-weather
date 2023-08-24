import type { APIRoute } from "astro";
import sendEmail from "@/lib/sendEmail";
import { DateTime } from "luxon";

export const post: APIRoute = async ({ url, params, redirect }) => {
  const test = Boolean(url.searchParams.get("test"));
  const dateString = url.searchParams.get("date");
  if (!dateString) return new Response(null, { status: 404 });

  const date = DateTime.fromISO(dateString);
  if (date.invalidReason) return new Response(null, { status: 404 });

  const html = await fetch(`${url.origin}/${dateString}/raw`).then((res) =>
    res.text()
  );

  const subject = `CGL S34 Weather Summary - ${date.toFormat("yyyy-LL-dd")}`;

  try {
    await sendEmail(subject, html, true);
    return redirect(`/sendEmail/sent?${url.searchParams.toString()}`);
  } catch {
    console.log("Could not send email");
    return redirect(`/sendEmail/fail?${url.searchParams.toString()}`);
  }
};
