import type { APIRoute } from "astro";
import { updateWeatherSummary } from "@/lib/getWeatherSummary";

export const post: APIRoute = async ({ url, request, redirect, locals }) => {
  const formData = await request.formData();

  const dateString = String(formData.get("date"));
  console.log(dateString);

  try {
    await updateWeatherSummary(locals.pb, locals.user.id, dateString);
  } catch (err) {
    console.log("Could not update weather");
    console.error(err);
  }
  return redirect(`/weather/${dateString}`);
};
